"""
Task Skills - Manage tasks in SQLite database.
"""

import sqlite3
from datetime import datetime
from pathlib import Path
from .base import SyncSkill, SkillResult, ApprovalCategory


DB_PATH = Path("/var/www/zaylegend/brain.db")


def get_db_connection():
    """Get SQLite connection."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def ensure_tables():
    """Ensure required tables exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            priority INTEGER DEFAULT 3,
            app TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()


class TaskCreateSkill(SyncSkill):
    """Create a new task."""

    name = "task_create"
    description = "Create a new task in the task board"
    trigger_intents = ["add_task", "create_task", "new_task", "task_add"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Task title"
                },
                "description": {
                    "type": "string",
                    "description": "Task description",
                    "default": ""
                },
                "priority": {
                    "type": "integer",
                    "description": "Priority 1-5 (1=highest)",
                    "default": 3,
                    "minimum": 1,
                    "maximum": 5
                },
                "app": {
                    "type": "string",
                    "description": "Related app name",
                    "default": ""
                }
            },
            "required": ["title"]
        }

    def execute_sync(self, params: dict) -> SkillResult:
        title = params.get("title", "").strip()
        if not title:
            return SkillResult(
                context_data="Error: title is required",
                success=False,
                is_error=True
            )

        ensure_tables()

        description = params.get("description", "")
        priority = max(1, min(5, int(params.get("priority", 3))))
        app = params.get("app", "")

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute('''
                INSERT INTO tasks (title, description, priority, app, status)
                VALUES (?, ?, ?, ?, 'pending')
            ''', (title, description, priority, app))

            task_id = cursor.lastrowid
            conn.commit()
            conn.close()

            return SkillResult(
                context_data=f"Created task #{task_id}: {title}",
                success=True,
                metadata={"task_id": task_id, "title": title}
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Failed to create task: {str(e)}",
                success=False,
                is_error=True
            )


class TaskListSkill(SyncSkill):
    """List tasks from the database."""

    name = "task_list"
    description = "List pending tasks from the task board"
    trigger_intents = ["list_tasks", "show_tasks", "tasks", "get_tasks"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "enum": ["pending", "in_progress", "done", "all"],
                    "default": "pending"
                },
                "limit": {
                    "type": "integer",
                    "description": "Max number of tasks to return",
                    "default": 20
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        status_filter = params.get("status", "pending")
        limit = min(100, int(params.get("limit", 20)))

        ensure_tables()

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            if status_filter == "all":
                cursor.execute('''
                    SELECT id, title, status, priority, app, created_at
                    FROM tasks
                    ORDER BY priority ASC, created_at DESC
                    LIMIT ?
                ''', (limit,))
            else:
                cursor.execute('''
                    SELECT id, title, status, priority, app, created_at
                    FROM tasks
                    WHERE status = ?
                    ORDER BY priority ASC, created_at DESC
                    LIMIT ?
                ''', (status_filter, limit))

            rows = cursor.fetchall()
            conn.close()

            if not rows:
                return SkillResult(
                    context_data=f"No {status_filter} tasks found",
                    success=True,
                    metadata={"count": 0}
                )

            lines = [f"Tasks ({status_filter}):"]
            for row in rows:
                priority_icon = ["", "[!!!]", "[!!]", "[!]", "", ""][row["priority"]]
                app_tag = f" [{row['app']}]" if row["app"] else ""
                status_icon = {"pending": "[ ]", "in_progress": "[~]", "done": "[x]"}.get(row["status"], "[ ]")
                lines.append(f"  {status_icon} #{row['id']} {priority_icon} {row['title']}{app_tag}")

            return SkillResult(
                context_data="\n".join(lines),
                success=True,
                metadata={"count": len(rows)}
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Failed to list tasks: {str(e)}",
                success=False,
                is_error=True
            )


class TaskDoneSkill(SyncSkill):
    """Mark a task as completed."""

    name = "task_done"
    description = "Mark a task as completed"
    trigger_intents = ["complete_task", "done", "finish_task", "task_done"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "ID of the task to complete"
                }
            },
            "required": ["task_id"]
        }

    def execute_sync(self, params: dict) -> SkillResult:
        task_id = params.get("task_id")
        if not task_id:
            return SkillResult(
                context_data="Error: task_id is required",
                success=False,
                is_error=True
            )

        ensure_tables()

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Get the task first
            cursor.execute('SELECT title FROM tasks WHERE id = ?', (task_id,))
            row = cursor.fetchone()

            if not row:
                conn.close()
                return SkillResult(
                    context_data=f"Task #{task_id} not found",
                    success=False,
                    is_error=True
                )

            title = row["title"]

            # Update the task
            cursor.execute('''
                UPDATE tasks
                SET status = 'done', completed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (task_id,))

            conn.commit()
            conn.close()

            return SkillResult(
                context_data=f"Completed task #{task_id}: {title}",
                success=True,
                metadata={"task_id": task_id, "title": title}
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Failed to complete task: {str(e)}",
                success=False,
                is_error=True
            )


class TaskUpdateSkill(SyncSkill):
    """Update a task's status or details."""

    name = "task_update"
    description = "Update a task's status, priority, or description"
    trigger_intents = ["update_task", "edit_task", "task_update"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "ID of the task to update"
                },
                "status": {
                    "type": "string",
                    "enum": ["pending", "in_progress", "done"]
                },
                "priority": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5
                },
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                }
            },
            "required": ["task_id"]
        }

    def execute_sync(self, params: dict) -> SkillResult:
        task_id = params.get("task_id")
        if not task_id:
            return SkillResult(
                context_data="Error: task_id is required",
                success=False,
                is_error=True
            )

        ensure_tables()

        updates = []
        values = []

        if "status" in params:
            updates.append("status = ?")
            values.append(params["status"])
            if params["status"] == "done":
                updates.append("completed_at = CURRENT_TIMESTAMP")

        if "priority" in params:
            updates.append("priority = ?")
            values.append(max(1, min(5, int(params["priority"]))))

        if "title" in params:
            updates.append("title = ?")
            values.append(params["title"])

        if "description" in params:
            updates.append("description = ?")
            values.append(params["description"])

        if not updates:
            return SkillResult(
                context_data="No updates provided",
                success=False,
                is_error=True
            )

        values.append(task_id)

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?"
            cursor.execute(query, values)

            if cursor.rowcount == 0:
                conn.close()
                return SkillResult(
                    context_data=f"Task #{task_id} not found",
                    success=False,
                    is_error=True
                )

            conn.commit()
            conn.close()

            return SkillResult(
                context_data=f"Updated task #{task_id}",
                success=True,
                metadata={"task_id": task_id, "updates": list(params.keys())}
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Failed to update task: {str(e)}",
                success=False,
                is_error=True
            )
