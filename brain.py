#!/usr/bin/env python3
"""
Portfolio Brain - Command Center for zaylegend.com
Usage: brain <command> [options]

Commands:
  status              Show portfolio status at a glance
  deploy              Deploy latest changes
  backup              Run local backup
  apps                List all apps by category
  apps health         Check which apps are responding
  apps restart <name> Restart a specific app container
  task add <title>    Add a new task
  task list           Show all pending tasks
  task done <id>      Mark a task as complete
  task all            Show all tasks including completed
  session start       Start a new work session
  session end <title> End session, create blog post, deploy
  session list        Show recent sessions
  help                Show this help message
"""

import subprocess
import sys
import os
import socket
import sqlite3
import re
import json
from datetime import datetime

# Configuration
PORTFOLIO_DIR = "/var/www/zaylegend"
SCRIPTS_DIR = f"{PORTFOLIO_DIR}/scripts"
DB_PATH = f"{PORTFOLIO_DIR}/brain.db"
BLOG_TS_PATH = f"{PORTFOLIO_DIR}/src/data/blog.ts"
SESSION_FILE = f"{PORTFOLIO_DIR}/.current_session"

# App registry with categories and ports
# Format: "name": (port, "category", "container_name")
APPS = {
    # Finished apps (12)
    "portfolio":        (8080, "finished", None),
    "zen-reset":        (8081, "finished", "zen-reset-new"),
    "chord-genesis":    (3001, "finished", "chord-genesis"),
    "fineline":         (3003, "finished", "fineline"),
    "game-hub":         (3004, "finished", "game-hub"),
    "dj-visualizer":    (3005, "finished", "dj-visualizer"),
    "sprite-gen":       (3006, "finished", "spritegen"),
    "voice-assistant":  (3007, "finished", "voice-assistant-frontend"),
    "knowledge-base":   (3008, "finished", None),  # Not containerized
    "contentforge":     (3009, "finished", None),
    "sensei-ai":        (None, "finished", None),  # External
    "wolf-ai":          (None, "finished", None),  # External
    "cloud-llm":        (None, "finished", None),  # External

    # Testing apps (7)
    "darkflow":         (3010, "testing", "darkflow-mind-mapper"),
    "gmat":             (3012, "testing", "gmat-mastery-suite"),
    "losk":             (3013, "testing", "losk"),
    "got-hired":        (3014, "testing", "got-hired-ai"),
    "bh-ai-79":         (3015, "testing", "bh-ai-79"),
    "purple-lotus":     (3016, "testing", "purple-lotus"),
    "zen-tot":          (3017, "testing", "zen-tot"),

    # Upgrading apps (4) - not deployed yet
    "ashley-v3":        (None, "upgrading", None),
    "sensei-ai-io":     (None, "upgrading", None),
    "ask-hr-beta":      (None, "upgrading", None),
    "sop-ai-beta":      (None, "upgrading", None),

    # Other running apps
    "forge-fit":        (3018, "testing", "forge-fit"),
}

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    END = '\033[0m'

def color(text, c):
    return f"{c}{text}{Colors.END}"

def run(cmd, capture=True, cwd=PORTFOLIO_DIR):
    """Run a command and return output"""
    result = subprocess.run(
        cmd, shell=True, capture_output=capture, text=True, cwd=cwd
    )
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def check_port(port, host="localhost", timeout=1):
    """Check if a port is responding"""
    if port is None:
        return None
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

# ============ DATABASE ============

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority INTEGER DEFAULT 3,
            app TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE,
            summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()

def get_db():
    """Get database connection"""
    init_db()
    return sqlite3.connect(DB_PATH)

# ============ COMMANDS ============

def cmd_status():
    """Show portfolio status at a glance"""
    print(color("\n Portfolio Brain Status\n", Colors.BOLD + Colors.CYAN))
    print("=" * 50)

    # Nginx status
    _, _, code = run("systemctl is-active nginx")
    nginx_status = color("Running", Colors.GREEN) if code == 0 else color("Down", Colors.RED)
    print(f"  Nginx:              {nginx_status}")

    # Docker containers
    out, _, _ = run("docker ps --format '{{.Names}}' 2>/dev/null | wc -l")
    container_count = out.strip() or "0"
    print(f"  Docker Containers:  {color(container_count, Colors.CYAN)} running")

    # Git status
    out, _, _ = run("git status --short 2>/dev/null | wc -l")
    changes = int(out.strip() or "0")
    change_color = Colors.YELLOW if changes > 0 else Colors.GREEN
    print(f"  Uncommitted Files:  {color(str(changes), change_color)}")

    # Current branch
    out, _, _ = run("git branch --show-current 2>/dev/null")
    print(f"  Git Branch:         {color(out or 'unknown', Colors.BLUE)}")

    # Last commit
    out, _, _ = run("git log -1 --format='%s (%ar)' 2>/dev/null")
    print(f"  Last Commit:        {out[:45]}..." if len(out) > 45 else f"  Last Commit:        {out}")

    # Disk usage
    out, _, _ = run("df -h /var/www | tail -1 | awk '{print $5}'")
    print(f"  Disk Usage:         {out}")

    # Pending tasks
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
    pending = c.fetchone()[0]
    conn.close()
    task_color = Colors.YELLOW if pending > 0 else Colors.GREEN
    print(f"  Pending Tasks:      {color(str(pending), task_color)}")

    # Quick health check
    print(f"\n  {color('Quick Health Check:', Colors.BOLD)}")
    critical_apps = ["portfolio", "chord-genesis", "contentforge", "voice-assistant"]
    for app in critical_apps:
        port = APPS.get(app, (None,))[0]
        if port:
            is_up = check_port(port)
            status = color("UP", Colors.GREEN) if is_up else color("DOWN", Colors.RED)
            print(f"    {app}: {status} (:{port})")

    print("\n" + "=" * 50)
    print(f"  {color('brain apps health', Colors.CYAN)} - full health check")
    print(f"  {color('brain task list', Colors.CYAN)}  - view pending tasks")
    print()

def cmd_deploy():
    """Deploy latest changes"""
    print(color("\n Deploying Portfolio...\n", Colors.BOLD + Colors.CYAN))
    deploy_script = f"{SCRIPTS_DIR}/deploy.sh"
    if os.path.exists(deploy_script):
        subprocess.run(deploy_script, shell=True, cwd=PORTFOLIO_DIR)
    else:
        print(color("Error: deploy.sh not found", Colors.RED))
        sys.exit(1)

def cmd_backup():
    """Run local backup"""
    print(color("\n Running Backup...\n", Colors.BOLD + Colors.CYAN))
    backup_script = f"{SCRIPTS_DIR}/backup.sh"
    if os.path.exists(backup_script):
        subprocess.run(backup_script, shell=True, cwd=PORTFOLIO_DIR)
    else:
        print(color("Error: backup.sh not found", Colors.RED))
        sys.exit(1)

def cmd_apps(subcommand=None, app_name=None):
    """Manage apps"""
    if subcommand == "health":
        cmd_apps_health()
    elif subcommand == "restart" and app_name:
        cmd_apps_restart(app_name)
    elif subcommand == "list" or subcommand is None:
        cmd_apps_list()
    else:
        print("Usage: brain apps [list|health|restart <name>]")

def cmd_apps_list():
    """List all apps by category"""
    print(color("\n Apps Inventory\n", Colors.BOLD + Colors.CYAN))

    categories = {
        "finished": ("Finished", Colors.GREEN),
        "testing": ("Testing", Colors.YELLOW),
        "upgrading": ("Upgrading", Colors.MAGENTA),
    }

    for cat_key, (cat_name, cat_color) in categories.items():
        apps_in_cat = [(name, info) for name, info in APPS.items() if info[1] == cat_key]
        print(f"\n  {color(f'[{cat_name}]', Colors.BOLD + cat_color)} ({len(apps_in_cat)})")
        print("  " + "-" * 40)

        for name, (port, _, container) in sorted(apps_in_cat):
            port_str = f":{port}" if port else "external"
            print(f"    {name:<20} {color(port_str, Colors.DIM)}")

    print(f"\n  Total: {len(APPS)} apps tracked")
    print()

def cmd_apps_health():
    """Check health of all apps with ports"""
    print(color("\n Apps Health Check\n", Colors.BOLD + Colors.CYAN))
    print("=" * 55)

    up_count = 0
    down_count = 0
    external_count = 0

    categories = ["finished", "testing", "upgrading"]

    for category in categories:
        apps_in_cat = [(n, i) for n, i in APPS.items() if i[1] == category]
        if not apps_in_cat:
            continue

        cat_color = {"finished": Colors.GREEN, "testing": Colors.YELLOW, "upgrading": Colors.MAGENTA}[category]
        print(f"\n  {color(f'[{category.upper()}]', Colors.BOLD + cat_color)}")

        for name, (port, _, _) in sorted(apps_in_cat, key=lambda x: x[1][0] or 9999):
            if port is None:
                status = color("EXT ", Colors.DIM)
                port_str = "     "
                external_count += 1
            else:
                is_up = check_port(port)
                if is_up:
                    status = color("UP  ", Colors.GREEN)
                    up_count += 1
                else:
                    status = color("DOWN", Colors.RED)
                    down_count += 1
                port_str = f":{port}"
            print(f"    {status}  {name:<20} {color(port_str, Colors.DIM)}")

    print("\n" + "=" * 55)
    print(f"  {color(str(up_count), Colors.GREEN)} up, {color(str(down_count), Colors.RED)} down, {color(str(external_count), Colors.DIM)} external")
    print()

def cmd_apps_restart(app_name):
    """Restart a specific app container"""
    print(color(f"\n Restarting {app_name}...\n", Colors.BOLD + Colors.CYAN))

    # Check if app exists and get container name
    if app_name in APPS:
        container = APPS[app_name][2]
        if container:
            out, err, code = run(f"docker restart {container} 2>&1")
            if code == 0:
                print(color(f"  Restarted {container}", Colors.GREEN))
                return
            else:
                print(color(f"  Failed: {err}", Colors.RED))
                return

    # Try fuzzy match on container names
    containers, _, _ = run("docker ps -a --format '{{.Names}}'")
    container_list = containers.split('\n')

    for c in container_list:
        if app_name.lower() in c.lower():
            out, err, code = run(f"docker restart {c} 2>&1")
            if code == 0:
                print(color(f"  Restarted {c}", Colors.GREEN))
                return

    print(color(f"  Container '{app_name}' not found", Colors.RED))
    print(f"  Available: {', '.join(container_list[:5])}...")

# ============ TASK COMMANDS ============

def cmd_task(subcommand=None, *args):
    """Manage tasks"""
    if subcommand == "add" and args:
        cmd_task_add(" ".join(args))
    elif subcommand == "list" or subcommand is None:
        cmd_task_list(show_all=False)
    elif subcommand == "all":
        cmd_task_list(show_all=True)
    elif subcommand == "done" and args:
        cmd_task_done(args[0])
    else:
        print("Usage: brain task [add <title>|list|done <id>|all]")

def cmd_task_add(title):
    """Add a new task"""
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
    task_id = c.lastrowid
    conn.commit()
    conn.close()

    print(color(f"\n Task #{task_id} added\n", Colors.BOLD + Colors.GREEN))
    print(f"  {title}")
    print()

def cmd_task_list(show_all=False):
    """List tasks"""
    conn = get_db()
    c = conn.cursor()

    if show_all:
        c.execute("SELECT id, title, status, created_at FROM tasks ORDER BY status DESC, id DESC")
        header = "All Tasks"
    else:
        c.execute("SELECT id, title, status, created_at FROM tasks WHERE status = 'pending' ORDER BY id DESC")
        header = "Pending Tasks"

    tasks = c.fetchall()
    conn.close()

    print(color(f"\n {header}\n", Colors.BOLD + Colors.CYAN))
    print("=" * 55)

    if not tasks:
        print(f"  {color('No tasks found', Colors.DIM)}")
    else:
        for task_id, title, status, created_at in tasks:
            if status == "completed":
                status_icon = color("[x]", Colors.GREEN)
                title_display = color(title[:40], Colors.DIM)
            else:
                status_icon = color("[ ]", Colors.YELLOW)
                title_display = title[:40]

            print(f"  {status_icon} #{task_id:<3} {title_display}")

    print("=" * 55)
    add_cmd = 'brain task add "title"'
    done_cmd = 'brain task done <id>'
    print(f"  {color(add_cmd, Colors.CYAN)} to add")
    print(f"  {color(done_cmd, Colors.CYAN)} to complete")
    print()

def cmd_task_done(task_id):
    """Mark a task as complete"""
    try:
        task_id = int(task_id)
    except ValueError:
        print(color("Error: task ID must be a number", Colors.RED))
        return

    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT title FROM tasks WHERE id = ?", (task_id,))
    task = c.fetchone()

    if not task:
        print(color(f"Error: task #{task_id} not found", Colors.RED))
        conn.close()
        return

    c.execute(
        "UPDATE tasks SET status = 'completed', completed_at = ? WHERE id = ?",
        (datetime.now().isoformat(), task_id)
    )
    conn.commit()
    conn.close()

    print(color(f"\n Task #{task_id} completed\n", Colors.BOLD + Colors.GREEN))
    print(f"  {task[0]}")
    print()

# ============ SESSION COMMANDS ============

def cmd_session(subcommand=None, *args):
    """Manage sessions"""
    if subcommand == "start":
        cmd_session_start()
    elif subcommand == "end" and args:
        cmd_session_end(" ".join(args))
    elif subcommand == "list":
        cmd_session_list()
    else:
        print("Usage: brain session [start|end <title>|list]")

def cmd_session_start():
    """Start a new work session"""
    now = datetime.now()

    # Check if session already active
    if os.path.exists(SESSION_FILE):
        with open(SESSION_FILE, 'r') as f:
            data = json.load(f)
        start_time = datetime.fromisoformat(data['start_time'])
        print(color(f"\n Session already active\n", Colors.YELLOW))
        print(f"  Started: {start_time.strftime('%Y-%m-%d %H:%M')}")
        print(f"  Duration: {str(now - start_time).split('.')[0]}")
        end_cmd = 'brain session end "title"'
        print(f"\n  Run {color(end_cmd, Colors.CYAN)} to finish")
        print()
        return

    # Create new session
    session_data = {
        'start_time': now.isoformat(),
        'tasks_at_start': get_pending_task_count()
    }

    with open(SESSION_FILE, 'w') as f:
        json.dump(session_data, f)

    print(color(f"\n Session started\n", Colors.BOLD + Colors.GREEN))
    print(f"  Time: {now.strftime('%Y-%m-%d %H:%M')}")
    print(f"  Pending tasks: {session_data['tasks_at_start']}")
    end_hint = 'brain session end "What you built"'
    print(f"\n  When done, run: {color(end_hint, Colors.CYAN)}")
    print()

def cmd_session_end(title):
    """End session, create blog post, and deploy"""
    now = datetime.now()

    # Check if session is active
    if not os.path.exists(SESSION_FILE):
        print(color("\n No active session\n", Colors.RED))
        print(f"  Run {color('brain session start', Colors.CYAN)} first")
        print()
        return

    # Load session data
    with open(SESSION_FILE, 'r') as f:
        data = json.load(f)

    start_time = datetime.fromisoformat(data['start_time'])
    duration = now - start_time
    duration_str = str(duration).split('.')[0]

    # Get completed tasks since session start
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT title FROM tasks
        WHERE status = 'completed'
        AND completed_at >= ?
        ORDER BY completed_at
    """, (data['start_time'],))
    completed_tasks = [row[0] for row in c.fetchall()]
    conn.close()

    # Get git commits since session start
    git_log, _, _ = run(f"git log --since='{start_time.isoformat()}' --oneline 2>/dev/null")
    commits = git_log.strip().split('\n') if git_log.strip() else []

    print(color(f"\n Ending session...\n", Colors.BOLD + Colors.CYAN))
    print(f"  Duration: {duration_str}")
    print(f"  Tasks completed: {len(completed_tasks)}")
    print(f"  Commits: {len(commits)}")

    # Create blog post
    post_id = f"session-{now.strftime('%Y-%m-%d')}"
    date_str = now.strftime('%Y-%m-%d')
    read_time = max(2, len(completed_tasks) + len(commits))

    # Build content
    content_parts = [f"# Session: {now.strftime('%Y-%m-%d')}\\n\\n## Summary\\n{title}"]

    if completed_tasks:
        content_parts.append("\\n\\n## Tasks Completed")
        for task in completed_tasks:
            content_parts.append(f"\\n- {task}")

    if commits:
        content_parts.append("\\n\\n## Commits")
        for commit in commits[:10]:  # Limit to 10
            content_parts.append(f"\\n- {commit}")

    content_parts.append(f"\\n\\n## Stats\\n- Duration: {duration_str}\\n- Tasks: {len(completed_tasks)}\\n- Commits: {len(commits)}")

    content = "".join(content_parts)

    # Generate tags from title
    tags = ['Session']
    keywords = ['CLI', 'API', 'Docker', 'Deploy', 'Fix', 'Feature', 'Bug', 'UI', 'Database', 'Auth']
    for kw in keywords:
        if kw.lower() in title.lower():
            tags.append(kw)
    if len(tags) < 3:
        tags.append('Development')

    # Create the blog post entry
    escaped_title = title.replace("'", "\\'")
    escaped_content = content.replace('`', '\\`')
    tasks_count = len(completed_tasks)
    commits_count = len(commits)
    tags_json = json.dumps(tags)

    new_post = f'''  {{
    id: '{post_id}',
    title: '{escaped_title}',
    excerpt: 'Work session - {tasks_count} tasks completed, {commits_count} commits.',
    content: `
{escaped_content}
    `,
    author: 'Isayah Young-Burke',
    date: '{date_str}',
    readTime: '{read_time} min read',
    category: 'sessions',
    tags: {tags_json}
  }},'''

    # Insert into blog.ts
    print(f"  Creating blog post...")

    try:
        with open(BLOG_TS_PATH, 'r') as f:
            blog_content = f.read()

        # Find the insertion point (after "export const blogPosts: BlogPost[] = [")
        insert_marker = "export const blogPosts: BlogPost[] = ["
        insert_pos = blog_content.find(insert_marker)

        if insert_pos == -1:
            print(color("  Error: Could not find insertion point in blog.ts", Colors.RED))
            return

        insert_pos += len(insert_marker)

        # Insert the new post
        new_content = blog_content[:insert_pos] + "\n" + new_post + blog_content[insert_pos:]

        with open(BLOG_TS_PATH, 'w') as f:
            f.write(new_content)

        print(color("  Blog post created", Colors.GREEN))
    except Exception as e:
        print(color(f"  Error creating blog post: {e}", Colors.RED))
        return

    # Build
    print(f"  Building...")
    _, err, code = run("npm run build", capture=True)
    if code != 0:
        print(color(f"  Build failed: {err}", Colors.RED))
        return
    print(color("  Build complete", Colors.GREEN))

    # Deploy (reload nginx)
    print(f"  Deploying...")
    run("sudo nginx -s reload", capture=True)
    print(color("  Deployed", Colors.GREEN))

    # Git commit
    print(f"  Committing...")
    run("git add src/data/blog.ts", capture=True)
    commit_msg = f"session: {title}"
    run(f'git commit -m "{commit_msg}"', capture=True)
    print(color("  Committed", Colors.GREEN))

    # Push
    print(f"  Pushing...")
    _, err, code = run("git push origin main", capture=True)
    if code == 0:
        print(color("  Pushed to GitHub", Colors.GREEN))
    else:
        print(color(f"  Push failed (commit saved locally)", Colors.YELLOW))

    # Save to sessions table
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO sessions (date, summary, created_at)
        VALUES (?, ?, ?)
    """, (date_str, title, now.isoformat()))
    conn.commit()
    conn.close()

    # Clean up session file
    os.remove(SESSION_FILE)

    print(color(f"\n Session complete!\n", Colors.BOLD + Colors.GREEN))
    print(f"  Blog post: /blog/{post_id}")
    print(f"  Duration: {duration_str}")
    print()

def cmd_session_list():
    """List recent sessions"""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT date, summary, created_at
        FROM sessions
        ORDER BY created_at DESC
        LIMIT 10
    """)
    sessions = c.fetchall()
    conn.close()

    print(color(f"\n Recent Sessions\n", Colors.BOLD + Colors.CYAN))
    print("=" * 55)

    if not sessions:
        print(f"  {color('No sessions recorded', Colors.DIM)}")
    else:
        for date, summary, created_at in sessions:
            print(f"  {color(date, Colors.BLUE)}  {summary[:40]}")

    print("=" * 55)

    # Check for active session
    if os.path.exists(SESSION_FILE):
        with open(SESSION_FILE, 'r') as f:
            data = json.load(f)
        start_time = datetime.fromisoformat(data['start_time'])
        duration = datetime.now() - start_time
        print(f"  {color('Active session:', Colors.GREEN)} {str(duration).split('.')[0]}")

    print()

def get_pending_task_count():
    """Get count of pending tasks"""
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
    count = c.fetchone()[0]
    conn.close()
    return count

def cmd_help():
    """Show help message"""
    print(__doc__)

# ============ MAIN ============

def main():
    if len(sys.argv) < 2:
        cmd_help()
        return

    command = sys.argv[1].lower()

    if command == "status":
        cmd_status()
    elif command == "deploy":
        cmd_deploy()
    elif command == "backup":
        cmd_backup()
    elif command == "apps":
        subcommand = sys.argv[2] if len(sys.argv) > 2 else None
        app_name = sys.argv[3] if len(sys.argv) > 3 else None
        cmd_apps(subcommand, app_name)
    elif command == "task":
        subcommand = sys.argv[2] if len(sys.argv) > 2 else None
        args = sys.argv[3:] if len(sys.argv) > 3 else []
        cmd_task(subcommand, *args)
    elif command == "session":
        subcommand = sys.argv[2] if len(sys.argv) > 2 else None
        args = sys.argv[3:] if len(sys.argv) > 3 else []
        cmd_session(subcommand, *args)
    elif command in ["help", "--help", "-h"]:
        cmd_help()
    else:
        print(f"Unknown command: {command}")
        print("Run 'brain help' for usage")
        sys.exit(1)

if __name__ == "__main__":
    main()
