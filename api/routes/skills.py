"""
Skills API Routes
"""

import sys
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Any

# Add portfolio dir to path
PORTFOLIO_DIR = "/var/www/zaylegend"
if PORTFOLIO_DIR not in sys.path:
    sys.path.insert(0, PORTFOLIO_DIR)

router = APIRouter()


class SkillExecuteRequest(BaseModel):
    params: dict = {}


@router.get("")
async def list_skills():
    """List all available skills."""
    try:
        from skills import get_registry
        registry = get_registry()

        skills = []
        for skill in registry.list_all():
            skills.append({
                "name": skill.name,
                "description": skill.description,
                "available": skill.is_available(),
                "intents": skill.trigger_intents,
                "approval_category": skill.approval_category.value,
            })

        return {
            "total": len(skills),
            "available": len([s for s in skills if s["available"]]),
            "skills": skills,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{skill_name}")
async def get_skill_info(skill_name: str):
    """Get detailed information about a skill."""
    try:
        from skills import get_registry
        registry = get_registry()

        skill = registry.get(skill_name)
        if not skill:
            raise HTTPException(status_code=404, detail=f"Skill '{skill_name}' not found")

        return {
            "name": skill.name,
            "description": skill.description,
            "available": skill.is_available(),
            "intents": skill.trigger_intents,
            "approval_category": skill.approval_category.value,
            "requires_confirmation": skill.requires_confirmation,
            "config_vars": skill.config_vars,
            "params_schema": skill.get_params_schema(),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{skill_name}/execute")
async def execute_skill(skill_name: str, request: SkillExecuteRequest):
    """Execute a skill with given parameters."""
    try:
        from skills import get_registry
        registry = get_registry()

        skill = registry.get(skill_name)
        if not skill:
            raise HTTPException(status_code=404, detail=f"Skill '{skill_name}' not found")

        if not skill.is_available():
            raise HTTPException(
                status_code=503,
                detail=f"Skill '{skill_name}' is not available. Missing config: {skill.config_vars}"
            )

        # Execute the skill
        result = await skill.run(request.params)

        return {
            "skill": skill_name,
            "success": result.success,
            "output": result.context_data,
            "execution_time_ms": result.execution_time_ms,
            "metadata": result.metadata,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
