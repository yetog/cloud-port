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
    ("/var/www/zaylegend", "ZayLegend Portfolio"),
    ("/var/www/greenridgelandscapedesign", "GreenRidge"),
    ("/var/www/Green-Empire", "Green Empire Land"),
    ("/var/www/zaylegend/apps/green-empire", "Green Empire Builders"),
    ("/var/www/goatlandscapeli.com/html", "GOAT Landscaping"),
    ("/var/www/saltbae", "Saltbae Email Blaster"),
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
        f'git log --since="{since}" --format="%h|%s|%an" --no-merges 2>/dev/null',
        cwd=repo_path
    )
    return commits if commits else ""


def get_system_status():
    """Get current system status."""
    disk = run_cmd("df -h / | tail -1 | awk '{print $5}'")
    disk_free = run_cmd("df -h / | tail -1 | awk '{print $4}'")
    memory = run_cmd("free -h | grep Mem | awk '{print $3}'")
    memory_total = run_cmd("free -h | grep Mem | awk '{print $2}'")
    docker_running = run_cmd("docker ps --format '{{.Names}}' 2>/dev/null | wc -l")
    uptime = run_cmd("uptime -p | sed 's/up //'")
    load = run_cmd("uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ','")

    return {
        "disk_used": disk,
        "disk_free": disk_free,
        "memory_used": memory,
        "memory_total": memory_total,
        "docker_containers": docker_running.strip(),
        "uptime": uptime,
        "load": load
    }


def get_ssl_certs():
    """Get SSL certificate status."""
    certs_raw = run_cmd("sudo certbot certificates 2>/dev/null")
    certs = []
    current_cert = {}

    for line in certs_raw.split('\n'):
        if 'Certificate Name:' in line:
            if current_cert:
                certs.append(current_cert)
            current_cert = {'name': line.split(':')[1].strip()}
        elif 'Expiry Date:' in line:
            # Extract date and days remaining
            parts = line.split('(VALID:')
            if len(parts) > 1:
                days = parts[1].replace(')', '').replace('days', '').strip()
                current_cert['days'] = days

    if current_cert:
        certs.append(current_cert)

    return certs


def generate_html_report(report_type="daily"):
    """Generate the HTML work report."""
    since_days = 1 if report_type == "daily" else 7
    period = "24 hours" if report_type == "daily" else "7 days"
    period_label = "Daily" if report_type == "daily" else "Weekly"

    # Get system status
    sys_status = get_system_status()
    ssl_certs = get_ssl_certs()

    # Collect git activity
    repo_activity = []
    total_commits = 0

    for repo_path, repo_name in TRACKED_REPOS:
        if not Path(repo_path).exists():
            continue

        commits_raw = get_git_commits(repo_path, since_days)
        commits = []
        if commits_raw:
            for line in commits_raw.split('\n'):
                if '|' in line:
                    parts = line.split('|')
                    if len(parts) >= 3:
                        commits.append({
                            'hash': parts[0],
                            'message': parts[1],
                            'author': parts[2]
                        })
                        total_commits += 1

        repo_activity.append({
            'name': repo_name,
            'path': repo_path,
            'commits': commits
        })

    # Build HTML
    html = f"""<!DOCTYPE html>
<html>
<head>
<style>
body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
}}
.header {{
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    padding: 30px;
    margin: -20px -20px 30px -20px;
    border-radius: 0 0 10px 10px;
}}
.header h1 {{
    color: #ff4444;
    margin: 0;
    font-size: 28px;
}}
.header p {{
    margin: 10px 0 0 0;
    opacity: 0.9;
    color: #ccc;
}}
h2 {{
    color: #1a1a1a;
    margin-top: 30px;
    padding-bottom: 8px;
    border-bottom: 2px solid #ff4444;
}}
h3 {{
    color: #444;
    margin-top: 20px;
}}
table {{
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}}
th, td {{
    border: 1px solid #eee;
    padding: 12px;
    text-align: left;
}}
th {{
    background-color: #1a1a1a;
    color: white;
}}
tr:nth-child(even) {{
    background-color: #f9f9f9;
}}
.highlight {{
    background-color: #fff3f3;
    padding: 15px;
    border-left: 4px solid #ff4444;
    margin: 15px 0;
    border-radius: 0 8px 8px 0;
}}
.metric-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
}}
.metric-card {{
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}}
.metric-value {{
    font-size: 28px;
    font-weight: bold;
    color: #ff4444;
}}
.metric-label {{
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    margin-top: 5px;
}}
code {{
    background-color: #2d2d2d;
    color: #ff6666;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
}}
.commit-list {{
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}}
.commit-item {{
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}}
.commit-item:last-child {{
    border-bottom: none;
}}
.commit-hash {{
    color: #ff4444;
    font-family: monospace;
    font-size: 0.9em;
}}
.commit-message {{
    color: #333;
}}
.no-activity {{
    color: #999;
    font-style: italic;
}}
.ssl-good {{
    color: #22c55e;
}}
.ssl-warning {{
    color: #f59e0b;
}}
.ssl-danger {{
    color: #ef4444;
}}
.footer {{
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    color: #666;
    font-size: 0.9em;
    text-align: center;
}}
.footer a {{
    color: #ff4444;
}}
</style>
</head>
<body>

<div class="header">
    <h1>Shadow {period_label} Report</h1>
    <p>{datetime.now().strftime('%B %d, %Y')} &bull; Last {period}</p>
</div>

<div class="highlight">
    <strong>Summary:</strong> {total_commits} commit{'s' if total_commits != 1 else ''} across {len([r for r in repo_activity if r['commits']])} repositories in the last {period}.
</div>

<h2>System Status</h2>
<div class="metric-grid">
    <div class="metric-card">
        <div class="metric-value">{sys_status['uptime']}</div>
        <div class="metric-label">Uptime</div>
    </div>
    <div class="metric-card">
        <div class="metric-value">{sys_status['disk_used']}</div>
        <div class="metric-label">Disk Used ({sys_status['disk_free']} free)</div>
    </div>
    <div class="metric-card">
        <div class="metric-value">{sys_status['memory_used']}</div>
        <div class="metric-label">Memory ({sys_status['memory_total']} total)</div>
    </div>
    <div class="metric-card">
        <div class="metric-value">{sys_status['docker_containers']}</div>
        <div class="metric-label">Docker Containers</div>
    </div>
</div>

<h2>Git Activity</h2>
"""

    # Add repo activity
    for repo in repo_activity:
        html += f'<h3>{repo["name"]}</h3>\n'
        if repo['commits']:
            html += '<div class="commit-list">\n'
            for commit in repo['commits'][:10]:  # Limit to 10
                html += f'''<div class="commit-item">
    <span class="commit-hash">{commit['hash']}</span>
    <span class="commit-message">{commit['message']}</span>
</div>\n'''
            html += '</div>\n'
        else:
            html += '<p class="no-activity">No commits in this period</p>\n'

    # SSL Certificates
    html += '\n<h2>SSL Certificates</h2>\n<table>\n<tr><th>Domain</th><th>Days Remaining</th><th>Status</th></tr>\n'

    for cert in ssl_certs:
        try:
            days = int(cert.get('days', '0').strip())
            if days > 30:
                status_class = 'ssl-good'
                status_text = 'OK'
            elif days > 14:
                status_class = 'ssl-warning'
                status_text = 'Renewing Soon'
            else:
                status_class = 'ssl-danger'
                status_text = 'Urgent'
        except:
            days = '?'
            status_class = 'ssl-warning'
            status_text = 'Unknown'

        html += f'<tr><td>{cert.get("name", "Unknown")}</td><td>{days} days</td><td class="{status_class}">{status_text}</td></tr>\n'

    html += '</table>\n'

    # Footer
    html += f'''
<div class="footer">
    <p>Generated by <strong>Shadow Infrastructure</strong><br>
    <a href="https://zaylegend.com">zaylegend.com</a></p>
</div>

</body>
</html>'''

    return html, total_commits


def generate_text_report(report_type="daily"):
    """Generate plain text fallback."""
    since_days = 1 if report_type == "daily" else 7
    period = "24 hours" if report_type == "daily" else "7 days"

    lines = [
        f"Shadow {report_type.title()} Report",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"Period: Last {period}",
        "",
        "=" * 50,
        ""
    ]

    total_commits = 0
    for repo_path, repo_name in TRACKED_REPOS:
        if not Path(repo_path).exists():
            continue

        commits = get_git_commits(repo_path, since_days)
        if commits:
            lines.append(f"{repo_name}:")
            for line in commits.split('\n')[:5]:
                if '|' in line:
                    parts = line.split('|')
                    lines.append(f"  - {parts[0]} {parts[1]}")
                    total_commits += 1
            lines.append("")

    lines.append(f"Total: {total_commits} commits")
    return "\n".join(lines), total_commits


def send_report(report_type="daily"):
    """Generate and send the work report."""
    html_report, commit_count = generate_html_report(report_type)
    text_report, _ = generate_text_report(report_type)

    # Create email
    subject = f"Shadow {'Daily' if report_type == 'daily' else 'Weekly'} Report - {datetime.now().strftime('%b %d, %Y')}"
    if commit_count > 0:
        subject += f" ({commit_count} commits)"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Shadow <{SMTP_USER}>"
    msg["To"] = TO_EMAIL

    msg.attach(MIMEText(text_report, "plain"))
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
