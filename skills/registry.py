"""
Skill Registry for Portfolio Brain.
Handles skill registration, discovery, and lookup.
"""

import importlib
import pkgutil
from pathlib import Path
from typing import Optional
from .base import BaseSkill, SkillResult


class SkillRegistry:
    """
    Registry for managing skills.

    Features:
    - Intent-based lookup (trigger_intents → skill)
    - Name-based lookup (skill name → skill)
    - Dynamic discovery of skill modules
    - List all available skills
    """

    def __init__(self):
        self._skills_by_name: dict[str, BaseSkill] = {}
        self._skills_by_intent: dict[str, BaseSkill] = {}
        self._all_skills: list[BaseSkill] = []

    def register(self, skill: BaseSkill) -> None:
        """
        Register a skill instance.

        Args:
            skill: Skill instance to register
        """
        # Register by name
        self._skills_by_name[skill.name] = skill
        self._all_skills.append(skill)

        # Register by intents
        for intent in skill.trigger_intents:
            self._skills_by_intent[intent] = skill

    def get_by_name(self, name: str) -> Optional[BaseSkill]:
        """Get skill by name."""
        return self._skills_by_name.get(name)

    def get_by_intent(self, intent: str) -> Optional[BaseSkill]:
        """Get skill by trigger intent."""
        return self._skills_by_intent.get(intent)

    def get(self, name_or_intent: str) -> Optional[BaseSkill]:
        """Get skill by name or intent (name takes priority)."""
        return self.get_by_name(name_or_intent) or self.get_by_intent(name_or_intent)

    def list_all(self) -> list[BaseSkill]:
        """Return all registered skills."""
        return self._all_skills.copy()

    def list_available(self) -> list[BaseSkill]:
        """Return only configured/available skills."""
        return [s for s in self._all_skills if s.is_available()]

    def list_names(self) -> list[str]:
        """Return list of all skill names."""
        return list(self._skills_by_name.keys())

    def list_intents(self) -> list[str]:
        """Return list of all registered intents."""
        return list(self._skills_by_intent.keys())

    def get_descriptions(self) -> str:
        """
        Return formatted string of all skill descriptions.
        Useful for intent classification prompts.
        """
        lines = []
        for skill in self._all_skills:
            intents = ", ".join(skill.trigger_intents) if skill.trigger_intents else "none"
            available = "available" if skill.is_available() else "not configured"
            lines.append(f"- {skill.name}: {skill.description} (intents: {intents}) [{available}]")
        return "\n".join(lines)

    def __len__(self) -> int:
        return len(self._all_skills)

    def __contains__(self, name: str) -> bool:
        return name in self._skills_by_name or name in self._skills_by_intent


# Global registry instance
_registry: Optional[SkillRegistry] = None


def get_registry() -> SkillRegistry:
    """
    Get or create the global skill registry.
    Auto-discovers and registers all skills on first call.
    """
    global _registry
    if _registry is None:
        _registry = SkillRegistry()
        _auto_discover_skills(_registry)
    return _registry


def _auto_discover_skills(registry: SkillRegistry) -> None:
    """
    Auto-discover and register all skill modules.
    Scans the skills/ directory for *_skill.py files.
    """
    skills_dir = Path(__file__).parent

    # Find all *_skill.py modules
    for module_info in pkgutil.iter_modules([str(skills_dir)]):
        if module_info.name.endswith('_skill'):
            try:
                # Import the module
                module = importlib.import_module(f".{module_info.name}", package="skills")

                # Find BaseSkill subclasses in the module
                for attr_name in dir(module):
                    attr = getattr(module, attr_name)
                    if (isinstance(attr, type) and
                        issubclass(attr, BaseSkill) and
                        attr is not BaseSkill and
                        hasattr(attr, 'name') and
                        attr.name != "base"):
                        # Instantiate and register
                        try:
                            skill_instance = attr()
                            registry.register(skill_instance)
                        except Exception as e:
                            print(f"Warning: Could not instantiate {attr_name}: {e}")

            except Exception as e:
                print(f"Warning: Could not import {module_info.name}: {e}")


def reset_registry() -> None:
    """Reset the global registry (useful for testing)."""
    global _registry
    _registry = None
