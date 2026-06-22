"""
Forge User Database
SQLite-based user management for The Forge ecosystem.
"""

import sqlite3
import hashlib
import secrets
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List

DB_PATH = Path("/var/www/zaylegend/forge.db")


def get_connection() -> sqlite3.Connection:
    """Get database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database schema."""
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            created_at TEXT NOT NULL,
            last_login TEXT,
            is_active INTEGER DEFAULT 1
        )
    """)

    # XP events table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS xp_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            app TEXT NOT NULL,
            action TEXT NOT NULL,
            xp_earned INTEGER NOT NULL,
            metadata TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # User stats table (cached aggregates)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id TEXT PRIMARY KEY,
            total_xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            streak_days INTEGER DEFAULT 0,
            last_active TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Sessions table (for token management)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    """Hash password with salt."""
    salt = "forge_salt_2026"  # Simple salt for testing
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def generate_user_id() -> str:
    """Generate a unique user ID."""
    return secrets.token_hex(16)


def generate_session_token() -> str:
    """Generate a session token."""
    return secrets.token_urlsafe(32)


# ============ User Management ============

def create_user(username: str, password: str, display_name: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Create a new user."""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        user_id = generate_user_id()
        now = datetime.utcnow().isoformat()

        cursor.execute("""
            INSERT INTO users (id, username, password_hash, display_name, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, username.lower(), hash_password(password), display_name or username, now))

        # Initialize user stats
        cursor.execute("""
            INSERT INTO user_stats (user_id, total_xp, level, streak_days, last_active)
            VALUES (?, 0, 1, 0, ?)
        """, (user_id, now))

        conn.commit()

        return {
            "id": user_id,
            "username": username.lower(),
            "display_name": display_name or username,
            "created_at": now
        }
    except sqlite3.IntegrityError:
        return None  # Username already exists
    finally:
        conn.close()


def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user and return user data with session token."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, username, display_name, created_at
        FROM users
        WHERE username = ? AND password_hash = ? AND is_active = 1
    """, (username.lower(), hash_password(password)))

    row = cursor.fetchone()

    if not row:
        conn.close()
        return None

    user_id = row["id"]
    now = datetime.utcnow().isoformat()

    # Update last login
    cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", (now, user_id))

    # Create session
    token = generate_session_token()
    expires = datetime.utcnow().replace(year=datetime.utcnow().year + 1).isoformat()

    cursor.execute("""
        INSERT INTO sessions (token, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    """, (token, user_id, now, expires))

    conn.commit()
    conn.close()

    return {
        "user": {
            "id": row["id"],
            "username": row["username"],
            "display_name": row["display_name"],
            "created_at": row["created_at"]
        },
        "token": token
    }


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify session token and return user data."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT u.id, u.username, u.display_name, u.created_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > ? AND u.is_active = 1
    """, (token, datetime.utcnow().isoformat()))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return {
        "id": row["id"],
        "username": row["username"],
        "display_name": row["display_name"],
        "created_at": row["created_at"]
    }


def logout_user(token: str) -> bool:
    """Invalidate a session token."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, username, display_name, created_at
        FROM users WHERE id = ?
    """, (user_id,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return dict(row)


def list_users() -> List[Dict[str, Any]]:
    """List all users."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT u.id, u.username, u.display_name, u.created_at, u.last_login,
               s.total_xp, s.level, s.streak_days
        FROM users u
        LEFT JOIN user_stats s ON u.id = s.user_id
        WHERE u.is_active = 1
        ORDER BY u.created_at
    """)

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


# ============ XP System ============

# XP values per action
XP_VALUES = {
    # Zen ToT
    "note_created": 15,
    "note_updated": 5,
    "folder_created": 10,
    # FineLine
    "journal_entry": 25,
    "mood_logged": 10,
    "reflection_completed": 20,
    "weekly_review": 50,
    "monthly_review": 100,
    # Zen Reset
    "meditation_completed": 30,
    "lesson_completed": 25,
    "session": 15,
    # Forge Fit
    "workout_completed": 50,
    "streak_maintained": 25,
    "personal_record": 75,
}

# Level thresholds
def get_level_for_xp(total_xp: int) -> int:
    """Calculate level from total XP."""
    thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000]
    for i, threshold in enumerate(thresholds):
        if total_xp < threshold:
            return i
    return len(thresholds)


def get_xp_for_next_level(level: int) -> int:
    """Get XP needed for next level."""
    thresholds = [100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000]
    if level - 1 < len(thresholds):
        return thresholds[level - 1]
    return thresholds[-1] + (level - len(thresholds)) * 5000


def record_xp_event(user_id: str, app: str, action: str, metadata: Optional[str] = None) -> Dict[str, Any]:
    """Record an XP event and update user stats."""
    conn = get_connection()
    cursor = conn.cursor()

    # Get XP value for action
    xp_earned = XP_VALUES.get(action, 10)  # Default 10 XP for unknown actions
    now = datetime.utcnow().isoformat()

    # Record event
    cursor.execute("""
        INSERT INTO xp_events (user_id, app, action, xp_earned, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, app, action, xp_earned, metadata, now))

    # Update user stats
    cursor.execute("SELECT total_xp, level FROM user_stats WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()

    if row:
        old_level = row["level"]
        new_total_xp = row["total_xp"] + xp_earned
        new_level = get_level_for_xp(new_total_xp)
        level_up = new_level > old_level

        cursor.execute("""
            UPDATE user_stats
            SET total_xp = ?, level = ?, last_active = ?
            WHERE user_id = ?
        """, (new_total_xp, new_level, now, user_id))
    else:
        # Create stats if missing
        new_total_xp = xp_earned
        new_level = get_level_for_xp(new_total_xp)
        level_up = new_level > 1

        cursor.execute("""
            INSERT INTO user_stats (user_id, total_xp, level, last_active)
            VALUES (?, ?, ?, ?)
        """, (user_id, new_total_xp, new_level, now))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "xp_earned": xp_earned,
        "total_xp": new_total_xp,
        "level": new_level,
        "level_up": level_up,
        "new_level": new_level if level_up else None,
        "message": f"+{xp_earned} XP for {action}!"
    }


def get_user_stats(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user stats including app summaries."""
    conn = get_connection()
    cursor = conn.cursor()

    # Get basic stats
    cursor.execute("""
        SELECT total_xp, level, streak_days, last_active
        FROM user_stats WHERE user_id = ?
    """, (user_id,))

    stats_row = cursor.fetchone()
    if not stats_row:
        conn.close()
        return None

    total_xp = stats_row["total_xp"]
    level = stats_row["level"]
    xp_for_next = get_xp_for_next_level(level)

    # Previous level threshold
    prev_threshold = get_xp_for_next_level(level - 1) if level > 1 else 0
    xp_in_level = total_xp - prev_threshold
    xp_needed = xp_for_next - prev_threshold
    progress = int((xp_in_level / xp_needed) * 100) if xp_needed > 0 else 100

    # Get app summaries
    cursor.execute("""
        SELECT app, COUNT(*) as events, SUM(xp_earned) as xp
        FROM xp_events WHERE user_id = ?
        GROUP BY app
    """, (user_id,))

    app_summaries = {}
    for row in cursor.fetchall():
        app_summaries[row["app"]] = {
            "events": row["events"],
            "xp": row["xp"]
        }

    # Count today's events
    today = datetime.utcnow().date().isoformat()
    cursor.execute("""
        SELECT COUNT(*) as count FROM xp_events
        WHERE user_id = ? AND date(created_at) = ?
    """, (user_id, today))

    completed_today = cursor.fetchone()["count"]

    conn.close()

    return {
        "user_id": user_id,
        "level": level,
        "total_xp": total_xp,
        "xp_to_next": xp_for_next - total_xp,
        "progress_percent": progress,
        "streak_days": stats_row["streak_days"],
        "completed_today": completed_today,
        "app_summaries": app_summaries
    }


def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Get full user profile."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT u.id, u.username, u.display_name, u.created_at,
               s.total_xp, s.level, s.streak_days, s.last_active
        FROM users u
        LEFT JOIN user_stats s ON u.id = s.user_id
        WHERE u.id = ?
    """, (user_id,))

    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    total_xp = row["total_xp"] or 0
    level = row["level"] or 1
    xp_for_next = get_xp_for_next_level(level)
    prev_threshold = get_xp_for_next_level(level - 1) if level > 1 else 0
    xp_in_level = total_xp - prev_threshold
    xp_needed = xp_for_next - prev_threshold
    progress = int((xp_in_level / xp_needed) * 100) if xp_needed > 0 else 100

    # Get app stats
    cursor.execute("""
        SELECT app, COUNT(*) as events, SUM(xp_earned) as xp
        FROM xp_events WHERE user_id = ?
        GROUP BY app
    """, (user_id,))

    app_stats = {}
    for r in cursor.fetchall():
        app_stats[r["app"]] = {"events": r["events"], "xp": r["xp"]}

    conn.close()

    return {
        "user_id": row["id"],
        "username": row["username"],
        "display_name": row["display_name"],
        "total_xp": total_xp,
        "level": level,
        "xp_in_level": xp_in_level,
        "xp_for_next_level": xp_for_next,
        "progress_percent": progress,
        "streak_days": row["streak_days"] or 0,
        "last_active": row["last_active"],
        "created_at": row["created_at"],
        "app_stats": app_stats
    }


# ============ Admin Functions ============

def get_recent_events(limit: int = 50, user_id: Optional[str] = None, app: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get recent XP events for admin view."""
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT e.id, e.user_id, e.app, e.action, e.xp_earned, e.metadata, e.created_at,
               u.username, u.display_name
        FROM xp_events e
        JOIN users u ON e.user_id = u.id
        WHERE 1=1
    """
    params = []

    if user_id:
        query += " AND e.user_id = ?"
        params.append(user_id)

    if app:
        query += " AND e.app = ?"
        params.append(app)

    query += " ORDER BY e.created_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def get_admin_analytics() -> Dict[str, Any]:
    """Get overall analytics for admin dashboard."""
    conn = get_connection()
    cursor = conn.cursor()

    # Total users
    cursor.execute("SELECT COUNT(*) as count FROM users WHERE is_active = 1")
    total_users = cursor.fetchone()["count"]

    # Total XP earned
    cursor.execute("SELECT COALESCE(SUM(xp_earned), 0) as total FROM xp_events")
    total_xp = cursor.fetchone()["total"]

    # Total events
    cursor.execute("SELECT COUNT(*) as count FROM xp_events")
    total_events = cursor.fetchone()["count"]

    # Events today
    today = datetime.utcnow().date().isoformat()
    cursor.execute("SELECT COUNT(*) as count FROM xp_events WHERE date(created_at) = ?", (today,))
    events_today = cursor.fetchone()["count"]

    # Active users today
    cursor.execute("""
        SELECT COUNT(DISTINCT user_id) as count
        FROM xp_events WHERE date(created_at) = ?
    """, (today,))
    active_today = cursor.fetchone()["count"]

    # XP by app
    cursor.execute("""
        SELECT app, COUNT(*) as events, SUM(xp_earned) as xp
        FROM xp_events GROUP BY app ORDER BY xp DESC
    """)
    app_breakdown = [dict(row) for row in cursor.fetchall()]

    # Daily activity (last 7 days)
    cursor.execute("""
        SELECT date(created_at) as date, COUNT(*) as events, SUM(xp_earned) as xp
        FROM xp_events
        WHERE created_at >= date('now', '-7 days')
        GROUP BY date(created_at)
        ORDER BY date
    """)
    daily_activity = [dict(row) for row in cursor.fetchall()]

    # Top users by XP
    cursor.execute("""
        SELECT u.username, u.display_name, s.total_xp, s.level
        FROM users u
        JOIN user_stats s ON u.id = s.user_id
        WHERE u.is_active = 1
        ORDER BY s.total_xp DESC
        LIMIT 10
    """)
    leaderboard = [dict(row) for row in cursor.fetchall()]

    # Action breakdown
    cursor.execute("""
        SELECT action, COUNT(*) as count, SUM(xp_earned) as xp
        FROM xp_events GROUP BY action ORDER BY count DESC
    """)
    action_breakdown = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "overview": {
            "total_users": total_users,
            "total_xp": total_xp,
            "total_events": total_events,
            "events_today": events_today,
            "active_today": active_today,
        },
        "app_breakdown": app_breakdown,
        "daily_activity": daily_activity,
        "leaderboard": leaderboard,
        "action_breakdown": action_breakdown,
    }


def get_user_activity(user_id: str, days: int = 30) -> Dict[str, Any]:
    """Get detailed activity for a specific user."""
    conn = get_connection()
    cursor = conn.cursor()

    # Daily activity
    cursor.execute("""
        SELECT date(created_at) as date, app, action, COUNT(*) as count, SUM(xp_earned) as xp
        FROM xp_events
        WHERE user_id = ? AND created_at >= date('now', ? || ' days')
        GROUP BY date(created_at), app, action
        ORDER BY date DESC
    """, (user_id, f"-{days}"))

    daily = [dict(row) for row in cursor.fetchall()]

    # Recent events
    cursor.execute("""
        SELECT app, action, xp_earned, created_at
        FROM xp_events
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
    """, (user_id,))

    recent = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "daily_breakdown": daily,
        "recent_events": recent,
    }


# Initialize database on import
init_db()
