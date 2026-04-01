"""
Backup Skill - Handles portfolio backup operations.
"""

import subprocess
from pathlib import Path
from .base import SyncSkill, SkillResult, ApprovalCategory


class BackupSkill(SyncSkill):
    """Execute portfolio backup."""

    name = "backup"
    description = "Create a backup of the portfolio with rotation (keeps last 10)"
    trigger_intents = ["backup", "save_state", "create_backup", "snapshot"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "dry_run": {
                    "type": "boolean",
                    "description": "Show what would be done without executing",
                    "default": False
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        script_path = Path("/var/www/zaylegend/scripts/backup.sh")

        if not script_path.exists():
            return SkillResult(
                context_data=f"Backup script not found at {script_path}",
                success=False,
                is_error=True
            )

        dry_run = params.get("dry_run", False)

        if dry_run:
            return SkillResult(
                context_data="[DRY RUN] Would execute: ./scripts/backup.sh\n"
                            "Creates timestamped backup, keeps last 10 backups",
                success=True
            )

        try:
            result = subprocess.run(
                [str(script_path)],
                cwd="/var/www/zaylegend",
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )

            output = result.stdout
            if result.stderr:
                output += f"\n\nStderr:\n{result.stderr}"

            return SkillResult(
                context_data=output if output else "Backup completed",
                success=result.returncode == 0,
                is_error=result.returncode != 0,
                metadata={"return_code": result.returncode}
            )

        except subprocess.TimeoutExpired:
            return SkillResult(
                context_data="Backup timed out after 2 minutes",
                success=False,
                is_error=True
            )
        except Exception as e:
            return SkillResult(
                context_data=f"Backup failed: {str(e)}",
                success=False,
                is_error=True
            )


class GitBackupSkill(SyncSkill):
    """Push to GitHub and create backup branch."""

    name = "git_backup"
    description = "Push changes to GitHub and create a backup branch"
    trigger_intents = ["git_backup", "github_backup", "push_backup"]
    approval_category = ApprovalCategory.STANDARD

    def execute_sync(self, params: dict) -> SkillResult:
        script_path = Path("/var/www/zaylegend/scripts/github-backup.sh")

        if not script_path.exists():
            return SkillResult(
                context_data=f"GitHub backup script not found at {script_path}",
                success=False,
                is_error=True
            )

        try:
            result = subprocess.run(
                [str(script_path)],
                cwd="/var/www/zaylegend",
                capture_output=True,
                text=True,
                timeout=120
            )

            output = result.stdout
            if result.stderr:
                output += f"\n\nStderr:\n{result.stderr}"

            return SkillResult(
                context_data=output if output else "GitHub backup completed",
                success=result.returncode == 0,
                is_error=result.returncode != 0
            )

        except Exception as e:
            return SkillResult(
                context_data=f"GitHub backup failed: {str(e)}",
                success=False,
                is_error=True
            )
