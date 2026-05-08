# Gentle Future Platform Blueprint

> Personal Operating System for Consciousness
> Version: 1.0 | Created: 2026-05-08

---

## Vision

A unified platform connecting five specialized apps for holistic self-development. Each app remains focused on its domain while sharing infrastructure, data, and insights through a central hub.

**Core Philosophy:** Orchestrate, don't consolidate. Keep each app's identity while creating emergent value through connections.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GENTLE FUTURE PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        DAILY BRIEF (Hub)                             │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │  │  Today's │ │  Mood    │ │ Insights │ │ Streaks  │ │  Quick   │  │    │
│  │  │  Focus   │ │  Pulse   │ │  Feed    │ │ & Goals  │ │  Entry   │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         APP LAYER (5 Apps)                           │    │
│  │                                                                       │    │
│  │   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐│    │
│  │   │   ZEN   │   │  FINE   │   │   ZEN   │   │  FORGE  │   │ DREAM  ││    │
│  │   │  RESET  │   │  LINE   │   │   TOT   │   │   FIT   │   │ CATCHER││    │
│  │   │         │   │         │   │         │   │         │   │        ││    │
│  │   │Meditate │   │ Journal │   │Knowledge│   │ Fitness │   │ Dreams ││    │
│  │   │  Calm   │   │  Mood   │   │  Graph  │   │ Workout │   │ Symbols││    │
│  │   │ Breathe │   │ Reflect │   │   AI    │   │Nutrition│   │  Image ││    │
│  │   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └───┬────┘│    │
│  │        │             │             │             │             │     │    │
│  └────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┘    │
│           │             │             │             │             │          │
│           ▼             ▼             ▼             ▼             ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      SHARED SERVICES LAYER                           │    │
│  │                                                                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │    │
│  │  │   Auth   │  │    AI    │  │  Voice   │  │  Media   │  │  Sync  │ │    │
│  │  │ Service  │  │ Service  │  │ Service  │  │ Storage  │  │ Engine │ │    │
│  │  │          │  │          │  │          │  │          │  │        │ │    │
│  │  │ • JWT    │  │ • Claude │  │ • 11Labs │  │ • S3     │  │• Events│ │    │
│  │  │ • OAuth  │  │ • RAG    │  │ • Whisper│  │ • Images │  │• Queue │ │    │
│  │  │ • RBAC   │  │ • Embed  │  │ • TTS    │  │ • Audio  │  │• WebSk │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA LAYER                                   │    │
│  │                                                                       │    │
│  │  ┌──────────────────────────────────────────────────────────────┐   │    │
│  │  │                     PostgreSQL (Supabase)                     │   │    │
│  │  │                                                                │   │    │
│  │  │  users │ entries │ dreams │ workouts │ knowledge │ insights   │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  │                                                                       │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │    │
│  │  │     Redis      │  │   Pinecone     │  │  TimescaleDB   │         │    │
│  │  │   (Cache/Q)    │  │  (Vectors)     │  │  (Time Series) │         │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Five Apps

### 1. ZEN RESET (Meditation & Calm)
**Purpose:** Guided meditation, breathwork, ambient soundscapes
**Data Generated:**
- Meditation sessions (duration, type, completion)
- Breathwork patterns
- Calm scores over time

**Gives to Platform:**
- Stress/calm baseline
- Optimal time-of-day patterns
- Recovery metrics

**Receives from Platform:**
- Dream-inspired meditations
- Post-workout recovery sessions
- Mood-triggered suggestions

---

### 2. FINE LINE (Daily Journal)
**Purpose:** Timeline journal with mood tracking, voice notes, affirmations
**Data Generated:**
- Daily entries with timestamps
- Mood values (1-10 scale)
- Tags and categories
- Voice transcripts
- Gratitude entries
- Goal progress

**Gives to Platform:**
- Emotional state timeline
- Life events context
- Goal tracking
- Recurring themes

**Receives from Platform:**
- Dream symbols to journal about
- Workout achievements to celebrate
- Meditation streaks
- AI-generated prompts based on patterns

---

### 3. ZEN TOT (Knowledge Graph + AI)
**Purpose:** Personal knowledge management with D3.js graph and AI assistant
**Data Generated:**
- Notes and connections
- Knowledge graph relationships
- AI conversation history
- Concept maps

**Gives to Platform:**
- Insight synthesis
- Pattern recognition
- Cross-domain connections
- AI analysis capabilities

**Receives from Platform:**
- All data from other apps for analysis
- Dream symbols for graph integration
- Journal themes for connection
- Fitness correlations

---

### 4. FORGE FIT (Fitness & Body)
**Purpose:** Workout tracking, nutrition, body metrics
**Data Generated:**
- Workout logs (exercises, sets, reps, weight)
- Nutrition tracking
- Body measurements
- Sleep quality
- Energy levels

**Gives to Platform:**
- Physical state data
- Sleep patterns
- Energy correlations
- Body transformation metrics

**Receives from Platform:**
- Mood-optimized workout suggestions
- Dream-rest correlation insights
- Recovery recommendations
- Motivation from journal wins

---

### 5. DREAMCATCHER (Dreams & Unconscious)
**Purpose:** Dream recording, transcription, Jungian analysis, visualization
**Data Generated:**
- Dream transcripts
- Symbols and archetypes
- Generated dreamscape images
- Sleep-dream patterns
- Recurring motifs

**Gives to Platform:**
- Unconscious insights
- Symbol patterns
- Emotional undercurrents
- Archetypal themes

**Receives from Platform:**
- Journal context for interpretation
- Meditation for lucid dreaming
- Fitness/sleep correlations
- Knowledge graph for symbol connections

---

## Daily Brief Dashboard

The central hub that unifies all apps without replacing them.

### Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GENTLE FUTURE                               [Profile] [Settings] [Search] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Good morning, Isayah                                Thursday, May 8, 2026  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         TODAY'S FOCUS                                │   │
│  │                                                                       │   │
│  │  "Your dreams last night featured the FOREST symbol 3 times.        │   │
│  │   This often appears when you're processing a major life change.    │   │
│  │   Consider journaling about transitions you're experiencing."       │   │
│  │                                                                       │   │
│  │  [Explore in FineLine →]  [View Dream →]  [Add to ZenTOT →]        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   MOOD PULSE     │  │   BODY STATE     │  │   DREAM LAST     │         │
│  │                  │  │                  │  │    NIGHT         │         │
│  │   😊 7.2/10      │  │   💪 Recovered   │  │                  │         │
│  │   ↑ from 6.5    │  │   8hrs sleep     │  │   [Dream Image]  │         │
│  │                  │  │   Ready to lift  │  │                  │         │
│  │   [Log Mood]     │  │   [Start Workout]│  │   "Dark forest,  │         │
│  │                  │  │                  │  │    bright door"  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         ACTIVE STREAKS                               │   │
│  │                                                                       │   │
│  │  🧘 Meditation    ████████████░░░░░░░░  12 days                     │   │
│  │  📝 Journaling    ████████████████████  24 days                     │   │
│  │  💪 Workouts      ████████░░░░░░░░░░░░   8 days (rest day OK)       │   │
│  │  🌙 Dream Capture ████░░░░░░░░░░░░░░░░   4 days                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         INSIGHT FEED                                 │   │
│  │                                                                       │   │
│  │  ⚡ Pattern Detected                                    2 hours ago  │   │
│  │  Your mood improves 23% on days you meditate before journaling.     │   │
│  │  [Try this sequence today →]                                         │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  🌙 Dream Symbol                                        Last night  │   │
│  │  "Bridge" appeared - often signals transition. You've logged 3      │   │
│  │  career-related entries this week. Connection?                       │   │
│  │  [Explore in ZenTOT →]                                               │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  💪 Achievement                                          Yesterday  │   │
│  │  New PR: Bench Press 185lbs (+10lbs from last month)                │   │
│  │  [Journal this win →]                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │  ZenReset │ │ FineLine  │ │  ZenTOT   │ │ ForgeFit  │ │DreamCatch │   │
│  │    🧘     │ │    📝     │ │    🧠     │ │    💪     │ │    🌙     │   │
│  │  Open →   │ │  Open →   │ │  Open →   │ │  Open →   │ │  Open →   │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Shared Tables

```sql
-- Users (shared across all apps)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Unified entries (polymorphic for all apps)
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    app TEXT NOT NULL,  -- 'zenreset', 'fineline', 'zentot', 'forgefit', 'dreamcatcher'
    type TEXT NOT NULL,  -- 'meditation', 'journal', 'note', 'workout', 'dream'
    content JSONB NOT NULL,
    mood INTEGER,  -- 1-10 scale (normalized across apps)
    energy INTEGER,  -- 1-10 scale
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    recorded_at TIMESTAMP  -- when the activity happened (vs when logged)
);

-- Cross-app connections (knowledge graph edges)
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    source_id UUID REFERENCES entries(id),
    target_id UUID REFERENCES entries(id),
    relationship TEXT,  -- 'inspired_by', 'relates_to', 'caused', 'followed_by'
    strength FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI-generated insights
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT,  -- 'pattern', 'correlation', 'suggestion', 'milestone'
    title TEXT,
    content TEXT,
    source_entries UUID[],  -- entries that generated this insight
    dismissed BOOLEAN DEFAULT FALSE,
    acted_on BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Streaks tracking
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    app TEXT,
    activity TEXT,  -- 'meditation', 'journal', 'workout', 'dream'
    current_count INTEGER DEFAULT 0,
    longest_count INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### App-Specific Tables

```sql
-- DreamCatcher specific
CREATE TABLE dreams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES entries(id),
    audio_url TEXT,
    transcript TEXT,
    symbols JSONB,  -- [{name, archetype, relevance}]
    archetypes TEXT[],
    interpretation TEXT,
    image_url TEXT,
    lucidity_level INTEGER,  -- 1-5
    vividness INTEGER  -- 1-5
);

-- ForgeFit specific
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES entries(id),
    type TEXT,  -- 'strength', 'cardio', 'flexibility', 'sports'
    exercises JSONB,  -- [{name, sets, reps, weight, duration}]
    calories_burned INTEGER,
    duration_minutes INTEGER,
    perceived_effort INTEGER  -- 1-10 RPE
);

-- ZenReset specific
CREATE TABLE meditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES entries(id),
    type TEXT,  -- 'guided', 'unguided', 'breathwork', 'body_scan'
    duration_seconds INTEGER,
    completed BOOLEAN,
    guide_used TEXT,
    background_sound TEXT
);

-- Symbols reference (shared knowledge base)
CREATE TABLE symbols (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT,
    archetype TEXT,
    keywords TEXT[],
    image_prompt TEXT
);
```

---

## API Design

### Gateway Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (FastAPI)                       │
│                      api.gentlefuture.app                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /api/v1/                                                        │
│  ├── /auth                 # Authentication                      │
│  │   ├── POST /login                                             │
│  │   ├── POST /register                                          │
│  │   └── POST /refresh                                           │
│  │                                                                │
│  ├── /users                # User management                     │
│  │   ├── GET /me                                                 │
│  │   └── PATCH /me                                               │
│  │                                                                │
│  ├── /brief                # Daily Brief dashboard               │
│  │   ├── GET /today        # Today's unified view                │
│  │   ├── GET /insights     # AI-generated insights               │
│  │   └── GET /streaks      # All streaks                         │
│  │                                                                │
│  ├── /entries              # Universal entry CRUD                │
│  │   ├── GET /             # List (filter by app, type, date)    │
│  │   ├── POST /            # Create                              │
│  │   ├── GET /:id                                                │
│  │   ├── PATCH /:id                                              │
│  │   └── DELETE /:id                                             │
│  │                                                                │
│  ├── /connections          # Knowledge graph                     │
│  │   ├── GET /graph        # Full graph for user                 │
│  │   ├── POST /            # Create connection                   │
│  │   └── DELETE /:id                                             │
│  │                                                                │
│  ├── /ai                   # AI services                         │
│  │   ├── POST /analyze     # Analyze any content                 │
│  │   ├── POST /synthesize  # Cross-app insight generation        │
│  │   └── POST /suggest     # Get suggestions                     │
│  │                                                                │
│  └── /apps                 # App-specific endpoints              │
│      ├── /dreamcatcher                                           │
│      │   ├── POST /transcribe                                    │
│      │   ├── POST /analyze-dream                                 │
│      │   └── POST /visualize                                     │
│      ├── /forgefit                                               │
│      │   ├── GET /exercises                                      │
│      │   └── GET /programs                                       │
│      ├── /zenreset                                               │
│      │   ├── GET /meditations                                    │
│      │   └── GET /soundscapes                                    │
│      ├── /fineline                                               │
│      │   └── GET /prompts                                        │
│      └── /zentot                                                 │
│          └── GET /symbols                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Example Endpoint: Daily Brief

```python
# GET /api/v1/brief/today
{
    "date": "2026-05-08",
    "user": {
        "name": "Isayah",
        "current_streak_days": 24
    },
    "focus": {
        "type": "dream_symbol",
        "title": "Recurring Symbol: Forest",
        "message": "Your dreams featured FOREST 3 times this week...",
        "actions": [
            {"label": "Journal about it", "app": "fineline", "action": "new_entry"},
            {"label": "View dream", "app": "dreamcatcher", "id": "dream-123"},
            {"label": "Explore connections", "app": "zentot", "symbol": "forest"}
        ]
    },
    "mood": {
        "current": 7.2,
        "trend": "up",
        "previous": 6.5,
        "source": "fineline"
    },
    "body": {
        "status": "recovered",
        "sleep_hours": 8,
        "readiness": "high",
        "source": "forgefit"
    },
    "last_dream": {
        "id": "dream-456",
        "image_url": "https://...",
        "summary": "Dark forest, bright door",
        "symbols": ["forest", "door", "light"]
    },
    "streaks": [
        {"app": "zenreset", "activity": "meditation", "days": 12, "goal": 30},
        {"app": "fineline", "activity": "journal", "days": 24, "goal": 30},
        {"app": "forgefit", "activity": "workout", "days": 8, "rest_day": true},
        {"app": "dreamcatcher", "activity": "capture", "days": 4, "goal": 7}
    ],
    "insights": [
        {
            "id": "insight-789",
            "type": "pattern",
            "title": "Meditation-Mood Correlation",
            "message": "Mood improves 23% on meditation mornings",
            "action": {"label": "Start meditation", "app": "zenreset"}
        }
    ]
}
```

---

## Integration Points

### Event-Driven Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EVENT BUS (Redis)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Events Published:                                               │
│  ─────────────────                                               │
│  dreamcatcher.dream.recorded    → Triggers insight generation   │
│  dreamcatcher.dream.analyzed    → Updates knowledge graph       │
│  forgefit.workout.completed     → Updates streaks, suggests rest│
│  forgefit.sleep.logged          → Correlates with dreams        │
│  fineline.entry.created         → Adds to timeline, mood trend  │
│  fineline.mood.logged           → Triggers support suggestions  │
│  zenreset.meditation.completed  → Updates streaks, calm score   │
│  zentot.connection.created      → Rebuilds graph cache          │
│                                                                  │
│  Event Handlers:                                                 │
│  ───────────────                                                 │
│  insight-generator              → Listens to all, creates AI    │
│  streak-tracker                 → Updates streak counts         │
│  notification-service           → Sends push/email              │
│  daily-brief-builder            → Pre-computes dashboard        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cross-App Flows

```
Flow 1: Dream → Journal → Knowledge
─────────────────────────────────────
1. User records dream in DreamCatcher
2. DreamCatcher extracts symbols: [forest, bridge, water]
3. Event: dream.analyzed
4. Insight Generator: "Bridge symbol often appears during transitions"
5. Daily Brief shows: "Journal about life transitions?"
6. User clicks → Opens FineLine with prompt
7. User journals about career change
8. ZenTOT: Auto-connects journal entry to dream
9. Knowledge graph grows

Flow 2: Workout → Sleep → Dream
─────────────────────────────────────
1. User logs intense workout in ForgeFit
2. User logs 9hrs sleep (great recovery)
3. User captures vivid dream
4. Insight Generator detects correlation
5. Insight: "Intense workouts + good sleep = vivid dreams for you"
6. Stored as pattern for future suggestions

Flow 3: Low Mood → Support Flow
─────────────────────────────────────
1. User logs mood 3/10 in FineLine
2. Event: mood.logged (low)
3. ZenReset: Suggests calming meditation
4. DreamCatcher: Flags for dream monitoring
5. Daily Brief: Gentle, supportive tone
6. Next day: Check-in prompt
```

---

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Frontend Hub** | React + Vite | Daily Brief dashboard |
| **App Frontends** | React + Vite | Each app standalone |
| **API Gateway** | FastAPI | Python, async |
| **Auth** | Supabase Auth | JWT, OAuth providers |
| **Database** | Supabase (PostgreSQL) | Primary data store |
| **Cache/Queue** | Redis | Events, sessions, cache |
| **Vector DB** | Pinecone | Semantic search, embeddings |
| **Time Series** | TimescaleDB | Mood/energy trends |
| **AI** | Claude API | Analysis, synthesis |
| **Voice** | ElevenLabs + Whisper | TTS and STT |
| **Images** | Replicate (SDXL/Flux) | Dream visualization |
| **Storage** | IONOS S3 | Media files |
| **Hosting** | Self-hosted + Vercel | Hybrid deployment |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT TOPOLOGY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  zaylegend.com (Self-Hosted Linux Server)                       │
│  ├── /daily-brief     → Daily Brief Hub (port 3025)            │
│  ├── /zen-reset       → ZenReset (port 8081)                   │
│  ├── /fine-line       → FineLine (port 3003)                   │
│  ├── /zen-tot         → ZenTOT (port 3017)                     │
│  ├── /forge-fit       → ForgeFit (port 3018)                   │
│  └── /dreamcatcher    → DreamCatcher (port 3021)               │
│                                                                  │
│  api.gentlefuture.app (or zaylegend.com/api/gf/)               │
│  └── FastAPI Gateway (port 3026)                                │
│      ├── Supabase connection                                    │
│      ├── Redis connection                                       │
│      └── External API keys (Claude, Replicate, 11Labs)         │
│                                                                  │
│  External Services:                                              │
│  ├── Supabase (Database + Auth)                                 │
│  ├── Redis Cloud (Events + Cache)                               │
│  ├── Pinecone (Vectors)                                         │
│  └── IONOS S3 (Media Storage)                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Set up Supabase project with shared schema
- [ ] Create FastAPI gateway with auth
- [ ] Build Daily Brief skeleton (static data)
- [ ] Deploy DreamCatcher MVP

### Phase 2: Integration
- [ ] Connect existing apps to shared database
- [ ] Implement event bus (Redis)
- [ ] Build insight generator service
- [ ] Wire up Daily Brief with real data

### Phase 3: Intelligence
- [ ] Add vector embeddings for semantic search
- [ ] Build cross-app correlation engine
- [ ] Implement AI synthesis for insights
- [ ] Add personalized suggestions

### Phase 4: Polish
- [ ] Unified design system across apps
- [ ] Mobile-responsive Daily Brief
- [ ] Push notifications
- [ ] Onboarding flow

---

## Key Design Principles

1. **Apps Stay Independent** - Each app works standalone. Platform adds value but isn't required.

2. **Data Flows Up** - Apps push data to platform. Platform never overwrites app data.

3. **Insights, Not Interruptions** - Platform suggests, doesn't demand. No notification spam.

4. **Privacy First** - All data user-owned. Export anytime. Delete anytime.

5. **Graceful Degradation** - If platform is down, apps still work perfectly.

6. **Build for One User** - Make it perfect for you first. Scale comes after validation.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Use | 5+ entries/week | Entries per user per week |
| Cross-App Usage | 3+ apps/week | Apps touched per session |
| Insight Engagement | 30% acted on | Insights clicked vs dismissed |
| Streak Retention | 14+ days avg | Average streak length |
| Dream Capture Rate | 50% of dreams | Dreams logged vs nights |

---

## Notes

- Start with DreamCatcher MVP as the "killer feature"
- Daily Brief can be a PWA for quick mobile access
- Consider voice-first for dream capture (bedside recording)
- Knowledge graph becomes more valuable over time - emphasize this in onboarding
- The platform is the connective tissue, not the main attraction

---

*"The privilege of a lifetime is to become who you truly are."* — Carl Jung

