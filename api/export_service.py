"""
Export Service for The Forge
Handles data export in various formats.
"""

import csv
import json
import io
from datetime import datetime
from typing import List, Dict, Any, Optional

import sys
sys.path.insert(0, "/var/www/zaylegend/api")

from forge_db import (
    get_connection,
    list_users,
    get_recent_events,
    get_admin_analytics,
    get_user_profile,
)


def export_users_csv() -> str:
    """Export all users as CSV."""
    users = list_users()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        'Username', 'Display Name', 'Level', 'Total XP', 'Streak Days',
        'Created At', 'Last Login'
    ])

    # Data
    for user in users:
        writer.writerow([
            user.get('username', ''),
            user.get('display_name', ''),
            user.get('level', 1),
            user.get('total_xp', 0),
            user.get('streak_days', 0),
            user.get('created_at', ''),
            user.get('last_login', ''),
        ])

    return output.getvalue()


def export_users_json() -> str:
    """Export all users as JSON."""
    users = list_users()
    return json.dumps({
        'exported_at': datetime.utcnow().isoformat(),
        'count': len(users),
        'users': users
    }, indent=2)


def export_events_csv(limit: int = 1000, user_id: Optional[str] = None, app: Optional[str] = None) -> str:
    """Export XP events as CSV."""
    events = get_recent_events(limit=limit, user_id=user_id, app=app)

    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        'ID', 'Username', 'Display Name', 'App', 'Action',
        'XP Earned', 'Created At'
    ])

    # Data
    for event in events:
        writer.writerow([
            event.get('id', ''),
            event.get('username', ''),
            event.get('display_name', ''),
            event.get('app', ''),
            event.get('action', ''),
            event.get('xp_earned', 0),
            event.get('created_at', ''),
        ])

    return output.getvalue()


def export_events_json(limit: int = 1000, user_id: Optional[str] = None, app: Optional[str] = None) -> str:
    """Export XP events as JSON."""
    events = get_recent_events(limit=limit, user_id=user_id, app=app)
    return json.dumps({
        'exported_at': datetime.utcnow().isoformat(),
        'count': len(events),
        'filters': {
            'user_id': user_id,
            'app': app,
            'limit': limit,
        },
        'events': events
    }, indent=2)


def export_analytics_json() -> str:
    """Export full analytics as JSON."""
    analytics = get_admin_analytics()
    analytics['exported_at'] = datetime.utcnow().isoformat()
    return json.dumps(analytics, indent=2)


def export_user_data_json(user_id: str) -> str:
    """Export all data for a specific user (GDPR-style export)."""
    conn = get_connection()
    cursor = conn.cursor()

    # Get user info
    cursor.execute("""
        SELECT id, username, display_name, created_at, last_login
        FROM users WHERE id = ?
    """, (user_id,))
    user_row = cursor.fetchone()

    if not user_row:
        conn.close()
        return json.dumps({'error': 'User not found'})

    user = dict(user_row)

    # Get stats
    cursor.execute("""
        SELECT total_xp, level, streak_days, last_active
        FROM user_stats WHERE user_id = ?
    """, (user_id,))
    stats_row = cursor.fetchone()
    stats = dict(stats_row) if stats_row else {}

    # Get all events
    cursor.execute("""
        SELECT id, app, action, xp_earned, metadata, created_at
        FROM xp_events WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))
    events = [dict(row) for row in cursor.fetchall()]

    # Get sessions
    cursor.execute("""
        SELECT token, created_at, expires_at
        FROM sessions WHERE user_id = ?
    """, (user_id,))
    sessions = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return json.dumps({
        'exported_at': datetime.utcnow().isoformat(),
        'user': user,
        'stats': stats,
        'events': events,
        'event_count': len(events),
        'sessions': sessions,
    }, indent=2)


def export_daily_report_csv(days: int = 7) -> str:
    """Export daily activity report as CSV."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            date(created_at) as date,
            COUNT(DISTINCT user_id) as active_users,
            COUNT(*) as total_events,
            SUM(xp_earned) as total_xp,
            app,
            action
        FROM xp_events
        WHERE created_at >= date('now', ? || ' days')
        GROUP BY date(created_at), app, action
        ORDER BY date DESC, app, action
    """, (f"-{days}",))

    rows = cursor.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(['Date', 'Active Users', 'Events', 'XP', 'App', 'Action'])

    # Data
    for row in rows:
        writer.writerow([
            row['date'],
            row['active_users'],
            row['total_events'],
            row['total_xp'],
            row['app'],
            row['action'],
        ])

    return output.getvalue()
