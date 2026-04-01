"""
Deploy Skill - Handles portfolio deployment operations.
"""

import subprocess
from pathlib import Path
from .base import SyncSkill, SkillResult, ApprovalCategory


class DeploySkill(SyncSkill):
    """Execute portfolio deployment."""

    name = "deploy"
    description = "Deploy the portfolio - pulls from GitHub, builds, and deploys"
    trigger_intents = ["deploy", "push_changes", "update_site", "publish"]
    approval_category = ApprovalCategory.STANDARD
    requires_confirmation = True

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "skip_build": {
                    "type": "boolean",
                    "description": "Skip npm build step",
                    "default": False
                },
                "dry_run": {
                    "type": "boolean",
                    "description": "Show what would be done without executing",
                    "default": False
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        script_path = Path("/var/www/zaylegend/scripts/deploy.sh")

        if not script_path.exists():
            return SkillResult(
                context_data=f"Deploy script not found at {script_path}",
                success=False,
                is_error=True
            )

        dry_run = params.get("dry_run", False)

        if dry_run:
            return SkillResult(
                context_data="[DRY RUN] Would execute: ./scripts/deploy.sh\n"
                            "Steps: git pull → npm ci → npm run build → backup dist → copy to dist/",
                success=True
            )

        try:
            result = subprocess.run(
                [str(script_path)],
                cwd="/var/www/zaylegend",
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )

            output = result.stdout
            if result.stderr:
                output += f"\n\nStderr:\n{result.stderr}"

            return SkillResult(
                context_data=output if output else "Deployment completed",
                success=result.returncode == 0,
                is_error=result.returncode != 0,
                metadata={"return_code": result.returncode}
            )

        except subprocess.TimeoutExpired:
            return SkillResult(
                context_data="Deployment timed out after 5 minutes",
                success=False,
                is_error=True
            )
        except Exception as e:
            return SkillResult(
                context_data=f"Deployment failed: {str(e)}",
                success=False,
                is_error=True
            )
