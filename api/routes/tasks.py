"""
Tasks API Routes
"""

import sqlite3
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

DB_PATH = Path("/var/www/zaylegend/brain.db")


def get_db():
    """Get database connection."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: int = 3
    app: str = ""


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None


@router.get("")
async def list_tasks(status: str = "pending", limit: int = 50):
    """List tasks, optionally filtered by status."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        if status == "all":
            cursor.execute('''
                SELECT id, title, description, status, priority, app, created_at, completed_at
                FROM tasks
                ORDER BY priority ASC, created_at DESC
                LIMIT ?
            ''', (limit,))
        else:
            cursor.execute('''
                SELECT id, title, description, status, priority, app, created_at, completed_at
                FROM tasks
                WHERE status = ?
                ORDER BY priority ASC, created_at DESC
                LIMIT ?
            ''', (status, limit))

        rows = cursor.fetchall()
        conn.close()

        tasks = [dict(row) for row in rows]
        return {
            "count": len(tasks),
            "status_filter": status,
            "tasks": tasks,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
async def create_task(task: TaskCreate):
    """Create a new task."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO tasks (title, description, priority, app, status)
            VALUES (?, ?, ?, ?, 'pending')
        ''', (task.title, task.description, max(1, min(5, task.priority)), task.app))

        task_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return {
            "id": task_id,
            "title": task.title,
            "status": "created",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}")
async def get_task(task_id: int):
    """Get a specific task."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, title, description, status, priority, app, created_at, completed_at
            FROM tasks WHERE id = ?
        ''', (task_id,))

        row = cursor.fetchone()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

        return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{task_id}")
async def update_task(task_id: int, update: TaskUpdate):
    """Update a task."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        # Build update query
        updates = []
        values = []

        if update.title is not None:
            updates.append("title = ?")
            values.append(update.title)

        if update.description is not None:
            updates.append("description = ?")
            values.append(update.description)

        if update.status is not None:
            updates.append("status = ?")
            values.append(update.status)
            if update.status == "done":
                updates.append("completed_at = ?")
                values.append(datetime.now().isoformat())

        if update.priority is not None:
            updates.append("priority = ?")
            values.append(max(1, min(5, update.priority)))

        if not updates:
            raise HTTPException(status_code=400, detail="No updates provided")

        values.append(task_id)
        query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?"

        cursor.execute(query, values)

        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

        conn.commit()
        conn.close()

        return {"id": task_id, "status": "updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{task_id}/done")
async def complete_task(task_id: int):
    """Mark a task as done."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE tasks
            SET status = 'done', completed_at = ?
            WHERE id = ?
        ''', (datetime.now().isoformat(), task_id))

        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

        conn.commit()
        conn.close()

        return {"id": task_id, "status": "completed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete a task."""
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

        conn.commit()
        conn.close()

        return {"id": task_id, "status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
