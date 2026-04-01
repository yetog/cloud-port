"""
Memory Manager - Unified interface for Portfolio Brain memory system.
Coordinates Redis (hot) and Qdrant (cold) memory tiers.
"""

import time
from typing import Optional, Any
from dataclasses import dataclass
from .redis_client import RedisClient, ConversationTurn
from .qdrant_client import QdrantClient, MemoryEntry


@dataclass
class MemoryContext:
    """Combined context from all memory tiers."""
    hot_history: list[ConversationTurn]
    cold_memories: list[MemoryEntry]
    session_state: dict

    def to_prompt_context(self, max_chars: int = 3000) -> str:
        """Convert memory context to a string for LLM prompts."""
        parts = []
        char_count = 0

        # Add relevant cold memories first (semantic matches)
        if self.cold_memories:
            parts.append("## Relevant Past Context")
            for mem in self.cold_memories[:3]:
                if char_count + len(mem.content) < max_chars:
                    parts.append(f"- {mem.content[:500]}")
                    char_count += len(mem.content[:500])

        # Add recent conversation history
        if self.hot_history:
            parts.append("\n## Recent Conversation")
            for turn in self.hot_history[-10:]:
                line = f"{turn.role}: {turn.content[:300]}"
                if char_count + len(line) < max_chars:
                    parts.append(line)
                    char_count += len(line)

        return "\n".join(parts)


class MemoryManager:
    """
    Unified memory manager for Portfolio Brain.

    Architecture:
    - Hot tier (Redis): Fast conversation history, 4hr TTL
    - Cold tier (Qdrant): Vector search for semantic memory

    Features:
    - Automatic tier management
    - Graceful degradation if services unavailable
    - High-signal filtering for cold storage
    """

    def __init__(
        self,
        redis_host: str = "localhost",
        redis_port: int = 6379,
        qdrant_host: str = "localhost",
        qdrant_port: int = 6333,
        auto_store_threshold: int = 200,  # Min chars to auto-store in cold
    ):
        self.redis = RedisClient(host=redis_host, port=redis_port)
        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.auto_store_threshold = auto_store_threshold

    # ============ STATUS ============

    def get_status(self) -> dict:
        """Get status of all memory tiers."""
        return {
            "redis": self.redis.get_stats(),
            "qdrant": self.qdrant.get_stats(),
        }

    def is_available(self) -> dict:
        """Check which memory tiers are available."""
        return {
            "redis": self.redis.is_available(),
            "qdrant": self.qdrant.is_available(),
            "any": self.redis.is_available() or self.qdrant.is_available(),
        }

    # ============ CONVERSATION MANAGEMENT ============

    def add_turn(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: dict = None,
        store_in_cold: bool = None,
    ) -> dict:
        """
        Add a conversation turn to memory.

        Args:
            session_id: Session identifier
            role: "user" or "assistant"
            content: Message content
            metadata: Optional metadata
            store_in_cold: Force store in cold tier (default: auto based on length)

        Returns:
            Dict with storage results for each tier
        """
        results = {
            "hot": False,
            "cold": None,
        }

        # Store in hot tier (Redis)
        results["hot"] = self.redis.add_message(
            session_id=session_id,
            role=role,
            content=content,
            metadata=metadata,
        )

        # Determine if we should store in cold tier
        should_store_cold = store_in_cold
        if should_store_cold is None:
            should_store_cold = len(content) >= self.auto_store_threshold

        # Store in cold tier (Qdrant) if high-signal
        if should_store_cold:
            memory_id = self.qdrant.store(
                content=content,
                session_id=session_id,
                metadata={
                    "role": role,
                    **(metadata or {}),
                },
            )
            results["cold"] = memory_id

        return results

    def get_history(self, session_id: str) -> list[ConversationTurn]:
        """Get conversation history from hot tier."""
        return self.redis.get_history(session_id)

    def clear_session(self, session_id: str) -> dict:
        """Clear all memory for a session."""
        return {
            "hot": self.redis.clear_history(session_id),
            "cold": self.qdrant.clear_session(session_id),
        }

    # ============ CONTEXT RETRIEVAL ============

    def get_context(
        self,
        session_id: str,
        query: Optional[str] = None,
        include_cold: bool = True,
    ) -> MemoryContext:
        """
        Get combined memory context for a session.

        Args:
            session_id: Session identifier
            query: Optional query for semantic search in cold tier
            include_cold: Whether to include cold tier results

        Returns:
            MemoryContext with hot history and relevant cold memories
        """
        # Get hot history
        hot_history = self.redis.get_history(session_id)

        # Get cold memories if requested
        cold_memories = []
        if include_cold and query:
            cold_memories = self.qdrant.search(
                query=query,
                limit=5,
                session_id=session_id,
            )

        # Get session state
        session_state = self.redis.get_session_state(session_id)

        return MemoryContext(
            hot_history=hot_history,
            cold_memories=cold_memories,
            session_state=session_state,
        )

    def search_memories(
        self,
        query: str,
        session_id: Optional[str] = None,
        limit: int = 5,
    ) -> list[MemoryEntry]:
        """Search cold tier for relevant memories."""
        return self.qdrant.search(
            query=query,
            limit=limit,
            session_id=session_id,
        )

    # ============ CACHE OPERATIONS ============

    def cache_get(self, key: str) -> Optional[Any]:
        """Get a cached value from hot tier."""
        return self.redis.cache_get(key)

    def cache_set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set a cached value in hot tier."""
        return self.redis.cache_set(key, value, ttl)

    # ============ SESSION STATE ============

    def get_session_state(self, session_id: str) -> dict:
        """Get session state from hot tier."""
        return self.redis.get_session_state(session_id)

    def update_session_state(self, session_id: str, updates: dict) -> bool:
        """Update session state in hot tier."""
        return self.redis.update_session_state(session_id, updates)


# Global instance
_memory_manager: Optional[MemoryManager] = None


def get_memory_manager() -> MemoryManager:
    """Get or create the global memory manager instance."""
    global _memory_manager
    if _memory_manager is None:
        _memory_manager = MemoryManager()
    return _memory_manager


def reset_memory_manager() -> None:
    """Reset the global memory manager (useful for testing)."""
    global _memory_manager
    _memory_manager = None
