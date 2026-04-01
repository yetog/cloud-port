"""
Git Skills - Git repository operations.
"""

import subprocess
from pathlib import Path
from .base import SyncSkill, SkillResult, ApprovalCategory


REPO_PATH = Path("/var/www/zaylegend")


def run_git(*args, timeout: int = 30) -> tuple[str, str, int]:
    """Run a git command and return stdout, stderr, returncode."""
    result = subprocess.run(
        ["git"] + list(args),
        cwd=str(REPO_PATH),
        capture_output=True,
        text=True,
        timeout=timeout
    )
    return result.stdout.strip(), result.stderr.strip(), result.returncode


class GitStatusSkill(SyncSkill):
    """Get git repository status."""

    name = "git_status"
    description = "Show git status including branch, changes, and remote status"
    trigger_intents = ["git_status", "repo_status", "changes"]
    approval_category = ApprovalCategory.NONE

    def execute_sync(self, params: dict) -> SkillResult:
        try:
            lines = []

            # Branch info
            stdout, _, _ = run_git("branch", "--show-current")
            lines.append(f"Branch: {stdout}")

            # Remote tracking
            stdout, _, _ = run_git("rev-parse", "--abbrev-ref", "@{u}")
            if stdout:
                lines.append(f"Tracking: {stdout}")

            # Ahead/behind
            stdout, _, _ = run_git("status", "-sb")
            if stdout:
                first_line = stdout.split('\n')[0]
                if '[' in first_line:
                    tracking_info = first_line[first_line.index('['):]
                    lines.append(f"Status: {tracking_info}")

            # Changed files
            stdout, _, _ = run_git("status", "--short")
            if stdout:
                changes = stdout.split('\n')
                lines.append(f"\nChanges ({len(changes)}):")
                for change in changes[:10]:  # Limit to 10
                    lines.append(f"  {change}")
                if len(changes) > 10:
                    lines.append(f"  ... and {len(changes) - 10} more")
            else:
                lines.append("\nNo uncommitted changes")

            return SkillResult(
                context_data="\n".join(lines),
                success=True
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Git status failed: {str(e)}",
                success=False,
                is_error=True
            )


class GitLogSkill(SyncSkill):
    """Show recent git commits."""

    name = "git_log"
    description = "Show recent git commit history"
    trigger_intents = ["git_log", "commits", "history", "recent_commits"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "count": {
                    "type": "integer",
                    "description": "Number of commits to show",
                    "default": 10,
                    "minimum": 1,
                    "maximum": 50
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        count = min(50, max(1, int(params.get("count", 10))))

        try:
            stdout, _, code = run_git(
                "log",
                f"-{count}",
                "--format=%h %ar - %s",
                "--abbrev-commit"
            )

            if code != 0:
                return SkillResult(
                    context_data="Failed to get git log",
                    success=False,
                    is_error=True
                )

            return SkillResult(
                context_data=f"Recent commits:\n{stdout}",
                success=True,
                metadata={"count": len(stdout.split('\n'))}
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Git log failed: {str(e)}",
                success=False,
                is_error=True
            )


class GitPullSkill(SyncSkill):
    """Pull latest changes from remote."""

    name = "git_pull"
    description = "Pull latest changes from the remote repository"
    trigger_intents = ["git_pull", "pull", "fetch_changes", "update_repo"]
    approval_category = ApprovalCategory.STANDARD

    def execute_sync(self, params: dict) -> SkillResult:
        try:
            # Fetch first
            stdout, stderr, code = run_git("fetch", "--all")

            # Then pull
            stdout, stderr, code = run_git("pull", "--ff-only")

            if code == 0:
                return SkillResult(
                    context_data=f"Pull successful:\n{stdout}",
                    success=True
                )
            else:
                return SkillResult(
                    context_data=f"Pull failed:\n{stderr or stdout}",
                    success=False,
                    is_error=True
                )

        except Exception as e:
            return SkillResult(
                context_data=f"Git pull failed: {str(e)}",
                success=False,
                is_error=True
            )


class GitDiffSkill(SyncSkill):
    """Show uncommitted changes."""

    name = "git_diff"
    description = "Show detailed diff of uncommitted changes"
    trigger_intents = ["git_diff", "diff", "show_changes"]
    approval_category = ApprovalCategory.NONE

    def get_params_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "staged": {
                    "type": "boolean",
                    "description": "Show only staged changes",
                    "default": False
                },
                "file": {
                    "type": "string",
                    "description": "Specific file to diff"
                }
            },
            "required": []
        }

    def execute_sync(self, params: dict) -> SkillResult:
        staged = params.get("staged", False)
        file_path = params.get("file")

        try:
            args = ["diff"]
            if staged:
                args.append("--staged")
            if file_path:
                args.append("--")
                args.append(file_path)

            stdout, stderr, code = run_git(*args)

            if not stdout:
                return SkillResult(
                    context_data="No changes to show",
                    success=True
                )

            # Truncate if too long
            if len(stdout) > 5000:
                stdout = stdout[:5000] + "\n\n... (truncated)"

            return SkillResult(
                context_data=stdout,
                success=True
            )

        except Exception as e:
            return SkillResult(
                context_data=f"Git diff failed: {str(e)}",
                success=False,
                is_error=True
            )
