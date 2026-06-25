"""
ElevenLabs API Proxy Routes
Keeps API key server-side, never exposed to frontend
"""

import os
from pathlib import Path
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

_env_file = Path(__file__).parent.parent / ".env"


def get_api_key() -> str:
    """Read API key fresh from .env file each time."""
    if _env_file.exists():
        with open(_env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    if key == "ELEVENLABS_API_KEY" and value:
                        return value
    return os.getenv("ELEVENLABS_API_KEY", "")


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
    api_key = get_api_key()

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ElevenLabs API key not configured on server"
        )

    url = "https://api.elevenlabs.io/v1/sound-generation"
    headers = {
        "xi-api-key": api_key,
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
    api_key = get_api_key()
    return {
        "configured": bool(api_key),
        "key_preview": f"{api_key[:8]}..." if api_key else None,
    }
