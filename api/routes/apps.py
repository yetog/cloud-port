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
# Organized by category: production, staging, development, misc, client
APP_DIRS = {
    # === PRODUCTION APPS (finished, deployed) ===
    "dj-visualizer": f"{PORTFOLIO_DIR}/apps/production/dj-visualizer",
    "chord-genesis": f"{PORTFOLIO_DIR}/apps/production/chord-genesis",
    "fineline": f"{PORTFOLIO_DIR}/apps/production/fineline",
    "game-hub": f"{PORTFOLIO_DIR}/apps/production/game-hub",
    "sprite-gen": f"{PORTFOLIO_DIR}/apps/production/spritegen",
    "voice-assistant": f"{PORTFOLIO_DIR}/apps/production/voice-assistant",
    "knowledge-base": f"{PORTFOLIO_DIR}/apps/production/knowledge-base",
    "contentforge": f"{PORTFOLIO_DIR}/apps/production/contentforge",
    "zen-reset": f"{PORTFOLIO_DIR}/apps/production/zen-reset",

    # === STAGING APPS (testing, beta) ===
    "ionos-exam": f"{PORTFOLIO_DIR}/apps/staging/IONOS-Cloud-Exam-Prep",
    "bh-ai-79": f"{PORTFOLIO_DIR}/apps/staging/bh-ai-79",
    "darkflow": f"{PORTFOLIO_DIR}/apps/staging/darkflow-mind-mapper",
    "gmat": f"{PORTFOLIO_DIR}/apps/staging/gmat-mastery-suite",
    "got-hired": f"{PORTFOLIO_DIR}/apps/staging/got-hired-ai",
    "losk": f"{PORTFOLIO_DIR}/apps/staging/losk",
    "purple-lotus": f"{PORTFOLIO_DIR}/apps/staging/purple-lotus",
    "zen-tot": f"{PORTFOLIO_DIR}/apps/staging/zen-tot",
    "forge-fit": f"{PORTFOLIO_DIR}/apps/staging/forge-fit",
    "narrative-navigator": f"{PORTFOLIO_DIR}/apps/staging/narrative-navigator",
    "daily-brief": f"{PORTFOLIO_DIR}/apps/staging/daily-brief",
    "questful-living": f"{PORTFOLIO_DIR}/apps/staging/questful-living",
    "green-empire-build": f"{PORTFOLIO_DIR}/apps/staging/green-empire",

    # === DEVELOPMENT APPS (in progress, not deployed) ===
    "ashley-v3": f"{PORTFOLIO_DIR}/apps/development/Ashley-v3",
    "sensei-ai-io": f"{PORTFOLIO_DIR}/apps/development/sensei-ai-io",
    "ask-hr-beta": f"{PORTFOLIO_DIR}/apps/development/ask-hr-beta",
    "sop-ai-beta": f"{PORTFOLIO_DIR}/apps/development/sop-ai-beta",
    "vibe-creator": f"{PORTFOLIO_DIR}/apps/development/vibe-creator",

    # === MISC (research, experimental) ===
    "slam-og-studio": f"{PORTFOLIO_DIR}/apps/misc/slam-og-studio",
    "daw-research": f"{PORTFOLIO_DIR}/apps/misc/daw-research",

    # === CLIENT PROJECTS (separate repos/domains) ===
    "dover-church": f"{PORTFOLIO_DIR}/apps/dover-church-rebuild-project",
    "green-empire-land": "/var/www/Green-Empire",
    "goat-landscaping": "/var/www/goatlandscapeli.com/html",
    "greenridge": "/var/www/greenridgelandscapedesign",
}

# App registry for health checks and dashboard
APPS = {
    # === PRODUCTION (finished) ===
    "portfolio": {"port": 8080, "category": "finished", "container": None},
    "zen-reset": {"port": 8081, "category": "finished", "container": "zen-reset-new"},
    "chord-genesis": {"port": 3001, "category": "finished", "container": "chord-genesis"},
    "fineline": {"port": 3003, "category": "finished", "container": "fineline"},
    "game-hub": {"port": 3004, "category": "finished", "container": "game-hub"},
    "dj-visualizer": {"port": 3005, "category": "finished", "container": "dj-visualizer"},
    "sprite-gen": {"port": 3006, "category": "finished", "container": "spritegen"},
    "voice-assistant": {"port": 3007, "category": "finished", "container": "voice-assistant-frontend"},
    "knowledge-base": {"port": 3008, "category": "finished", "container": None},  # Static via nginx
    "contentforge": {"port": 3009, "category": "finished", "container": "contentforge"},

    # === STAGING (testing) ===
    "vibe-creator": {"port": None, "category": "testing", "container": None},  # Static via nginx
    "darkflow": {"port": 3010, "category": "testing", "container": "darkflow-mind-mapper"},
    "gmat": {"port": 3012, "category": "testing", "container": "gmat-mastery-suite"},
    "losk": {"port": 3013, "category": "testing", "container": "losk"},
    "got-hired": {"port": 3014, "category": "testing", "container": "got-hired-ai"},
    "bh-ai-79": {"port": 3015, "category": "testing", "container": "bh-ai-79"},
    "purple-lotus": {"port": 3016, "category": "testing", "container": "purple-lotus"},
    "zen-tot": {"port": 3017, "category": "testing", "container": "zen-tot"},
    "forge-fit": {"port": 3018, "category": "testing", "container": "forge-fit"},
    "ionos-exam": {"port": None, "category": "testing", "container": None},  # Static
    "narrative-navigator": {"port": None, "category": "testing", "container": None},
    "daily-brief": {"port": None, "category": "testing", "container": None},
    "questful-living": {"port": None, "category": "testing", "container": None},
    "slam-og-studio": {"port": None, "category": "testing", "container": None},

    # === DEVELOPMENT (upgrading) ===
    "ashley-v3": {"port": None, "category": "upgrading", "container": None},
    "sensei-ai-io": {"port": None, "category": "upgrading", "container": None},
    "ask-hr-beta": {"port": None, "category": "upgrading", "container": None},
    "sop-ai-beta": {"port": None, "category": "upgrading", "container": None},

    # === CLIENT PROJECTS ===
    "dover-church": {"port": None, "category": "client", "container": None},
    "green-empire-build": {"port": None, "category": "client", "container": None},
    "green-empire-land": {"port": None, "category": "client", "container": None},
    "goat-landscaping": {"port": None, "category": "client", "container": None},
    "greenridge": {"port": None, "category": "client", "container": None},
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
            "has_git": name in APP_DIRS,
        })

    return {
        "total": len(apps_list),
        "apps": apps_list,
    }


@router.get("/health")
async def check_all_apps_health():
    """Check health of all apps."""
    results = {"up": [], "down": [], "external": []}

    for name, info in APPS.items():
        port = info["port"]
        app_info = {"name": name, "port": port, "category": info["category"]}

        if port:
            is_up = check_port(port)
            if is_up:
                results["up"].append(app_info)
            else:
                results["down"].append(app_info)
        else:
            results["external"].append(app_info)

    return {
        "up_count": len(results["up"]),
        "down_count": len(results["down"]),
        "external_count": len(results["external"]),
        **results,
    }


@router.get("/stats")
async def get_stats():
    """Get comprehensive stats for dashboard visualizations."""
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

    # Status distribution
    up_count = 0
    down_count = 0
    external_count = 0

    category_status = {
        "finished": {"up": 0, "down": 0, "total": 0},
        "testing": {"up": 0, "down": 0, "total": 0},
        "upgrading": {"up": 0, "down": 0, "total": 0},
        "client": {"up": 0, "down": 0, "total": 0},
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
        "tracked_for_updates": len(APP_DIRS),
        "category_distribution": [
            {"name": "Finished", "value": categories.get("finished", 0), "color": "#10b981"},
            {"name": "Testing", "value": categories.get("testing", 0), "color": "#f59e0b"},
            {"name": "Upgrading", "value": categories.get("upgrading", 0), "color": "#8b5cf6"},
            {"name": "Client", "value": categories.get("client", 0), "color": "#3b82f6"},
        ],
        "status_distribution": {
            "up": up_count,
            "down": down_count,
            "external": external_count,
        },
        "category_status": [
            {"category": "Finished", **category_status["finished"]},
            {"category": "Testing", **category_status["testing"]},
            {"category": "Upgrading", **category_status["upgrading"]},
            {"category": "Client", **category_status["client"]},
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
        "has_git": app_name in APP_DIRS,
        "directory": APP_DIRS.get(app_name),
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
    errors = []

    for app_name, app_dir in APP_DIRS.items():
        if not os.path.exists(app_dir):
            errors.append({"name": app_name, "error": "Directory not found"})
            continue

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

            # Check commits ahead (local changes not pushed)
            ahead_result = subprocess.run(
                ["git", "rev-list", "--count", f"origin/{branch}..HEAD"],
                capture_output=True, text=True, cwd=app_dir, timeout=10
            )
            commits_ahead = int(ahead_result.stdout.strip() or "0")

            # Get latest commit message
            msg_result = subprocess.run(
                ["git", "log", f"origin/{branch}", "-1", "--format=%s"],
                capture_output=True, text=True, cwd=app_dir, timeout=10
            )
            latest_msg = msg_result.stdout.strip()[:60]

            if commits_behind > 0 or commits_ahead > 0:
                updates.append({
                    "name": app_name,
                    "commits_behind": commits_behind,
                    "commits_ahead": commits_ahead,
                    "latest_commit": latest_msg,
                    "branch": branch,
                    "can_pull": commits_behind > 0,
                    "can_push": commits_ahead > 0,
                })
        except Exception as e:
            errors.append({"name": app_name, "error": str(e)})
            continue

    return {
        "total_updates": len(updates),
        "apps_with_updates": updates,
        "errors": errors if errors else None,
    }


@router.get("/{app_name}/updates")
async def check_app_updates(app_name: str):
    """Check if a specific app has updates available."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked for updates")

    if not os.path.exists(app_dir):
        raise HTTPException(status_code=404, detail=f"Directory not found: {app_dir}")

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

        # Check commits ahead
        ahead_result = subprocess.run(
            ["git", "rev-list", "--count", f"origin/{branch}..HEAD"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        commits_ahead = int(ahead_result.stdout.strip() or "0")

        # Get pending commit logs (both directions)
        behind_log = subprocess.run(
            ["git", "log", f"HEAD..origin/{branch}", "--oneline"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        ahead_log = subprocess.run(
            ["git", "log", f"origin/{branch}..HEAD", "--oneline"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )

        commits_to_pull = behind_log.stdout.strip().split('\n') if behind_log.stdout.strip() else []
        commits_to_push = ahead_log.stdout.strip().split('\n') if ahead_log.stdout.strip() else []

        return {
            "name": app_name,
            "branch": branch,
            "commits_behind": commits_behind,
            "commits_ahead": commits_ahead,
            "has_updates": commits_behind > 0,
            "has_local_commits": commits_ahead > 0,
            "pending_pulls": commits_to_pull[:10],
            "pending_pushes": commits_to_push[:10],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{app_name}/update")
async def update_app(app_name: str):
    """Pull latest changes and rebuild an app."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked for updates")

    if not os.path.exists(app_dir):
        raise HTTPException(status_code=404, detail=f"Directory not found: {app_dir}")

    update_script = f"{SCRIPTS_DIR}/maintenance/update-app.sh"
    if not os.path.exists(update_script):
        raise HTTPException(status_code=500, detail="Update script not found")

    try:
        result = subprocess.run(
            [update_script, app_dir],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=PORTFOLIO_DIR
        )

        output = result.stdout + result.stderr
        success = result.returncode == 0 or "Update complete" in output

        return {
            "name": app_name,
            "success": success,
            "output": output[-2000:],
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Update timed out (5 min limit)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{app_name}/push")
async def push_app(app_name: str):
    """Push local changes to GitHub for an app."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked")

    if not os.path.exists(app_dir):
        raise HTTPException(status_code=404, detail=f"Directory not found: {app_dir}")

    if not os.path.exists(f"{app_dir}/.git"):
        raise HTTPException(status_code=400, detail=f"App '{app_name}' is not a git repository")

    try:
        # Check for uncommitted changes
        status_result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )

        has_uncommitted = bool(status_result.stdout.strip())

        if has_uncommitted:
            # Add all changes
            subprocess.run(
                ["git", "add", "-A"],
                capture_output=True, cwd=app_dir, timeout=10
            )

            # Commit with timestamp
            from datetime import datetime
            commit_msg = f"Update from dashboard - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            subprocess.run(
                ["git", "commit", "-m", commit_msg],
                capture_output=True, cwd=app_dir, timeout=30
            )

        # Get current branch
        branch_result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        branch = branch_result.stdout.strip() or "main"

        # Push to origin (use deploy key if available)
        env = os.environ.copy()
        env["GIT_SSH_COMMAND"] = "ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"

        push_result = subprocess.run(
            ["git", "push", "origin", branch],
            capture_output=True, text=True, cwd=app_dir, timeout=60,
            env=env
        )

        output = push_result.stdout + push_result.stderr
        success = push_result.returncode == 0 or "Everything up-to-date" in output

        return {
            "name": app_name,
            "success": success,
            "had_uncommitted_changes": has_uncommitted,
            "branch": branch,
            "output": output[-1000:],
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Push timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{app_name}/status")
async def get_app_git_status(app_name: str):
    """Get git status for an app (uncommitted changes, ahead/behind)."""
    app_dir = APP_DIRS.get(app_name)
    if not app_dir:
        raise HTTPException(status_code=404, detail=f"App '{app_name}' not tracked")

    if not os.path.exists(app_dir):
        raise HTTPException(status_code=404, detail=f"Directory not found: {app_dir}")

    if not os.path.exists(f"{app_dir}/.git"):
        raise HTTPException(status_code=400, detail=f"App '{app_name}' is not a git repository")

    try:
        # Get uncommitted changes
        status_result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        changes = status_result.stdout.strip().split('\n') if status_result.stdout.strip() else []

        # Get branch
        branch_result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        branch = branch_result.stdout.strip() or "main"

        # Get remote URL
        remote_result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True, text=True, cwd=app_dir, timeout=10
        )
        remote_url = remote_result.stdout.strip()

        return {
            "name": app_name,
            "branch": branch,
            "remote_url": remote_url,
            "has_uncommitted_changes": len(changes) > 0,
            "uncommitted_count": len(changes),
            "uncommitted_files": changes[:20],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
