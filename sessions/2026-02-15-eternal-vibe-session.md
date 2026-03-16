# Eternal Vibe Session - 2026-02-15

## Session Summary

Built the foundation for the "Eternal Vibe" music production system in Chord Genesis. Implemented both Option 1 (Python Audio Analysis) and Option 2 (SFX Layer) from the previous session's roadmap.

---

## What Was Built

### 1. Python Audio Analysis Backend
**Location:** `/var/www/zaylegend/apps/chord-genesis/backend/`
**Port:** 3020
**Service:** `chord-genesis-api.service` (auto-starts on boot)

Analyzes uploaded audio files and generates ElevenLabs-compatible prompts for style replication.

**Capabilities:**
- BPM detection
- Key & mode detection (with confidence score)
- Energy level classification (chill/medium/high/intense)
- Mood estimation (dreamy, uplifting, melancholic, etc.)
- Texture analysis (sparse, moderate, dense, lush)
- Genre hints
- Automatic prompt generation with variations

**Files:**
```
backend/
├── main.py              # FastAPI server
├── audio_analyzer.py    # Librosa feature extraction
├── prompt_generator.py  # ElevenLabs prompt generation
├── requirements.txt     # Python dependencies
├── run.sh              # Manual startup script
└── chord-genesis-api.service  # Systemd service file
```

**API Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/analyze` | POST | Full analysis + multiple prompts |
| `/quick-prompt` | POST | Fast single prompt |
| `/variations` | POST | Generate prompt variations |
| `/generate-prompt` | POST | Regenerate from features |

### 2. SFX Layer
**Location:** `/var/www/zaylegend/apps/chord-genesis/src/`

Web Audio API synthesized sound effects for layering over chord progressions.

**16 Presets across 4 categories:**

| Category | Effects | Behavior |
|----------|---------|----------|
| **Ambient** | Warm Pad, Vinyl Crackle, Soft Rain, Space Drift, Tape Hiss | Looping (toggle) |
| **Risers** | Filter Sweep, Noise Rise, Pitch Rise, Tension Build | One-shot (3-6s) |
| **Impacts** | Deep Boom, Cinematic Hit, Reverse Cymbal, Sub Drop | One-shot (1-2s) |
| **Transitions** | Whoosh, Glitch Stutter, Tape Stop | One-shot (0.5-1.5s) |

**Files:**
```
src/
├── hooks/
│   ├── useSFXLayer.ts       # SFX synthesis & playback
│   └── useAudioAnalysis.ts  # API client for backend
└── components/
    ├── SFXPanel.tsx         # SFX control UI
    └── AudioAnalysisPanel.tsx  # Style Replicator UI
```

### 3. Frontend Integration

Modified `App.tsx` and `ElevenLabsPanel.tsx` to:
- Add Style Replicator panel (upload → analyze → get prompt)
- Add SFX Layer panel (ambient, risers, impacts, transitions)
- Pass analyzed prompts to AI Music Generator

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chord Genesis                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)           Port 3001          │
│  ├── Chord Generation (music theory)                        │
│  ├── Style Replicator UI ──────────────┐                    │
│  ├── AI Music Generator (ElevenLabs)   │                    │
│  └── SFX Layer (Web Audio API)         │                    │
├────────────────────────────────────────│────────────────────┤
│  Backend (Python + FastAPI)            │    Port 3020       │
│  └── Audio Analysis API ◄──────────────┘                    │
│      ├── librosa (feature extraction)                       │
│      └── Prompt Generator                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Management

```bash
# Check status
sudo systemctl status chord-genesis-api

# Restart backend
sudo systemctl restart chord-genesis-api

# View logs
sudo journalctl -u chord-genesis-api -f

# Test API
curl http://localhost:3020/health
```

---

## How to Use

1. **Open Chord Genesis:** https://zaylegend.com/chord-genesis/
2. **Generate** a chord progression
3. **Style Replicator:** Upload a reference track to extract its style
4. **AI Music Generator:** Use the generated prompt (auto-fills)
5. **SFX Layer:** Add ambient textures, risers, impacts while composing

---

## Next Session Options

### Option 1: Sample-based SFX
**Effort:** Medium | **Impact:** High

Replace synthesized SFX with real audio samples for professional sound.

**Tasks:**
- Source/create sample packs (drums, FX, textures)
- Build sample loader with Web Audio API
- Add sample browser UI
- Implement sample triggering with timing

**Benefits:**
- Professional quality sounds
- More variety
- Industry-standard workflow

---

### Option 2: ACE-Step Integration
**Effort:** High | **Impact:** Very High

Local GPU-based music generation using ACE-Step model.

**Tasks:**
- Set up ACE-Step on GPU server
- Create API wrapper
- Integrate with Chord Genesis
- Handle model loading/inference

**Benefits:**
- No ElevenLabs API costs
- Full control over generation
- Offline capability
- Faster iteration

**Requirements:**
- GPU with sufficient VRAM
- Python environment with PyTorch

---

### Option 3: Binaural Beats Generator
**Effort:** Low | **Impact:** Medium

Add therapeutic binaural beat generation for focus/relaxation.

**Tasks:**
- Create binaural beat oscillator hook
- Add frequency presets (Delta, Theta, Alpha, Beta, Gamma)
- Build simple UI panel
- Add carrier frequency control

**Presets:**
| Wave | Frequency | Effect |
|------|-----------|--------|
| Delta | 0.5-4 Hz | Deep sleep |
| Theta | 4-8 Hz | Meditation |
| Alpha | 8-13 Hz | Relaxation |
| Beta | 13-30 Hz | Focus |
| Gamma | 30-100 Hz | Cognition |

**Benefits:**
- Unique feature
- Quick to implement
- Wellness angle

---

### Option 4: Real Instrument Sounds
**Effort:** Medium | **Impact:** High

Replace sine wave chord playback with sampled instruments.

**Tasks:**
- Source piano/guitar/synth samples
- Implement sample-based playback
- Add instrument selector UI
- Handle velocity/expression

**Benefits:**
- Much better sound quality
- More musical output
- Professional feel

---

### Option 5: Audio Visualization
**Effort:** Medium | **Impact:** Medium

Add visual feedback for audio playback.

**Tasks:**
- Implement Web Audio analyzer node
- Create waveform display
- Add spectrum analyzer
- Sync visuals to playback

**Benefits:**
- Better UX
- Visual feedback
- More engaging

---

### Option 6: Style Library
**Effort:** Low | **Impact:** Medium

Save and reuse analyzed styles as presets.

**Tasks:**
- Add "Save Style" button to analysis results
- Store in localStorage or backend
- Create style browser UI
- Allow style editing

**Benefits:**
- Workflow efficiency
- Build personal style collection
- Quick recall

---

## Recommended Path

```
Session N+1: Option 3 (Binaural Beats) - Quick win, unique feature
Session N+2: Option 1 (Sample SFX) - Professional sound quality
Session N+3: Option 4 (Real Instruments) - Better chord playback
Session N+4: Option 2 (ACE-Step) - Big feature, removes API dependency
```

---

## Files Changed This Session

**Created:**
- `backend/main.py`
- `backend/audio_analyzer.py`
- `backend/prompt_generator.py`
- `backend/requirements.txt`
- `backend/run.sh`
- `backend/chord-genesis-api.service`
- `src/hooks/useSFXLayer.ts`
- `src/hooks/useAudioAnalysis.ts`
- `src/components/SFXPanel.tsx`
- `src/components/AudioAnalysisPanel.tsx`

**Modified:**
- `src/App.tsx` (added new panels)
- `src/components/ElevenLabsPanel.tsx` (external prompt support)

**System:**
- `/etc/systemd/system/chord-genesis-api.service` (installed)

---

## Dependencies Added

**Python (backend):**
- fastapi, uvicorn, python-multipart
- librosa, numpy, scipy, soundfile
- scikit-learn, pydub, python-dotenv

**Frontend:**
- No new npm dependencies (Web Audio API)

---

## Quick Start Next Session

```bash
# Check backend is running
curl http://localhost:3020/health

# If not running
sudo systemctl start chord-genesis-api

# View app
# https://zaylegend.com/chord-genesis/

# Check logs if issues
sudo journalctl -u chord-genesis-api -f
```

---

*Session completed: 2026-02-15*
*Next: Pick an option above and continue building!*
