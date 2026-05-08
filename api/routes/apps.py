"""
Apps API Routes
"""

import socket
import subprocess
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

PORTFOLIO_DIR = "/var/www/zaylegend"
SCRIPTS_DIR = f"{PORTFOLIO_DIR}/scripts"

# App directory mappings for git operations
APP_DIRS = {
    # Finished apps
    "dj-visualizer": f"{PORTFOLIO_DIR}/apps/dj-visualizer",
    "chord-genesis": f"{PORTFOLIO_DIR}/apps/chord-genesis",
    "fineline": f"{PORTFOLIO_DIR}/apps/fineline",
    "game-hub": f"{PORTFOLIO_DIR}/apps/game-hub",
    "sprite-gen": f"{PORTFOLIO_DIR}/apps/spritegen",
    "voice-assistant": f"{PORTFOLIO_DIR}/apps/voice-assistant",
    "knowledge-base": f"{PORTFOLIO_DIR}/apps/knowledge-base",
    "contentforge": f"{PORTFOLIO_DIR}/apps/contentforge",
    # Testing apps
    "ionos-exam": f"{PORTFOLIO_DIR}/apps/IONOS-Cloud-Exam-Prep",
    "forge-fit": f"{PORTFOLIO_DIR}/apps/forge-fit",
    # Client projects (separate repos, separate domains)
    "green-empire-build": f"{PORTFOLIO_DIR}/apps/green-empire",  # Builders - greenempirebuild.com
    "green-empire-land": "/var/www/Green-Empire",  # Landscaping - greenempireland.com
    "bh-ai-79": f"{PORTFOLIO_DIR}/apps/testing/bh-ai-79",
    "darkflow": f"{PORTFOLIO_DIR}/apps/testing/darkflow-mind-mapper",
    "gmat": f"{PORTFOLIO_DIR}/apps/testing/gmat-mastery-suite",
    "got-hired": f"{PORTFOLIO_DIR}/apps/testing/got-hired-ai",
    "losk": f"{PORTFOLIO_DIR}/apps/testing/losk",
    "purple-lotus": f"{PORTFOLIO_DIR}/apps/testing/purple-lotus",
    "zen-tot": f"{PORTFOLIO_DIR}/apps/testing/zen-tot",
    "slam-og-studio": f"{PORTFOLIO_DIR}/apps/slam-og-studio",
    "narrative-navigator": f"{PORTFOLIO_DIR}/apps/testing/narrative-navigator",
    "zen-reset": f"{PORTFOLIO_DIR}/apps/zen-reset",
    "contentforge": f"{PORTFOLIO_DIR}/apps/contentforge",
    "daily-brief": f"{PORTFOLIO_DIR}/apps/testing/daily-brief",
}

# App registry
APPS = {
    "portfolio": {"port": 8080, "category": "finished", "container": None},
    "zen-reset": {"port": 8081, "category": "finished", "container": "zen-reset-new"},
    "chord-genesis": {"port": 3001, "category": "finished", "container": "chord-genesis"},
    "fineline": {"port": 3003, "category": "finished", "container": "fineline"},
    "game-hub": {"port": 3004, "category": "finished", "container": "game-hub"},
    "dj-visualizer": {"port": 3005, "category": "finished", "container": "dj-visualizer"},
    "sprite-gen": {"port": 3006, "category": "testing", "container": "spritegen"},
    "voice-assistant": {"port": 3007, "category": "finished", "container": "voice-assistant-frontend"},
    "knowledge-base": {"port": None, "category": "testing", "container": None},  # Static files via nginx alias
    "contentforge": {"port": 3009, "category": "testing", "container": "contentforge"},
    "darkflow": {"port": 3010, "category": "testing", "container": "darkflow-mind-mapper"},
    "gmat": {"port": 3012, "category": "testing", "container": "gmat-mastery-suite"},
    "losk": {"port": 3013, "category": "testing", "container": "losk"},
    "got-hired": {"port": 3014, "category": "testing", "container": "got-hired-ai"},
    "bh-ai-79": {"port": 3015, "category": "testing", "container": "bh-ai-79"},
    "purple-lotus": {"port": 3016, "category": "testing", "container": "purple-lotus"},
    "zen-tot": {"port": 3017, "category": "testing", "container": "zen-tot"},
    "forge-fit": {"port": 3018, "category": "testing", "container": "forge-fit"},
    # Client projects (static sites, own domains)
    "green-empire-build": {"port": None, "category": "finished", "container": None},  # greenempirebuild.com
    "green-empire-land": {"port": None, "category": "finished", "container": None},  # greenempireland.com
    "ionos-exam": {"port": None, "category": "testing", "container": None},  # Static build, no container
    "slam-og-studio": {"port": None, "category": "testing", "container": None},  # Static build, Web DAW
    "narrative-navigator": {"port": None, "category": "testing", "container": None},  # Static build, Content Calendar
    "daily-brief": {"port": None, "category": "testing", "container": None},  # Static build, Gentle Future Platform Hub
}


def check_port(port: int, timeout: float = 1.0) -> bool:
    """Check if a port is responding."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            return sock.connect_ex(('127.0.0.1', port)) == 0
    except:
        return False


@router.get("")
async def list_apps():
    """List all apps with their status."""
    apps_list = []
    for name, info in APPS.items():
        apps_list.append({
            "name": name,
            "port": info["port"],
            "category": info["category"],
            "container": info["container"],
        })

    return {
        "total": len(apps_list),
        "apps": apps_list,
    }


@router.get("/health")
async def check_all_apps_health():
    """Check health of all apps."""
    results = {"up": [], "down": []}

    for name, info in APPS.items():
        port = info["port"]
        if port:
            is_up = check_port(port)
            app_info = {"name": name, "port": port, "category": info["category"]}
            if is_up:
                results["up"].append(app_info)
            else:
                results["down"].append(app_info)

    return {
        "up_count": len(results["up"]),
        "down_count": len(results["down"]),
        **results,
    }


@router.get("/stats")
async def get_stats():
    """Get comprehensive stats for dashboard visualizations."""
    # Cache port check results to avoid duplicate checks
    port_status_cache = {}

    def get_port_status(port: int) -> bool:
        if port not in port_status_cache:
            port_status_cache[port] = check_port(port)
        return port_status_cache[port]

    # Category distribution
    categories = {}
    for app_name, info in APPS.items():
        cat = info["category"]
        categories[cat] = categories.get(cat, 0) + 1

    # Status distribution and category status in single pass
    up_count = 0
    down_count = 0
    external_count = 0

    category_status = {
        "finished": {"up": 0, "down": 0, "total": 0},
        "testing": {"up": 0, "down": 0, "total": 0},
        "upgrading": {"up": 0, "down": 0, "total": 0},
    }

    for app_name, info in APPS.items():
        port = info["port"]
        cat = info["category"]

        if cat in category_status:
            category_status[cat]["total"] += 1

        if port is None:
            external_count += 1
        elif get_port_status(port):
            up_count += 1
            if cat in category_status:
                category_status[cat]["up"] += 1
        else:
            down_count += 1
            if cat in category_status:
                category_status[cat]["down"] += 1

    return {
        "total_apps": len(APPS),
        "category_distribution": [
            {"name": "Finished", "value": categories.get("finished", 0), "color": "#10b981"},
            {"name": "Testing", "value": categories.get("testing", 0), "color": "#f59e0b"},
            {"name": "Upgrading", "value": categories.get("upgrading", 0), "color": "#8b5cf6"},
        ],
        "status_distribution": {
            "up": up_count,
            "down": down_count,
            "external": external_count,
        },
        "category_status": [
            {"category": "Finished", "up": category_status["finished"]["up"], "down": category_status["finished"]["down"], "total": category_status["finished"]["total"]},
            {"category": "Testing", "up": category_status["testing"]["up"], "down": category_status["testing"]["down"], "total": category_status["testing"]["total"]},
            {"category": "Upgrading", "up": category_status["upgrading"]["up"], "down": category_status["upgrading"]["down"], "total": category_status["upgrading"]["total"]},
        ],
    }


@router.get("/{app_name}")
async def get_app_info(app_name: str):
    """Get info about a specific app."""
    app_info = APPS.get(app_name)
    if not app_info:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not found")

    is_up = check_port(app_info["port"]) if app_info["port"] else None

    return {
        "name": app_name,
        "port": app_info["port"],
        "category": app_info["category"],
        "container": app_info["container"],
        "status": "up" if is_up else "down" if is_up is not None else "external",
    }


@router.get("/{app_name}/health")
async def check_app_health(app_name: str):
    """Check health of a specific app."""
    app_info = APPS.get(app_name)
    if not app_info:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not found")

    port = app_info["port"]
    if not port:
        return {"name": app_name, "status": "external", "message": "No port assigned"}

    is_up = check_port(port)
    return {
        "name": app_name,
        "port": port,
        "status": "up" if is_up else "down",
    }


@router.post("/{app_name}/restart")
async def restart_app(app_name: str):
    """Restart an app's Docker container."""
    app_info = APPS.get(app_name)
    if not app_info:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not found")

    container = app_info.get("container")
    if not container:
        raise HTTPException(status_code=400, detail=f"App '{app_name}' has no container")

    try:
        result = subprocess.run(
            ["docker", "restart", container],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode == 0:
            return {
                "name": app_name,
                "container": container,
                "status": "restarted",
            }
        else:
            raise HTTPException(status_code=500, detail=f"Failed to restart: {result.stderr}")
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Restart timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/updates/check")
async def check_all_updates():
    """Check all apps for available updates."""
    updates = []

    for app_name, app_dir in APP_DIRS.items():
        if not os.path.exists(f"{app_dir}/.git"):
            continue

        try:
            # Get current branch
            branch_result = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                capture_output=True, text=True, cwd=app_dir, timeout=10
            )
            branch = branch_result.stdout.strip() or "main"

            # Fetch from origin
            subprocess.run(
                ["git", "fetch", "origin", branch],
                capture_output=True, cwd=app_dir, timeout=30
            )

            # Check commits behind
            behind_result = subprocess.run(
                ["git", "rev-list", "--count", f"HEAD..origin/{branch}"],
                capture_output=True, text=True, cwd=app_dir, timeout=10
            )
            commits_behind = int(behind_result.stdout.strip() or "0")

            # Get latest commit message
            msg_result = subprocess.run(
                ["git", "log", f"origin/{branch}", "-1", "--format=%s"],
                capture_output=True, text=True, cwd=app_dir, timeout=10
            )
            latest_msg = msg_result.stdout.strip()[:60]

            if commits_behind > 0:
                updates.append({
                    "name": app_name,
                    "commits_behind": commits_behind,
                    "latest_commit": latest_msg,
                    "branch": branch,
                })
        except Exception as e:
            continue

    return {
        "total_updates": len(updates),
        "apps_with_updates": updates,
    }


@router.get("/{app_name}/updates")
async def check_app_updates(app_name: str):
    """Check if a specific app has updates available."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked for updates")

    if not os.path.exists(f"{app_dir}/.git"):
        raise HTTPException(status_code=400, detail=f"App '{app_name}' is not a git repository")

    try:
        # Get current branch
        branch_result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        branch = branch_result.stdout.strip() or "main"

        # Fetch from origin
        subprocess.run(
            ["git", "fetch", "origin", branch],
            capture_output=True, cwd=app_dir, timeout=30
        )

        # Check commits behind
        behind_result = subprocess.run(
            ["git", "rev-list", "--count", f"HEAD..origin/{branch}"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        commits_behind = int(behind_result.stdout.strip() or "0")

        # Get commit log
        log_result = subprocess.run(
            ["git", "log", f"HEAD..origin/{branch}", "--oneline"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        commits = log_result.stdout.strip().split('\n') if log_result.stdout.strip() else []

        return {
            "name": app_name,
            "branch": branch,
            "commits_behind": commits_behind,
            "has_updates": commits_behind > 0,
            "pending_commits": commits[:10],  # Limit to 10
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{app_name}/update")
async def update_app(app_name: str):
    """Pull latest changes and rebuild an app."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked for updates")

    update_script = f"{SCRIPTS_DIR}/update-app.sh"
    if not os.path.exists(update_script):
        raise HTTPException(status_code=500, detail="Update script not found")

    try:
        # Pass the actual directory path to avoid script finding wrong directory
        result = subprocess.run(
            [update_script, app_dir],
            capture_output=True,
            text=True,
            timeout=300,  # 5 min timeout for builds
            cwd=PORTFOLIO_DIR
        )

        # Parse output for status
        output = result.stdout + result.stderr
        success = result.returncode == 0 or "Update complete" in output

        return {
            "name": app_name,
            "success": success,
            "output": output[-2000:],  # Last 2000 chars
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Update timed out (5 min limit)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
