"""
App Skills - Manage portfolio applications.
"""

import socket
import subprocess
from .base import SyncSkill, SkillResult, ApprovalCategory


# App inventory (mirrors brain.py)
APPS = {
    # Finished apps
    "portfolio": {"port": 8080, "category": "finished", "container": None},
    "zen-reset": {"port": 8081, "category": "finished", "container": None},
    "chord-genesis": {"port": 3001, "category": "finished", "container": "chord-genesis"},
    "fineline": {"port": 3003, "category": "finished", "container": "fineline_web_1"},
    "game-hub": {"port": 3004, "category": "finished", "container": "game-hub"},
    "dj-visualizer": {"port": 3005, "category": "finished", "container": "dj-visualizer"},
    "sprite-gen": {"port": 3006, "category": "finished", "container": "spritegen"},
    "voice-assistant": {"port": 3007, "category": "finished", "container": None},
    "knowledge-base": {"port": 3008, "category": "finished", "container": None},
    "contentforge": {"port": 3009, "category": "finished", "container": None},
    # Testing apps
    "darkflow": {"port": 3010, "category": "testing", "container": "darkflow"},
    "gmat-mastery": {"port": 3012, "category": "testing", "container": "gmat"},
    "losk": {"port": 3013, "category": "testing", "container": "losk"},
    "got-hired": {"port": 3014, "category": "testing", "container": "got-hired"},
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
            result = sock.connect_ex(('127.0.0.1', port))
            return result == 0
    except:
        return False


class AppListSkill(SyncSkill):
    """List all portfolio applications."""

    name = "app_list"
    description = "List all portfolio applications by category"
    trigger_intents = ["list_apps", "show_apps", "apps", "get_apps"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["all", "finished", "testing", "upgrading"],
                    "description": "Filter by category",
                    "default": "all"
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        category_filter = params.get("category", "all")

        lines = []
        categories = {"finished": [], "testing": [], "upgrading": []}

        for name, info in APPS.items():
            cat = info["category"]
            port = info["port"]
            categories[cat].append(f"  - {name} (port {port})")

        if category_filter == "all":
            for cat, apps in categories.items():
                if apps:
                    lines.append(f"\n{cat.upper()} ({len(apps)}):")
                    lines.extend(apps)
        else:
            apps = categories.get(category_filter, [])
            lines.append(f"\n{category_filter.upper()} ({len(apps)}):")
            lines.extend(apps)

        return SkillResult(
            context_data="\n".join(lines) if lines else "No apps found",
            success=True,
            metadata={"total_apps": len(APPS)}
        )


class AppHealthSkill(SyncSkill):
    """Check health of all portfolio applications."""

    name = "app_health"
    description = "Check which apps are UP or DOWN"
    trigger_intents = ["check_apps", "app_status", "health_check", "apps_health"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["all", "finished", "testing"],
                    "default": "all"
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        category_filter = params.get("category", "all")

        up_apps = []
        down_apps = []

        for name, info in APPS.items():
            if category_filter != "all" and info["category"] != category_filter:
                continue

            port = info["port"]
            is_up = check_port(port)

            status = f"{name} (:{port})"
            if is_up:
                up_apps.append(status)
            else:
                down_apps.append(status)

        lines = [f"Apps Health Check ({category_filter}):"]
        lines.append(f"\nUP ({len(up_apps)}):")
        for app in up_apps:
            lines.append(f"  [OK] {app}")

        if down_apps:
            lines.append(f"\nDOWN ({len(down_apps)}):")
            for app in down_apps:
                lines.append(f"  [X] {app}")

        return SkillResult(
            context_data="\n".join(lines),
            success=True,
            metadata={
                "up_count": len(up_apps),
                "down_count": len(down_apps),
                "total": len(up_apps) + len(down_apps)
            }
        )


class AppRestartSkill(SyncSkill):
    """Restart a Docker-based application."""

    name = "app_restart"
    description = "Restart a Docker container for an application"
    trigger_intents = ["restart_app", "restart", "bounce_app"]
    approval_category = ApprovalCategory.STANDARD
    requires_confirmation = True

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "app_name": {
                    "type": "string",
                    "description": "Name of the app to restart"
                }
            },
            "required": ["app_name"]
        }

    def execute_sync(self, params: dict) -> SkillResult:
        app_name = params.get("app_name", "").lower().strip()

        if not app_name:
            return SkillResult(
                context_data="Error: app_name is required",
                success=False,
                is_error=True
            )

        # Find the app
        app_info = APPS.get(app_name)
        if not app_info:
            # Try partial match
            matches = [k for k in APPS.keys() if app_name in k]
            if len(matches) == 1:
                app_name = matches[0]
                app_info = APPS[app_name]
            elif len(matches) > 1:
                return SkillResult(
                    context_data=f"Ambiguous app name. Matches: {', '.join(matches)}",
                    success=False,
                    is_error=True
                )
            else:
                return SkillResult(
                    context_data=f"App '{app_name}' not found. Available: {', '.join(APPS.keys())}",
                    success=False,
                    is_error=True
                )

        container = app_info.get("container")
        if not container:
            return SkillResult(
                context_data=f"App '{app_name}' is not a Docker container (no container defined)",
                success=False,
                is_error=True
            )

        try:
            result = subprocess.run(
                ["docker", "restart", container],
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode == 0:
                return SkillResult(
                    context_data=f"Restarted container '{container}' for app '{app_name}'",
                    success=True,
                    metadata={"container": container, "app": app_name}
                )
            else:
                return SkillResult(
                    context_data=f"Failed to restart: {result.stderr}",
                    success=False,
                    is_error=True
                )

        except Exception as e:
            return SkillResult(
                context_data=f"Error restarting container: {str(e)}",
                success=False,
                is_error=True
            )
