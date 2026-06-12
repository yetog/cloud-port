#!/usr/bin/env python3
"""
Work Report Generator & Email Sender
Sends periodic reports on infrastructure work done.

Usage:
  python3 send-work-report.py daily    # Daily summary
  python3 send-work-report.py weekly   # Weekly summary
"""

import subprocess
import smtplib
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from pathlib import Path

# Config
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "isayahy@gmail.com"
SMTP_PASS = "wdzvscnewdsabhgd"
TO_EMAIL = "isayahy@gmail.com"

# Directories to track
TRACKED_REPOS = [
    "/var/www/zaylegend",
    "/var/www/greenridgelandscapedesign",
    "/var/www/Green-Empire",
    "/var/www/zaylegend/apps/green-empire",
    "/var/www/goatlandscapeli.com/html",
]


def run_cmd(cmd, cwd=None):
    """Run a shell command and return output."""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, cwd=cwd, timeout=30
        )
        return result.stdout.strip()
    except:
        return ""


def get_git_commits(repo_path, since_days=1):
    """Get git commits from the last N days."""
    since = (datetime.now() - timedelta(days=since_days)).strftime("%Y-%m-%d")
    commits = run_cmd(
        f'git log --since="{since}" --oneline --no-merges 2>/dev/null',
        cwd=repo_path
    )
    return commits if commits else "No commits"


def get_git_stats(repo_path, since_days=1):
    """Get git stats (files changed, insertions, deletions)."""
    since = (datetime.now() - timedelta(days=since_days)).strftime("%Y-%m-%d")
    stats = run_cmd(
        f'git log --since="{since}" --shortstat --oneline 2>/dev/null | tail -1',
        cwd=repo_path
    )
    return stats if stats else "No changes"


def get_system_status():
    """Get current system status."""
    disk = run_cmd("df -h / | tail -1 | awk '{print $5 \" used (\" $4 \" free)\"}'")
    memory = run_cmd("free -h | grep Mem | awk '{print $3 \"/\" $2 \" used\"}'")
    docker_running = run_cmd("docker ps --format '{{.Names}}' 2>/dev/null | wc -l")
    uptime = run_cmd("uptime -p")

    return {
        "disk": disk,
        "memory": memory,
        "docker_containers": docker_running,
        "uptime": uptime
    }


def get_nginx_sites():
    """Get active nginx sites."""
    sites = run_cmd("ls /etc/nginx/conf.d/*.conf 2>/dev/null | wc -l")
    return sites


def get_ssl_status():
    """Get SSL certificate status."""
    certs = run_cmd("sudo certbot certificates 2>/dev/null | grep -E 'Certificate Name|Expiry Date' | head -20")
    return certs if certs else "Unable to check certificates"


def generate_report(report_type="daily"):
    """Generate the work report."""
    since_days = 1 if report_type == "daily" else 7
    period = "24 hours" if report_type == "daily" else "7 days"

    # Get system status
    sys_status = get_system_status()

    # Build report
    report_lines = [
        f"# {'Daily' if report_type == 'daily' else 'Weekly'} Work Report",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"**Period:** Last {period}",
        "",
        "---",
        "",
        "## System Status",
        f"- **Uptime:** {sys_status['uptime']}",
        f"- **Disk:** {sys_status['disk']}",
        f"- **Memory:** {sys_status['memory']}",
        f"- **Docker Containers:** {sys_status['docker_containers']} running",
        f"- **Nginx Sites:** {get_nginx_sites()} configured",
        "",
        "---",
        "",
        "## Git Activity",
        ""
    ]

    total_commits = 0
    for repo in TRACKED_REPOS:
        repo_name = Path(repo).name
        if not Path(repo).exists():
            continue

        commits = get_git_commits(repo, since_days)
        commit_count = len([c for c in commits.split('\n') if c and c != "No commits"])
        total_commits += commit_count

        report_lines.append(f"### {repo_name}")
        if commits and commits != "No commits":
            for line in commits.split('\n')[:10]:  # Limit to 10 commits
                if line:
                    report_lines.append(f"- `{line}`")
        else:
            report_lines.append("- No commits")
        report_lines.append("")

    report_lines.extend([
        f"**Total Commits:** {total_commits}",
        "",
        "---",
        "",
        "## SSL Certificates",
        "```",
        get_ssl_status(),
        "```",
        "",
        "---",
        "",
        "*Report generated automatically by Shadow Infrastructure*"
    ])

    return "\n".join(report_lines), total_commits


def markdown_to_html(md_text):
    """Simple markdown to HTML conversion."""
    html = md_text

    # Headers
    html = html.replace("# ", "<h1>").replace("\n## ", "</h1>\n<h2>").replace("\n### ", "</h2>\n<h3>")

    # Code blocks
    html = html.replace("```\n", "<pre>").replace("\n```", "</pre>")

    # Inline code
    import re
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)

    # Bold
    html = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', html)

    # Lists
    lines = html.split('\n')
    in_list = False
    result = []
    for line in lines:
        if line.startswith('- '):
            if not in_list:
                result.append('<ul>')
                in_list = True
            result.append(f'<li>{line[2:]}</li>')
        else:
            if in_list:
                result.append('</ul>')
                in_list = False
            result.append(line)
    if in_list:
        result.append('</ul>')
    html = '\n'.join(result)

    # Horizontal rules
    html = html.replace('---', '<hr>')

    # Wrap in basic styling
    styled_html = f"""<!DOCTYPE html>
<html>
<head>
<style>
body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #e0e0e0;
    background-color: #1a1a1a;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}}
h1 {{
    color: #ff4444;
    border-bottom: 2px solid #ff4444;
    padding-bottom: 10px;
}}
h2 {{
    color: #ff6666;
    margin-top: 30px;
}}
h3 {{
    color: #ff8888;
}}
code {{
    background-color: #2d2d2d;
    color: #ff4444;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Consolas', monospace;
}}
pre {{
    background-color: #2d2d2d;
    color: #cccccc;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    border-left: 3px solid #ff4444;
}}
ul {{
    padding-left: 20px;
}}
li {{
    margin: 5px 0;
}}
hr {{
    border: none;
    border-top: 1px solid #444;
    margin: 20px 0;
}}
strong {{
    color: #ffffff;
}}
</style>
</head>
<body>
{html}
</body>
</html>"""

    return styled_html


def send_report(report_type="daily"):
    """Generate and send the work report."""
    md_report, commit_count = generate_report(report_type)
    html_report = markdown_to_html(md_report)

    # Create email
    subject = f"{'Daily' if report_type == 'daily' else 'Weekly'} Work Report - {datetime.now().strftime('%Y-%m-%d')}"
    if commit_count > 0:
        subject += f" ({commit_count} commits)"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Shadow <{SMTP_USER}>"
    msg["To"] = TO_EMAIL

    msg.attach(MIMEText(md_report, "plain"))
    msg.attach(MIMEText(html_report, "html"))

    # Send
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, TO_EMAIL, msg.as_string())
        print(f"Report sent to {TO_EMAIL}")
        return True
    except Exception as e:
        print(f"Error sending report: {e}")
        return False


if __name__ == "__main__":
    report_type = sys.argv[1] if len(sys.argv) > 1 else "daily"
    if report_type not in ["daily", "weekly"]:
        print("Usage: send-work-report.py [daily|weekly]")
        sys.exit(1)

    success = send_report(report_type)
    sys.exit(0 if success else 1)
