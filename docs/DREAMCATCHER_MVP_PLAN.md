# DreamCatcher MVP Implementation Plan

> AI-Powered Dream Journal with Jungian Analysis and Visualization
> Version: 1.0 | Created: 2026-05-08

---

## Overview

DreamCatcher captures dreams via audio recording, transcribes them, analyzes symbols/archetypes using Jungian psychology, and generates dreamscape visualizations.

**MVP Goal:** Record → Transcribe → Analyze → Generate 1 Image

---

## Phase 1: Foundation (Web-Only MVP)

### 1.1 Web Recording Interface
Skip the hardware for initial validation. Build browser-based recording.

**Tasks:**
- [ ] Create React app with audio recording (MediaRecorder API)
- [ ] Build simple UI: Record button, waveform visualization, stop/save
- [ ] Store audio as WAV/WebM in browser
- [ ] Upload to backend on save

**Tech:**
- React + TypeScript + Vite (matches existing stack)
- Web Audio API for visualization
- IndexedDB for local storage backup

**Files to create:**
```
dreamcatcher-web/
├── src/
│   ├── components/
│   │   ├── Recorder.tsx       # Record button + waveform
│   │   ├── DreamList.tsx      # List of captured dreams
│   │   └── DreamDetail.tsx    # Single dream view
│   ├── hooks/
│   │   └── useAudioRecorder.ts
│   └── App.tsx
├── package.json
└── vite.config.ts
```

---

### 1.2 Transcription Service
Convert audio to text using Whisper.

**Tasks:**
- [ ] Set up FastAPI backend
- [ ] Integrate OpenAI Whisper API (or local whisper.cpp)
- [ ] Create `/api/transcribe` endpoint
- [ ] Return timestamped transcript

**Endpoint:**
```python
POST /api/transcribe
Content-Type: multipart/form-data
Body: audio file (WAV/WebM)

Response:
{
  "transcript": "I was in a dark forest...",
  "duration": 45.2,
  "language": "en",
  "segments": [
    {"start": 0.0, "end": 3.5, "text": "I was in a dark forest"}
  ]
}
```

**Tech:**
- FastAPI (Python)
- openai-whisper or Whisper API
- FFmpeg for audio conversion

---

### 1.3 Jungian Analysis Engine
Extract symbols, archetypes, and themes from transcript.

**Tasks:**
- [ ] Port Mark's `analyzer.js` to Python (or keep as Node service)
- [ ] Load symbols.json (175 symbols from Book of Symbols)
- [ ] Load jungian.json (archetypes and interpretations)
- [ ] Create `/api/analyze` endpoint
- [ ] Return structured analysis

**Endpoint:**
```python
POST /api/analyze
Body: {"transcript": "I was in a dark forest..."}

Response:
{
  "symbols": [
    {
      "name": "Forest",
      "description": "The unconscious, the unknown...",
      "archetype": "Shadow",
      "relevance": 0.9
    }
  ],
  "archetypes": ["Shadow", "Self"],
  "themes": ["Transformation", "Journey"],
  "interpretation": "This dream suggests...",
  "active_imagination_prompt": "Close your eyes and..."
}
```

**Data files needed:**
- `data/symbols.json` - 175 symbols from Book of Symbols
- `data/jungian.json` - Archetype definitions and triggers

---

### 1.4 Image Generation
Create a single dreamscape image from the analysis.

**Tasks:**
- [ ] Create prompt generator from analysis
- [ ] Integrate Replicate API (SDXL or Flux)
- [ ] Create `/api/visualize` endpoint
- [ ] Store generated images

**Prompt Engineering:**
```python
def build_prompt(analysis):
    symbols = ", ".join([s["name"] for s in analysis["symbols"][:5]])
    mood = analysis["mood"]  # dark, light, surreal, etc.

    return f"""
    Dreamscape visualization, {mood} atmosphere.
    Symbolic elements: {symbols}.
    Surreal, painterly style, soft lighting,
    muted colors, ethereal mood.
    """
```

**Endpoint:**
```python
POST /api/visualize
Body: {"analysis": {...}, "style": "surreal"}

Response:
{
  "image_url": "https://...",
  "prompt_used": "Dreamscape visualization...",
  "generation_time": 12.5
}
```

**Tech:**
- Replicate API (replicate.com)
- Model: stability-ai/sdxl or black-forest-labs/flux
- S3 storage for generated images

---

### 1.5 Database Schema

```sql
-- Dreams table
CREATE TABLE dreams (
    id UUID PRIMARY KEY,
    user_id UUID,  -- for multi-user later
    title TEXT,
    recorded_at TIMESTAMP,
    audio_url TEXT,
    transcript TEXT,
    analysis JSONB,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Symbols index for search
CREATE TABLE dream_symbols (
    id SERIAL PRIMARY KEY,
    dream_id UUID REFERENCES dreams(id),
    symbol_name TEXT,
    archetype TEXT,
    relevance FLOAT
);

-- Index for searching dreams by symbol
CREATE INDEX idx_dream_symbols_name ON dream_symbols(symbol_name);
```

---

## Phase 2: Enhanced Features

### 2.1 Multi-Image Sequence
Generate 3-5 images showing dream progression.

**Tasks:**
- [ ] Split transcript into scenes
- [ ] Generate image per scene
- [ ] Create slideshow/gallery view
- [ ] Add transition animations

### 2.2 Knowledge Graph
D3.js visualization of symbol/archetype connections.

**Tasks:**
- [ ] Port Mark's `KnowledgeGraph.jsx`
- [ ] Build connections from dream history
- [ ] Interactive exploration
- [ ] Filter by time period

### 2.3 Audio Replay with Sync
Play back original recording synced with transcript.

**Tasks:**
- [ ] Audio player component
- [ ] Highlight current word in transcript
- [ ] Skip to timestamp on click
- [ ] Playback speed control

---

## Phase 3: Immersive Experience

### 3.1 Video/GIF Generation
Animated dreamscapes.

**Options:**
- Runway ML Gen-3
- Pika Labs
- Stable Video Diffusion

### 3.2 3D Scene Generation
Convert images to walkable environments.

**Options:**
- Luma AI (NeRF from images)
- Gaussian Splatting
- Three.js procedural scenes

### 3.3 VR/XR Walkthrough
Immersive dream exploration.

**Tech:**
- Three.js + WebXR
- A-Frame for simpler implementation
- Quest 3 WebXR support

---

## Tech Stack Summary

| Layer | MVP | Scale |
|-------|-----|-------|
| **Frontend** | React + Vite | Same |
| **Backend** | FastAPI | Same + Redis queues |
| **Transcription** | Whisper API | Whisper local |
| **Analysis** | Python/Node | Same |
| **Image Gen** | Replicate (SDXL) | Self-hosted Flux |
| **Database** | SQLite → Supabase | PostgreSQL |
| **Storage** | Local → S3 | S3/R2 |

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dreams` | Create new dream (upload audio) |
| GET | `/api/dreams` | List all dreams |
| GET | `/api/dreams/:id` | Get single dream |
| POST | `/api/transcribe` | Transcribe audio |
| POST | `/api/analyze` | Analyze transcript |
| POST | `/api/visualize` | Generate dreamscape image |
| GET | `/api/symbols` | List all symbols |
| GET | `/api/archetypes` | List all archetypes |

---

## Deployment Options

### Option A: Add to Portfolio (Testing App)
- Deploy at `zaylegend.com/dreamcatcher`
- Port 3021
- Docker container

### Option B: Standalone Domain
- `dreamcatcher.app` or similar
- Vercel/Railway for frontend
- Railway/Render for backend

### Option C: Electron Desktop (Mark's existing)
- Fix dependencies in current repo
- Package for Mac distribution

**Recommended:** Start with Option A for fast iteration.

---

## Timeline Estimate

| Phase | Effort |
|-------|--------|
| 1.1 Web Recording | 1-2 days |
| 1.2 Transcription | 1 day |
| 1.3 Jungian Analysis | 2-3 days |
| 1.4 Image Generation | 1-2 days |
| 1.5 Database + UI Polish | 2-3 days |
| **MVP Total** | ~10 days |

---

## Success Metrics

1. **Functional:** Can record, transcribe, analyze, and visualize a dream
2. **Accurate:** Symbols extracted match dream content
3. **Compelling:** Generated images feel dreamlike and relevant
4. **Usable:** < 2 minute total processing time
5. **Retentive:** Users return to record multiple dreams

---

## Next Actions

1. [ ] Clone Mark's repo to `/tmp/dreamcatcher`
2. [ ] Identify and fix local dev dependencies
3. [ ] Set up Replicate API account
4. [ ] Create FastAPI backend scaffold
5. [ ] Port analyzer.js to Python or expose as API
6. [ ] Build minimal React recording UI
7. [ ] Connect all pieces for end-to-end test

---

## Resources

- **Mark's Repo:** https://github.com/yetog/dreamcatcher
- **Replicate SDXL:** https://replicate.com/stability-ai/sdxl
- **Whisper API:** https://platform.openai.com/docs/guides/speech-to-text
- **Book of Symbols:** ARAS/Taschen (2010)
- **Inner Work:** Robert A. Johnson (1986)

---

*"The dream is a little hidden door in the innermost and most secret recesses of the soul."* — Carl Jung
