"""
ElevenLabs API Proxy Routes
Keeps API key server-side, never exposed to frontend
"""

import os
from pathlib import Path
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Load .env file if present (before reading ELEVENLABS_API_KEY)
_env_file = Path(__file__).parent.parent / ".env"
if _env_file.exists():
    with open(_env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                if value and key not in os.environ:
                    os.environ[key] = value

router = APIRouter()

# API key loaded from environment variable (never exposed to frontend)
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")


class SoundGenerationRequest(BaseModel):
    text: str
    duration_seconds: float = 10.0
    prompt_influence: float = 0.3


@router.post("/generate-sound")
async def generate_sound(request: SoundGenerationRequest):
    """
    Proxy to ElevenLabs Sound Generation API.
    API key stays server-side.
    """
    if not ELEVENLABS_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ElevenLabs API key not configured on server"
        )

    url = "https://api.elevenlabs.io/v1/sound-generation"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": request.text,
        "duration_seconds": request.duration_seconds,
        "prompt_influence": request.prompt_influence,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=payload)

            if response.status_code == 401:
                raise HTTPException(status_code=401, detail="Invalid API key")
            elif response.status_code == 429:
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            elif response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"ElevenLabs API error: {response.text[:200]}"
                )

            # Return audio as binary
            return {
                "audio": response.content.hex(),  # Hex-encoded for JSON transport
                "content_type": response.headers.get("content-type", "audio/mpeg"),
            }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to ElevenLabs timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach ElevenLabs: {str(e)}")


@router.get("/status")
async def check_status():
    """Check if ElevenLabs API key is configured."""
    return {
        "configured": bool(ELEVENLABS_API_KEY),
        "key_preview": f"{ELEVENLABS_API_KEY[:8]}..." if ELEVENLABS_API_KEY else None,
    }
