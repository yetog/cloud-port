"""
Forge API Routes
Authentication and XP endpoints for The Forge ecosystem.
"""

from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import Optional, List
import json

import sys
sys.path.insert(0, "/var/www/zaylegend/api")

from forge_db import (
    create_user,
    authenticate_user,
    verify_token,
    logout_user,
    get_user_by_id,
    list_users,
    record_xp_event,
    get_user_stats,
    get_user_profile,
    get_recent_events,
    get_admin_analytics,
    get_user_activity,
)

from email_service import (
    is_configured as email_configured,
    send_welcome_email,
    send_level_up_email,
    send_invite_email,
    send_weekly_summary,
)

from export_service import (
    export_users_csv,
    export_users_json,
    export_events_csv,
    export_events_json,
    export_analytics_json,
    export_user_data_json,
    export_daily_report_csv,
)

router = APIRouter()


# ============ Request Models ============

class RegisterRequest(BaseModel):
    username: str
    password: str
    display_name: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class XPEventRequest(BaseModel):
    app: str
    action: str
    metadata: Optional[dict] = None


# ============ Auth Endpoints ============

@router.post("/auth/register")
async def register(request: RegisterRequest):
    """Register a new user."""
    if len(request.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(request.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    user = create_user(request.username, request.password, request.display_name)

    if not user:
        raise HTTPException(status_code=400, detail="Username already exists")

    return {"success": True, "user": user}


@router.post("/auth/login")
async def login(request: LoginRequest):
    """Login and get session token."""
    result = authenticate_user(request.username, request.password)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "success": True,
        "user": result["user"],
        "token": result["token"]
    }


@router.get("/auth/verify")
async def verify(authorization: str = Header(None)):
    """Verify session token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")

    token = authorization.replace("Bearer ", "")
    user = verify_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {"success": True, "user": user}


@router.post("/auth/logout")
async def logout(authorization: str = Header(None)):
    """Logout and invalidate token."""
    if not authorization:
        return {"success": True}

    token = authorization.replace("Bearer ", "")
    logout_user(token)

    return {"success": True}


# ============ User Endpoints ============

@router.get("/users")
async def get_users():
    """List all users (admin endpoint)."""
    users = list_users()
    return {"users": users, "count": len(users)}


@router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get user by ID."""
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ============ XP Endpoints ============

@router.post("/xp/event")
async def xp_event(request: XPEventRequest, user_id: str = None):
    """Record an XP event."""
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    metadata_str = json.dumps(request.metadata) if request.metadata else None
    result = record_xp_event(user_id, request.app, request.action, metadata_str)

    return result


@router.get("/stats")
async def stats(user_id: str = None):
    """Get user stats."""
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    result = get_user_stats(user_id)

    if not result:
        # Return default stats for new users
        return {
            "user_id": user_id,
            "level": 1,
            "total_xp": 0,
            "xp_to_next": 100,
            "progress_percent": 0,
            "streak_days": 0,
            "completed_today": 0,
            "app_summaries": {}
        }

    return result


@router.get("/profile")
async def profile(user_id: str = None):
    """Get full user profile."""
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    result = get_user_profile(user_id)

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return result


@router.get("/daily")
async def daily_quests(user_id: str = None):
    """Get daily quests (placeholder)."""
    # This would be more complex in production
    return {
        "date": "2026-06-09",
        "quests": [
            {"id": "1", "app": "fineline", "action": "journal_entry", "title": "Write in your journal", "xp_reward": 25, "completed": False},
            {"id": "2", "app": "zen-reset", "action": "meditation_completed", "title": "Complete a meditation", "xp_reward": 30, "completed": False},
            {"id": "3", "app": "forge-fit", "action": "workout_completed", "title": "Finish a workout", "xp_reward": 50, "completed": False},
        ],
        "completed_count": 0,
        "total_xp_earned": 0
    }


# ============ Admin Endpoints ============

@router.get("/admin/analytics")
async def admin_analytics():
    """Get admin analytics dashboard data."""
    return get_admin_analytics()


@router.get("/admin/events")
async def admin_events(limit: int = 50, user_id: str = None, app: str = None):
    """Get recent events for admin view."""
    events = get_recent_events(limit=limit, user_id=user_id, app=app)
    return {"events": events, "count": len(events)}


@router.get("/admin/users/{user_id}/activity")
async def admin_user_activity(user_id: str, days: int = 30):
    """Get detailed activity for a specific user."""
    activity = get_user_activity(user_id, days)
    profile = get_user_profile(user_id)
    return {"profile": profile, "activity": activity}


# ============ Email Endpoints ============

class InviteEmailRequest(BaseModel):
    to_email: str
    inviter_name: str = "The Forge Team"


class NotifyLevelUpRequest(BaseModel):
    to_email: str
    display_name: str
    new_level: int
    total_xp: int


@router.get("/email/status")
async def email_status():
    """Check if email is configured."""
    return {"configured": email_configured()}


@router.post("/email/invite")
async def send_invite(request: InviteEmailRequest):
    """Send beta invite email."""
    import secrets
    invite_code = f"FORGE-{secrets.token_hex(4).upper()}"
    success = send_invite_email(request.to_email, request.inviter_name, invite_code)
    return {"success": success, "invite_code": invite_code if success else None}


@router.post("/email/level-up")
async def notify_level_up(request: NotifyLevelUpRequest):
    """Send level up notification email."""
    success = send_level_up_email(
        request.to_email,
        request.display_name,
        request.new_level,
        request.total_xp
    )
    return {"success": success}


# ============ Export Endpoints ============

@router.get("/export/users.csv")
async def export_users_csv_endpoint():
    """Export all users as CSV."""
    csv_data = export_users_csv()
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=forge_users.csv"}
    )


@router.get("/export/users.json")
async def export_users_json_endpoint():
    """Export all users as JSON."""
    json_data = export_users_json()
    return PlainTextResponse(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=forge_users.json"}
    )


@router.get("/export/events.csv")
async def export_events_csv_endpoint(limit: int = 1000, user_id: str = None, app: str = None):
    """Export XP events as CSV."""
    csv_data = export_events_csv(limit=limit, user_id=user_id, app=app)
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=forge_events.csv"}
    )


@router.get("/export/events.json")
async def export_events_json_endpoint(limit: int = 1000, user_id: str = None, app: str = None):
    """Export XP events as JSON."""
    json_data = export_events_json(limit=limit, user_id=user_id, app=app)
    return PlainTextResponse(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=forge_events.json"}
    )


@router.get("/export/analytics.json")
async def export_analytics_json_endpoint():
    """Export full analytics as JSON."""
    json_data = export_analytics_json()
    return PlainTextResponse(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=forge_analytics.json"}
    )


@router.get("/export/user/{user_id}.json")
async def export_user_data_endpoint(user_id: str):
    """Export all data for a specific user (GDPR-style)."""
    json_data = export_user_data_json(user_id)
    return PlainTextResponse(
        content=json_data,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=forge_user_{user_id[:8]}.json"}
    )


@router.get("/export/daily-report.csv")
async def export_daily_report_endpoint(days: int = 7):
    """Export daily activity report as CSV."""
    csv_data = export_daily_report_csv(days=days)
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=forge_daily_report.csv"}
    )
