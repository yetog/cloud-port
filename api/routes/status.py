"""
Status API Routes
"""

import subprocess
import socket
import sqlite3
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()


def check_port(port: int, timeout: float = 1.0) -> bool:
    """Check if a port is responding."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            return sock.connect_ex(('127.0.0.1', port)) == 0
    except:
        return False


@router.get("/status")
async def get_status():
    """Get comprehensive system status."""
    status = {
        "nginx": "unknown",
        "docker_containers": 0,
        "git_changes": 0,
        "pending_tasks": 0,
        "services": {},
    }

    # Nginx
    try:
        result = subprocess.run(
            ["systemctl", "is-active", "nginx"],
            capture_output=True, text=True, timeout=5
        )
        status["nginx"] = "up" if result.returncode == 0 else "down"
    except:
        pass

    # Docker containers
    try:
        result = subprocess.run(
            ["docker", "ps", "-q"],
            capture_output=True, text=True, timeout=10
        )
        containers = [c for c in result.stdout.strip().split('\n') if c]
        status["docker_containers"] = len(containers)
    except:
        pass

    # Git changes
    try:
        result = subprocess.run(
            ["git", "status", "--short"],
            cwd="/var/www/zaylegend",
            capture_output=True, text=True, timeout=5
        )
        changes = [l for l in result.stdout.strip().split('\n') if l]
        status["git_changes"] = len(changes)
    except:
        pass

    # Pending tasks
    try:
        db_path = Path("/var/www/zaylegend/brain.db")
        if db_path.exists():
            conn = sqlite3.connect(str(db_path))
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'pending'")
            status["pending_tasks"] = cursor.fetchone()[0]
            conn.close()
    except:
        pass

    # Key services
    services = {
        "portfolio": 8080,
        "redis": 6379,
        "qdrant": 6333,
        "prometheus": 9090,
        "grafana": 3030,
    }
    for name, port in services.items():
        status["services"][name] = "up" if check_port(port) else "down"

    return status


@router.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "brain-api"}
