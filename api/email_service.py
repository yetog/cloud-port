"""
Email Service for The Forge
Handles sending notifications to users.
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, List
from datetime import datetime
from pathlib import Path

# Load .env file
from dotenv import load_dotenv
env_path = Path("/var/www/zaylegend/api/.env")
if env_path.exists():
    load_dotenv(env_path)

# Email configuration from environment
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@zaylegend.com")
FROM_NAME = os.getenv("FROM_NAME", "The Forge")


def is_configured() -> bool:
    """Check if email is configured."""
    return bool(SMTP_USER and SMTP_PASS)


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: Optional[str] = None
) -> bool:
    """Send an email."""
    if not is_configured():
        print("[Email] Not configured, skipping send")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email

        # Add text version
        if text_body:
            msg.attach(MIMEText(text_body, "plain"))

        # Add HTML version
        msg.attach(MIMEText(html_body, "html"))

        # Send - handle both local and remote SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            # Only use TLS for remote servers
            if SMTP_HOST not in ["localhost", "127.0.0.1"]:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
            elif SMTP_USER and SMTP_PASS:
                # Local server with auth
                try:
                    server.login(SMTP_USER, SMTP_PASS)
                except smtplib.SMTPNotSupportedError:
                    pass  # Local server doesn't require auth

            server.sendmail(FROM_EMAIL, to_email, msg.as_string())

        print(f"[Email] Sent to {to_email}: {subject}")
        return True

    except Exception as e:
        print(f"[Email] Error sending to {to_email}: {e}")
        return False


# ============ Email Templates ============

def send_welcome_email(to_email: str, display_name: str) -> bool:
    """Send welcome email to new user."""
    subject = "Welcome to The Forge!"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 32px; }}
            h1 {{ color: #f59e0b; margin: 10px 0; }}
            .content {{ line-height: 1.6; }}
            .pillars {{ display: grid; gap: 10px; margin: 20px 0; }}
            .pillar {{ background: #1a1a2e; padding: 15px; border-radius: 8px; border-left: 3px solid #f59e0b; }}
            .cta {{ text-align: center; margin: 30px 0; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔥</div>
                <h1>Welcome to The Forge</h1>
            </div>
            <div class="content">
                <p>Hey {display_name}!</p>
                <p>You're now part of The Forge - your personal growth hub. Here's what awaits you:</p>

                <div class="pillars">
                    <div class="pillar"><strong>📝 Zen ToT</strong> - Capture ideas and organize notes</div>
                    <div class="pillar"><strong>📖 FineLine</strong> - Daily journaling and reflection</div>
                    <div class="pillar"><strong>🧘 Zen Reset</strong> - Meditation and mindfulness</div>
                    <div class="pillar"><strong>💪 Forge Fit</strong> - Workout tracking and fitness</div>
                </div>

                <p>Every action earns XP. Level up by staying consistent across all pillars!</p>
            </div>
            <div class="cta">
                <a href="https://zaylegend.com/the-forge/" class="button">Enter The Forge</a>
            </div>
            <div class="footer">
                <p>The Forge - Personal Growth Hub</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    Welcome to The Forge, {display_name}!

    You're now part of The Forge - your personal growth hub.

    The Four Pillars:
    - Zen ToT: Capture ideas and organize notes
    - FineLine: Daily journaling and reflection
    - Zen Reset: Meditation and mindfulness
    - Forge Fit: Workout tracking and fitness

    Every action earns XP. Level up by staying consistent!

    Start here: https://zaylegend.com/the-forge/
    """

    return send_email(to_email, subject, html_body, text_body)


def send_level_up_email(to_email: str, display_name: str, new_level: int, total_xp: int) -> bool:
    """Send level up notification."""
    subject = f"🎉 Level Up! You're now Level {new_level}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; text-align: center; }}
            .level {{ font-size: 72px; margin: 20px 0; }}
            h1 {{ color: #f59e0b; }}
            .xp {{ font-size: 24px; color: #10b981; margin: 20px 0; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }}
            .footer {{ color: #666; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Congratulations, {display_name}!</h1>
            <div class="level">🏆 {new_level}</div>
            <p>You've reached <strong>Level {new_level}</strong>!</p>
            <div class="xp">{total_xp:,} Total XP</div>
            <p>Keep up the momentum across all pillars.</p>
            <a href="https://zaylegend.com/the-forge/" class="button">View Progress</a>
            <div class="footer">
                <p>The Forge - Personal Growth Hub</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    Congratulations, {display_name}!

    You've reached Level {new_level}!
    Total XP: {total_xp:,}

    Keep up the momentum across all pillars.

    View your progress: https://zaylegend.com/the-forge/
    """

    return send_email(to_email, subject, html_body, text_body)


def send_weekly_summary(
    to_email: str,
    display_name: str,
    level: int,
    xp_earned: int,
    events_count: int,
    app_breakdown: dict
) -> bool:
    """Send weekly activity summary."""
    subject = f"📊 Your Week in The Forge - {xp_earned} XP Earned"

    app_rows = ""
    for app, data in app_breakdown.items():
        app_rows += f'<tr><td style="padding: 8px; border-bottom: 1px solid #333;">{app}</td><td style="padding: 8px; border-bottom: 1px solid #333;">{data["events"]}</td><td style="padding: 8px; border-bottom: 1px solid #333; color: #f59e0b;">{data["xp"]} XP</td></tr>'

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; }}
            h1 {{ color: #f59e0b; text-align: center; }}
            .stats {{ display: flex; justify-content: space-around; margin: 30px 0; text-align: center; }}
            .stat {{ background: #1a1a2e; padding: 20px; border-radius: 8px; }}
            .stat-value {{ font-size: 32px; font-weight: bold; color: #f59e0b; }}
            .stat-label {{ font-size: 12px; color: #888; }}
            table {{ width: 100%; margin: 20px 0; border-collapse: collapse; }}
            th {{ text-align: left; padding: 10px; background: #1a1a2e; color: #888; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; }}
            .cta {{ text-align: center; margin: 30px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Week in Review</h1>
            <p style="text-align: center;">Hey {display_name}, here's what you accomplished this week:</p>

            <div class="stats">
                <div class="stat">
                    <div class="stat-value">{xp_earned}</div>
                    <div class="stat-label">XP EARNED</div>
                </div>
                <div class="stat">
                    <div class="stat-value">{events_count}</div>
                    <div class="stat-label">ACTIVITIES</div>
                </div>
                <div class="stat">
                    <div class="stat-value">{level}</div>
                    <div class="stat-label">CURRENT LEVEL</div>
                </div>
            </div>

            <h3>Activity Breakdown</h3>
            <table>
                <tr>
                    <th>App</th>
                    <th>Activities</th>
                    <th>XP</th>
                </tr>
                {app_rows}
            </table>

            <div class="cta">
                <a href="https://zaylegend.com/the-forge/" class="button">Continue Your Journey</a>
            </div>
            <div class="footer">
                <p>The Forge - Personal Growth Hub</p>
            </div>
        </div>
    </body>
    </html>
    """

    return send_email(to_email, subject, html_body)


def send_invite_email(to_email: str, inviter_name: str, invite_code: str) -> bool:
    """Send beta tester invite."""
    subject = f"🔥 {inviter_name} invited you to The Forge"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 12px; padding: 30px; text-align: center; }}
            h1 {{ color: #f59e0b; }}
            .code {{ font-size: 24px; font-family: monospace; background: #1a1a2e; padding: 15px 30px; border-radius: 8px; margin: 20px 0; display: inline-block; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }}
            .footer {{ color: #666; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>You're Invited to The Forge</h1>
            <p>{inviter_name} thinks you'd be a great fit for The Forge beta testing program.</p>
            <p>Your invite code:</p>
            <div class="code">{invite_code}</div>
            <p>Use this to create your account and start your personal growth journey.</p>
            <a href="https://zaylegend.com/the-forge/invite" class="button">Accept Invite</a>
            <div class="footer">
                <p>The Forge - Personal Growth Hub</p>
            </div>
        </div>
    </body>
    </html>
    """

    return send_email(to_email, subject, html_body)
