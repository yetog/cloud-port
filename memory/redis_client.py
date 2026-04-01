"""
Redis Client - Hot memory tier for Portfolio Brain.
Handles conversation history, session state, and fast key-value storage.
"""

import json
import time
from typing import Optional, Any
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ConversationTurn:
    """A single turn in a conversation."""
    role: str  # "user" or "assistant"
    content: str
    timestamp: float = field(default_factory=time.time)
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp,
            "metadata": self.metadata
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ConversationTurn":
        return cls(
            role=data["role"],
            content=data["content"],
            timestamp=data.get("timestamp", time.time()),
            metadata=data.get("metadata", {})
        )


class RedisClient:
    """
    Redis client for hot memory storage.

    Features:
    - Conversation history with TTL (4 hours default)
    - Session state management
    - Key-value cache for frequently accessed data
    - Graceful degradation if Redis unavailable
    """

    def __init__(
        self,
        host: str = "localhost",
        port: int = 6379,
        db: int = 0,
        password: Optional[str] = None,
        default_ttl: int = 14400,  # 4 hours
        max_history: int = 40,     # Max messages per session
    ):
        self.host = host
        self.port = port
        self.db = db
        self.password = password
        self.default_ttl = default_ttl
        self.max_history = max_history
        self._client = None
        self._available = None

    def _get_client(self):
        """Lazy initialization of Redis client."""
        if self._client is None:
            try:
                import redis
                self._client = redis.Redis(
                    host=self.host,
                    port=self.port,
                    db=self.db,
                    password=self.password,
                    decode_responses=True,
                    socket_timeout=2,
                    socket_connect_timeout=2,
                )
                # Test connection
                self._client.ping()
                self._available = True
            except Exception as e:
                self._available = False
                self._client = None
        return self._client

    def is_available(self) -> bool:
        """Check if Redis is available."""
        if self._available is None:
            self._get_client()
        return self._available or False

    def _session_key(self, session_id: str) -> str:
        """Generate key for session conversation history."""
        return f"brain:session:{session_id}"

    def _cache_key(self, key: str) -> str:
        """Generate key for cache entries."""
        return f"brain:cache:{key}"

    # ============ CONVERSATION HISTORY ============

    def get_history(self, session_id: str) -> list[ConversationTurn]:
        """Get conversation history for a session."""
        client = self._get_client()
        if not client:
            return []

        try:
            key = self._session_key(session_id)
            data = client.get(key)
            if not data:
                return []

            turns_data = json.loads(data)
            return [ConversationTurn.from_dict(t) for t in turns_data]
        except Exception:
            return []

    def add_turn(self, session_id: str, turn: ConversationTurn) -> bool:
        """Add a conversation turn to history."""
        client = self._get_client()
        if not client:
            return False

        try:
            key = self._session_key(session_id)

            # Get existing history
            history = self.get_history(session_id)
            history.append(turn)

            # Trim to max history
            if len(history) > self.max_history:
                history = history[-self.max_history:]

            # Save back
            data = json.dumps([t.to_dict() for t in history])
            client.setex(key, self.default_ttl, data)
            return True
        except Exception:
            return False

    def add_message(self, session_id: str, role: str, content: str, metadata: dict = None) -> bool:
        """Convenience method to add a message."""
        turn = ConversationTurn(
            role=role,
            content=content,
            metadata=metadata or {}
        )
        return self.add_turn(session_id, turn)

    def clear_history(self, session_id: str) -> bool:
        """Clear conversation history for a session."""
        client = self._get_client()
        if not client:
            return False

        try:
            key = self._session_key(session_id)
            client.delete(key)
            return True
        except Exception:
            return False

    def get_history_summary(self, session_id: str, max_chars: int = 2000) -> str:
        """Get a text summary of recent history."""
        history = self.get_history(session_id)
        if not history:
            return ""

        lines = []
        total_chars = 0

        for turn in reversed(history):
            line = f"{turn.role}: {turn.content[:200]}"
            if total_chars + len(line) > max_chars:
                break
            lines.insert(0, line)
            total_chars += len(line)

        return "\n".join(lines)

    # ============ CACHE OPERATIONS ============

    def cache_get(self, key: str) -> Optional[Any]:
        """Get a cached value."""
        client = self._get_client()
        if not client:
            return None

        try:
            cache_key = self._cache_key(key)
            data = client.get(cache_key)
            if data:
                return json.loads(data)
            return None
        except Exception:
            return None

    def cache_set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set a cached value."""
        client = self._get_client()
        if not client:
            return False

        try:
            cache_key = self._cache_key(key)
            data = json.dumps(value)
            if ttl:
                client.setex(cache_key, ttl, data)
            else:
                client.setex(cache_key, self.default_ttl, data)
            return True
        except Exception:
            return False

    def cache_delete(self, key: str) -> bool:
        """Delete a cached value."""
        client = self._get_client()
        if not client:
            return False

        try:
            cache_key = self._cache_key(key)
            client.delete(cache_key)
            return True
        except Exception:
            return False

    # ============ SESSION STATE ============

    def get_session_state(self, session_id: str) -> dict:
        """Get session state metadata."""
        return self.cache_get(f"state:{session_id}") or {}

    def set_session_state(self, session_id: str, state: dict) -> bool:
        """Set session state metadata."""
        return self.cache_set(f"state:{session_id}", state)

    def update_session_state(self, session_id: str, updates: dict) -> bool:
        """Update session state with new values."""
        state = self.get_session_state(session_id)
        state.update(updates)
        return self.set_session_state(session_id, state)

    # ============ STATS ============

    def get_stats(self) -> dict:
        """Get Redis connection stats."""
        client = self._get_client()
        if not client:
            return {
                "available": False,
                "host": self.host,
                "port": self.port,
            }

        try:
            info = client.info("memory")
            keys = client.dbsize()

            return {
                "available": True,
                "host": self.host,
                "port": self.port,
                "used_memory": info.get("used_memory_human", "unknown"),
                "total_keys": keys,
                "max_memory": info.get("maxmemory_human", "unlimited"),
            }
        except Exception as e:
            return {
                "available": False,
                "host": self.host,
                "port": self.port,
                "error": str(e),
            }
