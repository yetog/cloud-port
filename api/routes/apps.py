"""
Apps API Routes
"""

import socket
import subprocess
from fastapi import APIRouter, HTTPException

router = APIRouter()

# App registry
APPS = {
    "portfolio": {"port": 8080, "category": "finished", "container": None},
    "zen-reset": {"port": 8081, "category": "finished", "container": "zen-reset-new"},
    "chord-genesis": {"port": 3001, "category": "finished", "container": "chord-genesis"},
    "fineline": {"port": 3003, "category": "finished", "container": "fineline"},
    "game-hub": {"port": 3004, "category": "finished", "container": "game-hub"},
    "dj-visualizer": {"port": 3005, "category": "finished", "container": "dj-visualizer"},
    "sprite-gen": {"port": 3006, "category": "finished", "container": "spritegen"},
    "voice-assistant": {"port": 3007, "category": "finished", "container": "voice-assistant-frontend"},
    "knowledge-base": {"port": 3008, "category": "finished", "container": None},
    "contentforge": {"port": 3009, "category": "finished", "container": None},
    "darkflow": {"port": 3010, "category": "testing", "container": "darkflow-mind-mapper"},
    "gmat": {"port": 3012, "category": "testing", "container": "gmat-mastery-suite"},
    "losk": {"port": 3013, "category": "testing", "container": "losk"},
    "got-hired": {"port": 3014, "category": "testing", "container": "got-hired-ai"},
    "bh-ai-79": {"port": 3015, "category": "testing", "container": "bh-ai-79"},
    "purple-lotus": {"port": 3016, "category": "testing", "container": "purple-lotus"},
    "zen-tot": {"port": 3017, "category": "testing", "container": "zen-tot"},
    "forge-fit": {"port": 3018, "category": "testing", "container": "forge-fit"},
    "green-empire": {"port": 3019, "category": "testing", "container": "green-empire"},
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
