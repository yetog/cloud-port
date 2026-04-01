"""
Status Skill - Aggregated system status overview.
"""

import subprocess
import socket
import sqlite3
from pathlib import Path
from .base import SyncSkill, SkillResult, ApprovalCategory


class StatusSkill(SyncSkill):
    """Get comprehensive system status."""

    name = "status"
    description = "Get a comprehensive overview of the portfolio infrastructure"
    trigger_intents = ["status", "overview", "system_status", "health"]
    approval_category = ApprovalCategory.NONE

    def execute_sync(self, params: dict) -> SkillResult:
        sections = []

        # 1. Nginx status
        try:
            result = subprocess.run(
                ["systemctl", "is-active", "nginx"],
                capture_output=True, text=True, timeout=5
            )
            nginx_status = "UP" if result.returncode == 0 else "DOWN"
        except:
            nginx_status = "UNKNOWN"

        sections.append(f"Nginx: {nginx_status}")

        # 2. Docker containers
        try:
            result = subprocess.run(
                ["docker", "ps", "--format", "{{.Names}}"],
                capture_output=True, text=True, timeout=10
            )
            containers = [c for c in result.stdout.strip().split('\n') if c]
            sections.append(f"Docker: {len(containers)} containers running")
        except:
            sections.append("Docker: UNKNOWN")

        # 3. Git status
        try:
            result = subprocess.run(
                ["git", "status", "--short"],
                cwd="/var/www/zaylegend",
                capture_output=True, text=True, timeout=5
            )
            changes = len([l for l in result.stdout.strip().split('\n') if l])
            sections.append(f"Git: {changes} uncommitted changes")
        except:
            sections.append("Git: UNKNOWN")

        # 4. Last commit
        try:
            result = subprocess.run(
                ["git", "log", "-1", "--format=%ar - %s"],
                cwd="/var/www/zaylegend",
                capture_output=True, text=True, timeout=5
            )
            sections.append(f"Last commit: {result.stdout.strip()}")
        except:
            pass

        # 5. Disk usage
        try:
            result = subprocess.run(
                ["df", "-h", "/var/www"],
                capture_output=True, text=True, timeout=5
            )
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:
                parts = lines[1].split()
                if len(parts) >= 5:
                    sections.append(f"Disk: {parts[4]} used ({parts[2]} of {parts[1]})")
        except:
            pass

        # 6. Pending tasks
        try:
            db_path = Path("/var/www/zaylegend/brain.db")
            if db_path.exists():
                conn = sqlite3.connect(str(db_path))
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
                pending = cursor.fetchone()[0]
                conn.close()
                sections.append(f"Pending tasks: {pending}")
        except:
            pass

        # 7. Memory usage
        try:
            result = subprocess.run(
                ["free", "-h"],
                capture_output=True, text=True, timeout=5
            )
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:
                parts = lines[1].split()
                if len(parts) >= 3:
                    sections.append(f"Memory: {parts[2]} used of {parts[1]}")
        except:
            pass

        # 8. Key ports
        key_ports = {8080: "Portfolio", 6379: "Redis", 9090: "Prometheus", 3030: "Grafana"}
        port_status = []
        for port, name in key_ports.items():
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                    sock.settimeout(1)
                    is_up = sock.connect_ex(('127.0.0.1', port)) == 0
                    port_status.append(f"{name}:{port}={'UP' if is_up else 'DOWN'}")
            except:
                port_status.append(f"{name}:{port}=UNKNOWN")

        sections.append(f"Services: {', '.join(port_status)}")

        output = "=== Portfolio Status ===\n\n" + "\n".join(sections)

        return SkillResult(
            context_data=output,
            success=True,
            metadata={
                "nginx": nginx_status,
                "containers": len(containers) if 'containers' in dir() else 0
            }
        )
