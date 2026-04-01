"""
Qdrant Client - Cold memory tier for Portfolio Brain.
Handles vector storage and semantic search for long-term memory.
"""

import time
import hashlib
from typing import Optional, Any
from dataclasses import dataclass, field


@dataclass
class MemoryEntry:
    """A memory entry for vector storage."""
    id: str
    content: str
    metadata: dict = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    score: float = 0.0  # Relevance score from search

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content": self.content,
            "metadata": self.metadata,
            "timestamp": self.timestamp,
            "score": self.score,
        }


class QdrantClient:
    """
    Qdrant client for vector memory storage.

    Features:
    - Semantic search across conversation history
    - High-signal memory storage (important interactions)
    - Local embeddings via Ollama (primary)
    - OpenAI embeddings as fallback
    - Graceful degradation if Qdrant/embeddings unavailable
    """

    COLLECTION_NAME = "brain_memories"
    VECTOR_SIZE_OLLAMA = 768   # nomic-embed-text
    VECTOR_SIZE_OPENAI = 1536  # text-embedding-3-small

    def __init__(
        self,
        host: str = "localhost",
        port: int = 6333,
        ollama_host: str = "localhost",
        ollama_port: int = 11434,
        ollama_model: str = "nomic-embed-text",
        min_content_length: int = 100,  # Min chars to store
        similarity_threshold: float = 0.75,
    ):
        self.host = host
        self.port = port
        self.ollama_host = ollama_host
        self.ollama_port = ollama_port
        self.ollama_model = ollama_model
        self.min_content_length = min_content_length
        self.similarity_threshold = similarity_threshold
        self._client = None
        self._available = None
        self._embeddings_available = None
        self._embedding_source = None  # "ollama" or "openai"
        self._vector_size = self.VECTOR_SIZE_OLLAMA  # Default to Ollama size

    def _get_client(self):
        """Lazy initialization of Qdrant client."""
        if self._client is None:
            try:
                from qdrant_client import QdrantClient as QC
                from qdrant_client.http import models

                self._client = QC(host=self.host, port=self.port, timeout=5)

                # Determine vector size based on available embedding source
                self._detect_embedding_source()

                # Ensure collection exists with correct vector size
                collections = self._client.get_collections().collections
                collection_names = [c.name for c in collections]

                if self.COLLECTION_NAME not in collection_names:
                    self._client.create_collection(
                        collection_name=self.COLLECTION_NAME,
                        vectors_config=models.VectorParams(
                            size=self._vector_size,
                            distance=models.Distance.COSINE,
                        ),
                    )

                self._available = True
            except Exception as e:
                self._available = False
                self._client = None

        return self._client

    def _detect_embedding_source(self):
        """Detect which embedding source is available."""
        # Try Ollama first (local, free)
        if self._check_ollama():
            self._embedding_source = "ollama"
            self._vector_size = self.VECTOR_SIZE_OLLAMA
            self._embeddings_available = True
            return

        # Fall back to OpenAI
        import os
        if os.getenv("OPENAI_API_KEY"):
            self._embedding_source = "openai"
            self._vector_size = self.VECTOR_SIZE_OPENAI
            self._embeddings_available = True
            return

        self._embeddings_available = False

    def _check_ollama(self) -> bool:
        """Check if Ollama is available."""
        try:
            import urllib.request
            import json
            url = f"http://{self.ollama_host}:{self.ollama_port}/api/tags"
            req = urllib.request.Request(url, method='GET')
            with urllib.request.urlopen(req, timeout=2) as resp:
                data = json.loads(resp.read())
                models = [m.get("name", "").split(":")[0] for m in data.get("models", [])]
                return self.ollama_model in models or f"{self.ollama_model}:latest" in [m.get("name", "") for m in data.get("models", [])]
        except Exception:
            return False

    def is_available(self) -> bool:
        """Check if Qdrant is available."""
        if self._available is None:
            self._get_client()
        return self._available or False

    def _get_embedding(self, text: str) -> Optional[list[float]]:
        """Get embedding vector for text using Ollama (primary) or OpenAI (fallback)."""
        if self._embeddings_available is False:
            return None

        # Detect source if not already done
        if self._embedding_source is None:
            self._detect_embedding_source()

        if self._embedding_source == "ollama":
            return self._get_ollama_embedding(text)
        elif self._embedding_source == "openai":
            return self._get_openai_embedding(text)

        return None

    def _get_ollama_embedding(self, text: str) -> Optional[list[float]]:
        """Get embedding from Ollama."""
        try:
            import urllib.request
            import json

            url = f"http://{self.ollama_host}:{self.ollama_port}/api/embeddings"
            data = json.dumps({
                "model": self.ollama_model,
                "prompt": text[:8000]
            }).encode('utf-8')

            req = urllib.request.Request(url, data=data, method='POST')
            req.add_header('Content-Type', 'application/json')

            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
                return result.get("embedding")

        except Exception:
            # Try falling back to OpenAI
            self._embedding_source = "openai"
            return self._get_openai_embedding(text)

    def _get_openai_embedding(self, text: str) -> Optional[list[float]]:
        """Get embedding from OpenAI."""
        try:
            import os
            from openai import OpenAI

            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                self._embeddings_available = False
                return None

            client = OpenAI(api_key=api_key)
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=text[:8000],
            )
            return response.data[0].embedding

        except Exception:
            self._embeddings_available = False
            return None

    def _generate_id(self, content: str, session_id: str = "") -> str:
        """Generate a unique ID for a memory entry."""
        data = f"{session_id}:{content}:{time.time()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]

    # ============ MEMORY OPERATIONS ============

    def store(
        self,
        content: str,
        session_id: str = "default",
        metadata: dict = None,
    ) -> Optional[str]:
        """
        Store a memory entry with vector embedding.

        Only stores if:
        - Content is long enough (high-signal)
        - Qdrant is available
        - Embeddings are available
        """
        # Check minimum content length
        if len(content) < self.min_content_length:
            return None

        client = self._get_client()
        if not client:
            return None

        # Get embedding
        embedding = self._get_embedding(content)
        if not embedding:
            return None

        try:
            from qdrant_client.http import models

            # Generate ID
            memory_id = self._generate_id(content, session_id)

            # Prepare payload
            payload = {
                "content": content,
                "session_id": session_id,
                "timestamp": time.time(),
                **(metadata or {}),
            }

            # Upsert point
            client.upsert(
                collection_name=self.COLLECTION_NAME,
                points=[
                    models.PointStruct(
                        id=memory_id,
                        vector=embedding,
                        payload=payload,
                    )
                ],
            )

            return memory_id

        except Exception:
            return None

    def search(
        self,
        query: str,
        limit: int = 5,
        session_id: Optional[str] = None,
    ) -> list[MemoryEntry]:
        """
        Search for relevant memories using semantic similarity.
        """
        client = self._get_client()
        if not client:
            return []

        # Get query embedding
        embedding = self._get_embedding(query)
        if not embedding:
            return []

        try:
            from qdrant_client.http import models

            # Build filter if session_id provided
            query_filter = None
            if session_id:
                query_filter = models.Filter(
                    must=[
                        models.FieldCondition(
                            key="session_id",
                            match=models.MatchValue(value=session_id),
                        )
                    ]
                )

            # Search
            results = client.search(
                collection_name=self.COLLECTION_NAME,
                query_vector=embedding,
                query_filter=query_filter,
                limit=limit,
                score_threshold=self.similarity_threshold,
            )

            # Convert to MemoryEntry objects
            memories = []
            for result in results:
                payload = result.payload or {}
                memories.append(
                    MemoryEntry(
                        id=str(result.id),
                        content=payload.get("content", ""),
                        metadata={k: v for k, v in payload.items() if k not in ["content", "timestamp"]},
                        timestamp=payload.get("timestamp", 0),
                        score=result.score,
                    )
                )

            return memories

        except Exception:
            return []

    def delete(self, memory_id: str) -> bool:
        """Delete a memory entry."""
        client = self._get_client()
        if not client:
            return False

        try:
            from qdrant_client.http import models

            client.delete(
                collection_name=self.COLLECTION_NAME,
                points_selector=models.PointIdsList(
                    points=[memory_id],
                ),
            )
            return True
        except Exception:
            return False

    def clear_session(self, session_id: str) -> bool:
        """Clear all memories for a session."""
        client = self._get_client()
        if not client:
            return False

        try:
            from qdrant_client.http import models

            client.delete(
                collection_name=self.COLLECTION_NAME,
                points_selector=models.FilterSelector(
                    filter=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="session_id",
                                match=models.MatchValue(value=session_id),
                            )
                        ]
                    )
                ),
            )
            return True
        except Exception:
            return False

    # ============ STATS ============

    def get_stats(self) -> dict:
        """Get Qdrant collection stats."""
        client = self._get_client()
        if not client:
            return {
                "available": False,
                "host": self.host,
                "port": self.port,
                "embeddings_available": self._embeddings_available or False,
            }

        try:
            collection_info = client.get_collection(self.COLLECTION_NAME)

            # Handle different Qdrant client versions
            vectors_count = getattr(collection_info, 'vectors_count', None)
            if vectors_count is None:
                vectors_count = getattr(collection_info, 'points_count', 0)

            points_count = getattr(collection_info, 'points_count', vectors_count)

            return {
                "available": True,
                "host": self.host,
                "port": self.port,
                "collection": self.COLLECTION_NAME,
                "vectors_count": vectors_count or 0,
                "points_count": points_count or 0,
                "embeddings_available": self._embeddings_available or False,
                "embedding_source": self._embedding_source or "none",
                "vector_size": self._vector_size,
            }
        except Exception as e:
            return {
                "available": False,
                "host": self.host,
                "port": self.port,
                "error": str(e),
                "embeddings_available": self._embeddings_available or False,
            }
