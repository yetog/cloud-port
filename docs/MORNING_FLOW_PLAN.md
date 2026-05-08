# Morning Flow: Gentle Future Hub Plan

> The central ritual experience for the Gentle Future platform
> Created: 2026-05-08

---

## Vision

A minimal, guided morning experience that connects all consciousness apps through a calm, intentional flow - not a dashboard.

**Philosophy:** Less is more. One thing at a time. Ritual over utility.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      GENTLE FUTURE PLATFORM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌─────────────────────┐                      │
│                    │    MORNING FLOW     │                      │
│                    │    (Daily Ritual)   │                      │
│                    │                     │                      │
│                    │  • Loading screens  │                      │
│                    │  • Guided steps     │                      │
│                    │  • Single focus     │                      │
│                    │  • App launcher     │                      │
│                    └──────────┬──────────┘                      │
│                               │                                  │
│         ┌─────────────────────┼─────────────────────┐           │
│         │                     │                     │           │
│         ▼                     ▼                     ▼           │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│  │  QUESTFUL   │      │    APPS     │      │   SHARED    │     │
│  │  LIVING     │      │             │      │   DATA      │     │
│  │             │      │ DreamCatcher│      │             │     │
│  │  (Profile)  │      │ FineLine    │      │  Supabase   │     │
│  │  • Character│      │ ZenReset    │      │  Database   │     │
│  │  • Stats    │      │ ForgeFit    │      │             │     │
│  │  • Achieve  │      │ ZenTOT      │      │             │     │
│  │  • Settings │      │             │      │             │     │
│  └─────────────┘      └─────────────┘      └─────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## App Roles

### 1. Morning Flow (NEW - The Hub)
**Purpose:** Daily ritual entry point
**URL:** `/` or `/flow`
**Vibe:** Minimal, calm, guided

**What it does:**
- Greets user by name
- Shows ONE insight/focus for the day
- Guides through a 3-5 step morning check-in
- Launches into specific apps when ready
- Beautiful loading transitions between steps

**What it doesn't do:**
- Show all data at once
- Overwhelm with options
- Feel like a dashboard

---

### 2. Questful Living (REBRAND - Profile/Character)
**Purpose:** User profile, stats, achievements, settings
**URL:** `/profile` or `/me`
**Vibe:** RPG character sheet, progression tracking

**What it does:**
- Shows user's "character" (name, avatar, level)
- Displays XP, streaks, achievements
- Tracks skills (mindfulness, fitness, creativity, etc.)
- Houses settings and preferences
- Shows historical stats and progress

**Rebrand needed:**
- "LiFE RPG" → "Your Journey" or keep subtle
- "Quests" → "Daily Rituals" or remove
- Add links back to Morning Flow
- Connect to shared Supabase for real data

---

### 3. Consciousness Apps (EXISTING)
Each app stays focused on its domain:

| App | Domain | Data It Provides |
|-----|--------|------------------|
| **DreamCatcher** | Dreams | Symbols, transcripts, images |
| **FineLine** | Journal | Entries, mood scores, tags |
| **ZenReset** | Meditation | Sessions, duration, streaks |
| **ForgeFit** | Fitness | Workouts, body stats, sleep |
| **ZenTOT** | Knowledge | Notes, connections, AI insights |

---

## Morning Flow: The Experience

### Step-by-Step Flow

```
STEP 0: LOADING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│            ✨ · · · ✨              │
│                                     │
│     Gathering your dreams...        │
│                                     │
│                                     │
└─────────────────────────────────────┘
Duration: 2-3 seconds
Animation: Soft pulse, stars twinkling
Sound: Optional gentle chime


STEP 1: GREETING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│                                     │
│     Good morning, Isayah            │
│                                     │
│     Thursday, May 8                 │
│                                     │
│              ↓                      │
│                                     │
└─────────────────────────────────────┘
Action: Tap or wait 2s to continue
Transition: Fade up from bottom


STEP 2: DREAM SUMMARY (if captured)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│     🌙                              │
│                                     │
│     Last night you dreamed of       │
│     forests and glowing doors       │
│                                     │
│     Symbols: Forest · Door · Light  │
│                                     │
│     [ Explore Dream → ]             │
│              or                     │
│         [ Continue ]                │
│                                     │
└─────────────────────────────────────┘
Data: From DreamCatcher/Supabase
Skip if: No dream captured


STEP 3: MOOD CHECK-IN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│                                     │
│     How are you feeling             │
│     this morning?                   │
│                                     │
│                                     │
│     😢    😐    🙂    😊    🤩      │
│                                     │
│                                     │
└─────────────────────────────────────┘
Action: Tap emoji to select
Data: Writes to FineLine/Supabase
Transition: Selected emoji grows, others fade


STEP 4: TODAY'S FOCUS (AI-generated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│     💡                              │
│                                     │
│     "Water appeared in your         │
│      dreams 3 times this week.      │
│                                     │
│      You've also logged stress      │
│      about finances. These often    │
│      connect."                      │
│                                     │
│     [ Journal About This → ]        │
│              or                     │
│         [ Continue ]                │
│                                     │
└─────────────────────────────────────┘
Data: Cross-app analysis from Claude
Skip if: No meaningful insight


STEP 5: YOUR DAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│     Your day awaits                 │
│                                     │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │ 🌙  │ │ 📝  │ │ 🧘  │        │
│     │Dream│ │Journ│ │Calm │        │
│     └─────┘ └─────┘ └─────┘        │
│                                     │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │ 💪  │ │ 🧠  │ │ 👤  │        │
│     │ Fit │ │Think│ │ You │        │
│     └─────┘ └─────┘ └─────┘        │
│                                     │
│     🔥 12 day streak                │
│                                     │
└─────────────────────────────────────┘
Apps: Link to each consciousness app
Profile: Links to Questful Living (/profile)
```

---

## Questful Living as Profile

### Current Structure
```
Questful Living
├── Starter Menu (character select)
├── Dashboard (quests, skills)
├── Quests Page
├── Skills Page
├── Achievements Page
└── Settings Page
```

### Rebranded Structure
```
Profile (/profile)
├── Character Overview
│   ├── Avatar + Name
│   ├── Level + XP bar
│   └── Title/Class
├── Stats
│   ├── Total entries logged
│   ├── Dreams captured
│   ├── Meditation minutes
│   ├── Workouts completed
│   └── Current streaks
├── Skills (renamed from RPG skills)
│   ├── Mindfulness (from meditation)
│   ├── Self-Awareness (from journaling)
│   ├── Dream Recall (from dreams)
│   ├── Vitality (from fitness)
│   └── Wisdom (from knowledge graph)
├── Achievements
│   ├── "First Dream Captured"
│   ├── "7 Day Streak"
│   ├── "100 Journal Entries"
│   └── etc.
└── Settings
    ├── Notifications
    ├── Theme (dark/light)
    ├── Connected Apps
    └── Export Data
```

### Changes Needed
1. Remove/hide "Quests" concept (or rename to "Daily Rituals")
2. Connect stats to real Supabase data
3. Add navigation back to Morning Flow
4. Update branding (LiFE RPG → Gentle Future Profile)
5. Keep the RPG aesthetic - it works

---

## Loading Screens

### Transition Library

```css
/* Between steps - fade + slide */
.step-enter {
  opacity: 0;
  transform: translateY(20px);
}
.step-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s ease-out;
}

/* Loading states */
.loading-dreams {
  /* Stars twinkling */
}
.loading-insights {
  /* Gentle pulse */
}
.loading-profile {
  /* Character silhouette fills in */
}
```

### Loading Messages (Rotate)
```
"Gathering your dreams..."
"Connecting the dots..."
"Reading the symbols..."
"Preparing your day..."
"Syncing your journey..."
"Consulting the stars..."
"Finding patterns..."
```

---

## Data Flow

### Morning Flow Reads:
```
Supabase
├── users/{id}
│   ├── name
│   └── preferences
├── entries (last 24h)
│   ├── dreams (most recent)
│   ├── mood (yesterday's trend)
│   └── meditation (streak count)
└── insights (pre-generated)
    └── today's focus
```

### Morning Flow Writes:
```
Supabase
└── entries
    └── mood_checkin
        ├── user_id
        ├── value (1-5)
        ├── source: "morning_flow"
        └── created_at
```

### Profile Reads:
```
Supabase
├── users/{id} (full profile)
├── entries (all time, aggregated)
├── achievements (unlocked)
└── streaks (current + best)
```

---

## Tech Stack

### Morning Flow (New App)
```
Framework: React + Vite
Styling: Tailwind + Questful color palette
Animations: Framer Motion
State: React Context (simple)
Data: Supabase client
Auth: Supabase Auth
```

### Questful Living (Modified)
```
Keep existing stack
Add: Supabase integration
Remove: Quest creation UI (or hide)
Update: Branding, navigation
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Supabase project
- [ ] Create shared database schema
- [ ] Build Morning Flow skeleton with mock data
- [ ] Implement step-by-step flow with transitions

### Phase 2: Profile Integration (Week 2)
- [ ] Rebrand Questful Living navigation
- [ ] Connect Questful to Supabase
- [ ] Add "Back to Flow" navigation
- [ ] Wire up real stats display

### Phase 3: App Connections (Week 3)
- [ ] Add Supabase writes to FineLine
- [ ] Add Supabase writes to DreamCatcher
- [ ] Build insight generator (Claude API)
- [ ] Morning Flow shows real data

### Phase 4: Polish (Week 4)
- [ ] Loading screen animations
- [ ] Sound design (optional)
- [ ] Mobile optimization
- [ ] PWA setup for Morning Flow

---

## URL Structure

```
gentlefuture.app (or zaylegend.com/gf/)
├── /              → Morning Flow (daily ritual)
├── /profile       → Questful Living (character/stats)
├── /dreams        → DreamCatcher
├── /journal       → FineLine
├── /calm          → ZenReset
├── /fit           → ForgeFit
└── /think         → ZenTOT
```

---

## Design Tokens (From Questful)

```css
:root {
  /* Colors */
  --color-primary: #7E69AB;    /* Purple */
  --color-secondary: #2C2A4A;  /* Dark purple */
  --color-tertiary: #4C5C8A;   /* Blue-gray */
  --color-accent: #33C3F0;     /* Cyan */
  --color-dark: #1A1F2C;       /* Background */
  --color-light: #9b87f5;      /* Light purple */

  /* Animations */
  --transition-smooth: 0.3s ease-out;
  --transition-slow: 0.5s ease-out;

  /* Spacing */
  --space-card: 1.5rem;
  --space-section: 3rem;
}
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Morning completion rate | 80%+ | Users who finish all steps |
| Time in flow | 2-5 min | Not too fast, not too long |
| App launches from flow | 60%+ | Click-through to apps |
| Return rate | Daily | Users who come back |
| Mood logging | 90%+ | Step 3 completion |

---

## Open Questions

1. **Sound?** - Should Morning Flow have ambient sound/chimes?
2. **Evening Flow?** - Should there be a wind-down ritual too?
3. **Notifications?** - Gentle morning reminder?
4. **Offline?** - PWA with cached last state?
5. **Genie Integration?** - Where does dream world exploration fit?

---

## Next Steps

1. Review this plan with Mark
2. Decide on Supabase vs other backend
3. Scaffold Morning Flow app
4. Start Questful Living modifications
5. Design loading screen animations

---

*"The morning ritual shapes the day. The day shapes the life."*

