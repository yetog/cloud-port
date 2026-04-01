"""
Base skill framework for Portfolio Brain.
Inspired by Sentinel's skills architecture.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Optional
import time


class ApprovalCategory(Enum):
    """Approval levels for skill operations."""
    NONE = "none"           # Read operations - no approval needed
    STANDARD = "standard"   # Normal writes - may need approval
    CRITICAL = "critical"   # Significant changes - needs approval
    BREAKING = "breaking"   # Irreversible operations - always confirm


@dataclass
class SkillResult:
    """Result returned by skill execution."""
    context_data: str = ""              # Output/response text
    success: bool = True                # Whether operation succeeded
    is_error: bool = False              # Whether an error occurred
    skill_name: str = ""                # Name of skill that ran
    execution_time_ms: float = 0.0      # How long execution took
    metadata: dict = field(default_factory=dict)  # Additional data


class BaseSkill(ABC):
    """
    Abstract base class for all skills.

    Skills are modular action handlers that can be:
    - Executed via CLI (brain skill run <name>)
    - Executed via API (POST /api/skills/<name>/execute)
    - Discovered dynamically at runtime

    Example usage:
        class MySkill(BaseSkill):
            name = "my_skill"
            description = "Does something useful"
            trigger_intents = ["do_something", "my_action"]

            async def execute(self, params: dict) -> SkillResult:
                # Do the work
                return SkillResult(
                    context_data="Done!",
                    success=True,
                    skill_name=self.name
                )
    """

    # Skill metadata
    name: str = "base"
    description: str = "Base skill - override this"
    trigger_intents: list[str] = []

    # Approval settings
    approval_category: ApprovalCategory = ApprovalCategory.NONE
    requires_confirmation: bool = False

    # Configuration
    config_vars: list[str] = []  # Required environment variables

    def is_available(self) -> bool:
        """
        Check if skill is available/configured.
        Override to check for required credentials, services, etc.
        """
        import os
        if self.config_vars:
            return all(os.getenv(var) for var in self.config_vars)
        return True

    def get_params_schema(self) -> dict:
        """
        Return JSON schema for skill parameters.
        Override to define expected parameters.
        """
        return {
            "type": "object",
            "properties": {},
            "required": []
        }

    @abstractmethod
    async def execute(self, params: dict) -> SkillResult:
        """
        Execute the skill with given parameters.

        Args:
            params: Dictionary of parameters for the skill

        Returns:
            SkillResult with output and status
        """
        pass

    async def run(self, params: dict) -> SkillResult:
        """
        Wrapper that handles timing and error catching.
        Calls execute() internally.
        """
        start = time.time()
        try:
            result = await self.execute(params)
            result.execution_time_ms = (time.time() - start) * 1000
            result.skill_name = self.name
            return result
        except Exception as e:
            return SkillResult(
                context_data=f"Error executing {self.name}: {str(e)}",
                success=False,
                is_error=True,
                skill_name=self.name,
                execution_time_ms=(time.time() - start) * 1000
            )

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name='{self.name}'>"


class SyncSkill(BaseSkill):
    """
    Base class for synchronous skills.
    Wraps sync execute_sync() in async execute().
    """

    @abstractmethod
    def execute_sync(self, params: dict) -> SkillResult:
        """Synchronous execution - override this."""
        pass

    async def execute(self, params: dict) -> SkillResult:
        """Async wrapper for sync execution."""
        return self.execute_sync(params)
