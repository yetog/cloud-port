"""
Memory API Routes
"""

import sys
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

# Add portfolio dir to path
PORTFOLIO_DIR = "/var/www/zaylegend"
if PORTFOLIO_DIR not in sys.path:
    sys.path.insert(0, PORTFOLIO_DIR)

router = APIRouter()


class MemoryStoreRequest(BaseModel):
    content: str
    session_id: str = "default"
    metadata: dict = {}


class MemorySearchRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    limit: int = 5


@router.get("/status")
async def get_memory_status():
    """Get memory system status."""
    try:
        from memory import get_memory_manager
        mm = get_memory_manager()
        return mm.get_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_session_history(session_id: str, limit: int = 20):
    """Get conversation history for a session."""
    try:
        from memory import get_memory_manager
        mm = get_memory_manager()

        history = mm.get_history(session_id)
        # Limit and convert to dicts
        history = history[-limit:] if limit else history

        return {
            "session_id": session_id,
            "count": len(history),
            "messages": [
                {
                    "role": turn.role,
                    "content": turn.content,
                    "timestamp": turn.timestamp,
                }
                for turn in history
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/store")
async def store_memory(request: MemoryStoreRequest):
    """Store content in memory (both hot and cold tiers)."""
    try:
        from memory import get_memory_manager
        mm = get_memory_manager()

        result = mm.add_turn(
            session_id=request.session_id,
            role="user",
            content=request.content,
            metadata=request.metadata,
            store_in_cold=True,  # Force store in vector DB
        )

        return {
            "stored": True,
            "session_id": request.session_id,
            "hot_stored": result["hot"],
            "cold_stored": result["cold"] is not None,
            "cold_id": result["cold"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search")
async def search_memories(request: MemorySearchRequest):
    """Search memories using semantic similarity."""
    try:
        from memory import get_memory_manager
        mm = get_memory_manager()

        memories = mm.search_memories(
            query=request.query,
            session_id=request.session_id,
            limit=request.limit,
        )

        return {
            "query": request.query,
            "count": len(memories),
            "results": [
                {
                    "id": mem.id,
                    "content": mem.content,
                    "score": mem.score,
                    "timestamp": mem.timestamp,
                    "metadata": mem.metadata,
                }
                for mem in memories
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{session_id}")
async def clear_session_memory(session_id: str):
    """Clear all memory for a session."""
    try:
        from memory import get_memory_manager
        mm = get_memory_manager()

        result = mm.clear_session(session_id)

        return {
            "session_id": session_id,
            "cleared": True,
            "hot_cleared": result["hot"],
            "cold_cleared": result["cold"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
