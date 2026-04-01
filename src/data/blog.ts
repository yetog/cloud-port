export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: 'cloud' | 'ai' | 'devops' | 'creative' | 'tutorial' | 'insights' | 'docs' | 'sessions' | 'scripts';
  tags: string[];
  image?: string;
  featured?: boolean;
  downloadUrl?: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  color: string;
}

export const blogCategories: BlogCategory[] = [
  { id: 'all', title: 'All Posts', color: 'bg-muted' },
  { id: 'docs', title: 'Docs', color: 'bg-emerald-500' },
  { id: 'sessions', title: 'Sessions', color: 'bg-violet-500' },
  { id: 'scripts', title: 'Scripts', color: 'bg-amber-500' },
  { id: 'cloud', title: 'Cloud', color: 'bg-blue-500' },
  { id: 'ai', title: 'AI', color: 'bg-purple-500' },
  { id: 'devops', title: 'DevOps', color: 'bg-green-500' },
  { id: 'creative', title: 'Creative', color: 'bg-orange-500' },
  { id: 'tutorial', title: 'Tutorials', color: 'bg-cyan-500' },
  { id: 'insights', title: 'Insights', color: 'bg-pink-500' }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'infrastructure-upgrade-2026-04',
    title: 'Portfolio Brain Infrastructure Upgrade: Skills, Memory, Observability & REST API',
    excerpt: 'Implemented a comprehensive infrastructure upgrade inspired by the Sentinel architecture - 15 skills, Redis/Qdrant memory, Prometheus/Grafana observability, and a FastAPI REST interface.',
    content: `
# Portfolio Brain Infrastructure Upgrade

Today I completed a major infrastructure upgrade for my portfolio, bringing it to "Sentinel parity" with a full AI brain architecture. This post documents what was built and how it all fits together.

## The Inspiration: Sentinel

After analyzing the [Sentinel](https://github.com/cocacolasante/Sentinel.git) autonomous AI assistant, I identified four key components missing from my portfolio infrastructure:

1. **Skills System** - Modular action handlers
2. **Memory System** - Hot cache + vector search
3. **Observability** - Metrics and dashboards
4. **REST API** - Programmatic access

## Phase 1: Skills System

Built a modular skills framework with 15 skills and auto-discovery:

### Architecture
\`\`\`
/var/www/zaylegend/skills/
├── __init__.py
├── base.py              # BaseSkill, SkillResult, ApprovalCategory
├── registry.py          # Auto-discovery via pkgutil
├── deploy_skill.py      # Wraps deploy.sh
├── backup_skill.py      # Wraps backup.sh + git backup
├── app_skill.py         # List, health, restart apps
├── task_skill.py        # CRUD for tasks
├── status_skill.py      # Aggregated system status
└── git_skill.py         # Git operations
\`\`\`

### BaseSkill Pattern
\`\`\`python
class BaseSkill(ABC):
    name: str = "base"
    description: str = ""
    trigger_intents: list[str] = []
    approval_category: ApprovalCategory = ApprovalCategory.NONE

    @abstractmethod
    async def execute(self, params: dict) -> SkillResult:
        pass
\`\`\`

### Skills Implemented (15 Total)
| Skill | Description |
|-------|-------------|
| deploy | Run deployment script |
| backup | Create backup |
| git_backup | Push to GitHub with backup branch |
| app_list | List all 25 apps by category |
| app_health | Check which apps are UP/DOWN |
| app_restart | Restart a Docker container |
| task_create | Add a new task |
| task_list | View pending tasks |
| task_done | Mark task complete |
| task_update | Update task details |
| status | System overview |
| git_status | Show working tree status |
| git_log | Recent commits |
| git_pull | Pull latest changes |
| git_diff | Show uncommitted changes |

## Phase 2: Memory System

Implemented a two-tier memory architecture:

### Hot Memory: Redis
- **Purpose:** Conversation history caching
- **TTL:** 4 hours
- **Capacity:** 20 message pairs per session
- **Port:** 6379

### Cold Memory: Qdrant Vector DB
- **Purpose:** Semantic search for high-signal interactions
- **Embeddings:** Ollama (nomic-embed-text, 768 dimensions)
- **Fallback:** OpenAI embeddings if Ollama unavailable
- **Port:** 6333

### Memory Manager
Unified interface that orchestrates both tiers:
\`\`\`python
class MemoryManager:
    def add_turn(session_id, role, content, store_in_cold=False)
    def get_history(session_id, limit=20)
    def search_memories(query, session_id=None, limit=5)
    def clear_session(session_id)
\`\`\`

### Local Embeddings with Ollama
Instead of requiring an OpenAI API key, embeddings are generated locally:
\`\`\`bash
ollama pull nomic-embed-text
# Now embeddings are 100% local, no external API needed
\`\`\`

## Phase 3: Observability

Full metrics and monitoring stack:

### Prometheus (port 9090)
- Scrapes 18 targets every 15 seconds
- 30-day retention
- Custom brain metrics

### Grafana (port 3030)
- Pre-configured datasource
- Portfolio overview dashboard
- App health panels

### Custom Metrics
\`\`\`python
# observability/metrics.py
skill_executions = Counter('brain_skill_executions_total', ...)
skill_duration = Histogram('brain_skill_duration_seconds', ...)
apps_status = Gauge('brain_apps_up', ...)
tasks_pending = Gauge('brain_tasks_pending', ...)
\`\`\`

## Phase 4: REST API

FastAPI application providing programmatic access:

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/status | System overview |
| GET | /api/health | Quick health check |
| GET | /api/skills | List all skills |
| POST | /api/skills/{name}/execute | Run a skill |
| GET | /api/apps | List all apps |
| GET | /api/apps/health | Check all app health |
| POST | /api/apps/{name}/restart | Restart container |
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/{id} | Update task |
| GET | /api/memory/status | Memory system status |
| POST | /api/memory/search | Semantic search |

### Example Usage
\`\`\`bash
# Get system status
curl http://localhost:8000/api/status

# Run a skill
curl -X POST http://localhost:8000/api/skills/app_health/execute

# Search memories
curl -X POST http://localhost:8000/api/memory/search \\
  -H "Content-Type: application/json" \\
  -d '{"query": "deployment issues", "limit": 5}'
\`\`\`

## Brain CLI Updates

The brain CLI now includes commands for all new systems:

\`\`\`bash
# Skills
brain skill list              # List all 15 skills
brain skill run <name>        # Execute a skill
brain skill info <name>       # Show skill details

# Memory
brain memory status           # Redis + Qdrant status
brain memory test             # Test store and search
brain memory clear <session>  # Clear session memory

# Metrics
brain metrics status          # Check Prometheus/Grafana
brain metrics urls            # Show dashboard URLs
\`\`\`

## Current Status

\`\`\`
Services: All UP
├── Portfolio: up
├── Redis: up (1.11M used)
├── Qdrant: up (768-dim vectors)
├── Prometheus: up
└── Grafana: up

Skills: 15 total, 15 available
Docker: 23 containers running
Embeddings: Ollama (local)
API: http://localhost:8000
\`\`\`

## What's Next

- Add more skills (email, calendar, notifications)
- Grafana alerting rules
- Nginx proxy for API endpoint
- Explore Paperclip for agent orchestration

## Key Takeaways

1. **Local-first:** Using Ollama for embeddings eliminates external API dependencies
2. **Graceful degradation:** Memory system works even if Redis or Qdrant are down
3. **Skills are modular:** Easy to add new capabilities without touching core code
4. **Observability matters:** Prometheus + Grafana give real-time visibility

This upgrade transforms the portfolio from a simple CLI tool into a full AI brain with memory, skills, and programmatic access. The foundation is now in place for more advanced automation and agent capabilities.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-04-01',
    readTime: '10 min read',
    category: 'devops',
    tags: ['Infrastructure', 'Skills', 'Memory', 'Redis', 'Qdrant', 'Prometheus', 'Grafana', 'FastAPI', 'Ollama', 'AI'],
    featured: true
  },
  {
    id: 'session-2026-03-17',
    title: 'Brain CLI, Blog System Expansion, and Session Automation',
    excerpt: 'Major infrastructure day: Built the brain CLI command center, expanded blog with 24 posts, and added session automation workflow.',
    content: `
# Session: 2026-03-17

## Summary
A productive infrastructure session focused on building automation tools and expanding the documentation system.

## Accomplishments

### Brain CLI Command Center
Built a comprehensive Python CLI tool for portfolio management:
- **brain status** - Portfolio health at a glance
- **brain apps health** - Check all 25 apps across 3 categories
- **brain task add/list/done** - SQLite-backed task tracking
- **brain session start/end** - Automated session documentation workflow
- **brain deploy/backup** - One-command operations

### Blog System Expansion
Expanded the blog from 6 posts to 24 posts:
- Added **Sessions** category for work documentation
- Added **Scripts** category with downloadable attachments
- Added **Docs** category for technical documentation
- Converted all 10 session markdown files to blog posts
- Created 6 script documentation posts with download buttons

### Session Automation Workflow
Built end-to-end automation for documentation:
- \`brain session start\` - Begins tracking time and tasks
- \`brain session end "title"\` - Auto-generates blog post, builds, deploys, commits, and pushes
- Captures completed tasks and git commits during session
- Posts automatically appear on /blog under Sessions category

### Other Fixes
- Fixed carousel left-edge clipping issue with padding adjustment
- Updated CLAUDE.md with brain CLI documentation
- Created TELOS personal context system (mission, goals, beliefs)

## Technical Details
- Python CLI with subprocess, SQLite, and socket port checking
- 25 apps tracked: 12 finished, 7 testing, 4 upgrading
- Blog uses React TypeScript with category filtering
- Session workflow integrates git, npm build, and nginx reload

## Commits
- feat: Add session workflow to brain CLI
- feat: Add 24 blog posts - sessions, scripts with downloads, and docs
- docs: Update CLAUDE.md with brain CLI and current state
- fix: Resolve carousel left edge clipping issue
    `,
    author: 'Isayah Young-Burke',
    date: '2026-03-17',
    readTime: '5 min read',
    category: 'sessions',
    tags: ["Session", "CLI", "Automation", "Infrastructure", "Development"]
  },
  {
    id: 'session-2026-03-17',
    title: 'Building a Portfolio Brain CLI',
    excerpt: 'How I created a unified command-line interface to manage my portfolio infrastructure, track tasks, and monitor 25 apps.',
    content: `
# Building a Portfolio Brain CLI

Today I built a unified command-line interface called "brain" to manage my portfolio infrastructure. Here's what I accomplished and why.

## The Problem

Managing a portfolio with 25 apps across different states (finished, testing, upgrading) was becoming unwieldy:
- Multiple scripts scattered in /scripts/
- No central way to check health of all apps
- Tasks getting lost in my head
- Context switching between sessions

## The Solution: brain.py

A single Python CLI that wraps everything:

\`\`\`bash
brain status              # Overview at a glance
brain apps health         # Check all 25 apps
brain task add "title"    # Track tasks in SQLite
brain task list           # View pending work
brain deploy              # Deploy changes
\`\`\`

## Key Features

### 1. App Health Monitoring
The CLI tracks 25 apps across 3 categories and can check port availability instantly:
- **Finished (13)**: Production-ready apps
- **Testing (8)**: Beta apps on ports 3010-3018
- **Upgrading (4)**: In development

### 2. SQLite Task Tracking
No more losing ideas. Tasks persist in a local database:
- Add tasks with a single command
- Mark complete when done
- View all or just pending

### 3. TELOS Context
Borrowed from the Sentinel project - a /telos directory with:
- mission.md - Who I am
- goals.md - What I'm working toward
- beliefs.md - Core principles

## Other Wins Today

- Fixed the carousel left-edge clipping issue
- Updated CLAUDE.md with full brain CLI documentation
- Committed everything to GitHub

## What's Next

- Add session logging to brain CLI
- Deploy remaining testing apps
- Music streaming setup

The brain CLI has already made managing the portfolio feel more intentional and organized. One command to rule them all.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-03-17',
    readTime: '4 min read',
    category: 'sessions',
    tags: ['CLI', 'Python', 'Infrastructure', 'Automation'],
    featured: true
  },
  {
    id: 'session-2026-03-16',
    title: 'Sentinel Analysis & Carousel Debugging',
    excerpt: 'Analyzed the Sentinel AI assistant architecture and documented a stubborn carousel clipping bug.',
    content: `
# Session: 2026-03-16

## Summary
Worked on two main areas: fixing a carousel layout issue and analyzing the Sentinel repo for infrastructure inspiration.

## Carousel Layout Issue
The left edge of Featured Apps and Projects carousels was being clipped. We tried several approaches:
- Adding margin/padding to main container
- Removing centering from containers
- Adding padding to carousel wrapper

**Root cause identified:** The shadcn Carousel component uses \`-ml-4\` negative margin combined with \`overflow-hidden\`, which clips the left edge.

## Sentinel Analysis
Cloned and analyzed the Sentinel autonomous AI assistant. Key findings:
- 48 autonomous skills (deploy, email, calendar, etc.)
- Multi-interface access (Slack, CLI, REST API)
- Memory layers (Redis, Postgres, Neo4j)
- TELOS personal context system

Created a 5-phase adoption plan to bring key concepts to the portfolio.

## Documents Created
- \`docs/CAROUSEL_LAYOUT_BRAINSTORM.md\`
- \`docs/SENTINEL_COMPARISON_AUDIT.md\`
- \`docs/SENTINEL_ADOPTION_PLAN.md\`
    `,
    author: 'Isayah Young-Burke',
    date: '2026-03-16',
    readTime: '4 min read',
    category: 'sessions',
    tags: ['Debugging', 'Architecture', 'AI', 'Sentinel']
  },
  {
    id: 'session-2026-02-16',
    title: 'S3 Music Upload & Branding Cleanup',
    excerpt: 'Built an S3 upload script for music, integrated 25 tracks, and removed all Lovable branding from apps.',
    content: `
# Session: 2026-02-16

## Summary
Big session focused on music integration and branding cleanup.

## S3 Music Upload Script
Created a Python script to batch upload music to IONOS S3:
- Supports MP3, WAV, FLAC, M4A, AAC, OGG, WMA
- Auto-generates public URLs
- Outputs TypeScript snippets for music.ts

## PH Pool Beat Tape
Integrated 25 tracks from the PH Pool - Ambiance Beat Tape:
- All tracks uploaded to S3
- Music player now has real audio playback
- Progress bar with seeking, volume control, repeat

## Branding Cleanup
Removed Lovable branding from 9 apps across 10 files:
- darkflow-mind-mapper
- bh-ai-79
- got-hired-ai
- losk
- gmat-mastery-suite
- sop-ai-beta
- ask-hr-beta
- sensei-ai-io

Replaced with ZayLegend branding (og:image, twitter:site, author).
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-16',
    readTime: '5 min read',
    category: 'sessions',
    tags: ['S3', 'Music', 'Branding', 'Python']
  },
  {
    id: 'session-2026-02-15',
    title: 'Eternal Vibe: Audio Analysis & SFX Layer',
    excerpt: 'Built a Python audio analysis backend and synthesized SFX layer for Chord Genesis.',
    content: `
# Session: 2026-02-15

## Summary
Built the foundation for the "Eternal Vibe" music production system in Chord Genesis.

## Python Audio Analysis Backend
Created a FastAPI backend at port 3020 that analyzes uploaded audio:
- BPM and beat strength detection
- Key detection with confidence score
- Energy level classification
- Mood estimation
- Automatic ElevenLabs prompt generation

## SFX Layer
Built a Web Audio API synthesized sound effects layer:

| Category | Effects |
|----------|---------|
| Ambient | Warm Pad, Vinyl Crackle, Soft Rain, Space Drift |
| Risers | Filter Sweep, Noise Rise, Pitch Rise |
| Impacts | Deep Boom, Cinematic Hit, Sub Drop |
| Transitions | Whoosh, Glitch Stutter, Tape Stop |

## Architecture
\`\`\`
Frontend (React) → Port 3001
Backend (FastAPI) → Port 3020
\`\`\`

The Style Replicator lets you upload a reference track, extract its musical features, and generate matching prompts for AI music generation.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-15',
    readTime: '6 min read',
    category: 'sessions',
    tags: ['Audio', 'Python', 'FastAPI', 'Web Audio API', 'Chord Genesis']
  },
  {
    id: 'session-2026-02-14',
    title: 'Eternal Vibe Research Phase',
    excerpt: 'Deep research into ElevenLabs, librosa audio analysis, and open source music generation.',
    content: `
# Session: 2026-02-14

## Summary
Completed research phase for Chord Genesis enhancement and the Eternal Vibe concept.

## Research Areas

### ElevenLabs Capabilities
- Music generation up to 5 minutes
- Sound effects API with looping
- Inpainting API for fine-grained editing
- Stem separation
- Video generation with lip-sync

### Audio Analysis (Librosa)
- Feature extraction: tempo, key, chroma, MFCCs
- Style profile generation from reference tracks
- Requires Python backend

### Open Source Music Generation
- **ACE-Step 1.5**: Local GPU-based, "open source Suno killer"
- **HeartMuLa**: Offline song generation with vocals
- No official Suno API yet

## Next Steps Identified
1. Build Python Audio Analysis Service (foundation)
2. Add SFX Layer to Chord Genesis (quick win)
3. Explore ACE-Step for local generation
4. Research binaural beats for therapeutic music
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-14',
    readTime: '4 min read',
    category: 'sessions',
    tags: ['Research', 'ElevenLabs', 'Audio', 'AI Music']
  },
  {
    id: 'session-2026-02-02',
    title: 'Testing Apps Deployment Complete',
    excerpt: 'Deployed all remaining testing apps and optimized Chord Genesis bundle size by 96%.',
    content: `
# Session: 2026-02-02

## Summary
Deployed all remaining testing apps and committed major changes.

## Testing Apps Deployed
All 7 testing apps now live:

| App | Port | Status |
|-----|------|--------|
| darkflow-mind-mapper | 3010 | Running |
| gmat-mastery-suite | 3012 | Running |
| losk | 3013 | Running |
| got-hired-ai | 3014 | Running |
| bh-ai-79 | 3015 | Running |
| purple-lotus | 3016 | Running |
| zen-tot | 3017 | Running |

## Performance Optimization
Chord Genesis bundle size reduction:
- **Before:** 2.4MB single bundle
- **After:** 94KB main + 141KB React + 2.2MB ElevenLabs (lazy loaded)
- **Result:** 96% reduction in initial load

## Git Commits
- Portfolio: 36 files changed, 4641 insertions
- Added Services page, Blog page, RPG UI styling
- Accessibility improvements (ARIA, skip links, focus states)
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-02',
    readTime: '4 min read',
    category: 'sessions',
    tags: ['Deployment', 'Docker', 'Performance', 'Testing Apps']
  },
  {
    id: 'session-2026-01-31',
    title: 'Services, Blog & RPG UI Theme',
    excerpt: 'Created Services and Blog pages from scratch and applied FF7-inspired RPG styling.',
    content: `
# Session: 2026-01-31

## Summary
Major feature additions - created Services and Blog pages, plus RPG UI theming.

## Issues Identified
Services and Blog pages were never created - they needed to be built from scratch.

## What Was Built

### Services Page
- 11 services across 4 categories
- Responsive grid layout
- Service detail modals

### Blog Page
- Search functionality
- Category filtering
- 6 sample posts
- Individual post view

### RPG UI Theme
Inspired by Final Fantasy VII:
- Glass panel effects with glow
- Sound effects toggle
- Theme toggle (dark/light)
- Custom loading animations

## Chord Genesis Enhancements
- Added "City Pop Bounce" genre
- Artist/Producer style presets (J Dilla, Pharrell, Metro Boomin)
- Advanced controls wired to music generation
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-31',
    readTime: '5 min read',
    category: 'sessions',
    tags: ['UI/UX', 'Blog', 'Services', 'RPG Theme']
  },
  {
    id: 'session-2026-01-30',
    title: 'Major Portfolio Overhaul - 5 Phases',
    excerpt: 'Completed all 5 roadmap phases: content fixes, app categories, music section, CI/CD, and documentation.',
    content: `
# Session: 2026-01-30

## Summary
Major portfolio overhaul completing all 5 phases of the roadmap.

## Phase 1: Content Fixes
Changed "Infrastructure & Cloud Consultant" → "Infrastructure & AI Consultant"

## Phase 2: App Category System
- Restructured apps.ts with status field (finished/testing/upgrading)
- Cloned 11 new repos
- Updated Apps page with collapsible category sections
- **Total:** 12 Finished, 7 Testing, 4 Upgrading = 23 Apps

## Phase 3: Music Section
- Added Music link to sidebar
- Created music.ts data structure
- Built /music page with player
- Play/pause, skip, shuffle, repeat controls

## Phase 4: CI/CD & Infrastructure
- GitHub Actions workflow
- deploy.sh, backup.sh, github-backup.sh scripts
- session-context.sh for status on login

## Phase 5: Documentation
- Comprehensive CLAUDE.md update
- Session logging system
- Updated PORTFOLIO_ROADMAP.md
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-30',
    readTime: '5 min read',
    category: 'sessions',
    tags: ['Portfolio', 'CI/CD', 'Music', 'Infrastructure'],
    featured: true
  },
  {
    id: 'session-2025-12-27-branding',
    title: 'Complete Branding Audit & Fix',
    excerpt: 'Comprehensive audit removing Lovable/GPT Engineer branding from all 6 portfolio apps.',
    content: `
# Session: 2025-12-27

## Overview
Comprehensive branding audit across all applications on zaylegend.com.

## Critical Issues Found
6 apps had external branding issues:
1. **Game-Hub** - GPT Engineer script + Lovable branding
2. **DJ-Visualizer** - External domain references + Umami analytics
3. **Fineline** - Lovable branding in dist files
4. **Chord-Genesis** - Old IONOS references
5. **Voice-Assistant** - "IONOS Assistant" branding
6. **SpriteGen** - Mixed branding in meta tags

## Actions Taken
For each app:
- Removed GPT Engineer scripts
- Updated titles to "[App Name] - ZayLegend"
- Fixed Open Graph and Twitter meta tags
- Updated author attribution
- Rebuilt and redeployed containers

## Branding Standards Applied
- **Title:** \`[App Name] - ZayLegend\`
- **Author:** \`Isayah Young Burke - zaylegend.com\`
- **Twitter:** \`@zaylegend\`
- **OG Image:** \`https://zaylegend.com/favicon.ico\`

## Result
100% complete - all 6 apps now show consistent ZayLegend branding.
    `,
    author: 'Isayah Young-Burke',
    date: '2025-12-27',
    readTime: '5 min read',
    category: 'sessions',
    tags: ['Branding', 'Docker', 'Meta Tags', 'Audit']
  },
  {
    id: 'session-2025-12-27-zenreset',
    title: 'Zen Reset Branding Fix',
    excerpt: 'Fixed Zen Reset app showing Lovable branding in mobile link previews.',
    content: `
# Session: 2025-12-27 - Zen Reset

## Issue
Zen Reset meditation app was showing Lovable branding when sharing links on mobile.

## Root Cause
- GPT Engineer script tag in HTML
- Open Graph meta tags pointing to Lovable images
- Docker container serving cached files
- Favicon references pointing to wrong assets

## Solution
1. Removed GPT Engineer script from index.html
2. Updated Open Graph image to ZayLegend favicon
3. Updated Twitter card meta tags
4. Fixed favicon in Docker container

## Key Learning
The app runs in a Docker container on port 8081. Updates need to be deployed to the container:
\`\`\`bash
docker cp /path/to/file zen-reset-new:/usr/share/nginx/html/
\`\`\`

Mobile link preview caching may take 24-48 hours to refresh.
    `,
    author: 'Isayah Young-Burke',
    date: '2025-12-27',
    readTime: '3 min read',
    category: 'sessions',
    tags: ['Docker', 'Branding', 'Zen Reset', 'Mobile']
  },
  {
    id: 'brain-cli-docs',
    title: 'Brain CLI Documentation',
    excerpt: 'Complete reference for the brain command-line interface - commands, usage, and examples.',
    content: `
# Brain CLI Documentation

The brain CLI is the central command center for managing the portfolio infrastructure.

## Installation

The CLI is automatically available at \`/usr/local/bin/brain\` via symlink to \`/var/www/zaylegend/brain.py\`.

## Commands

### Status
\`\`\`bash
brain status
\`\`\`
Shows:
- Nginx status
- Docker container count
- Git status (uncommitted files, branch, last commit)
- Disk usage
- Pending tasks count
- Quick health check of critical apps

### Apps Management
\`\`\`bash
brain apps              # List all apps by category
brain apps health       # Check UP/DOWN status of all apps
brain apps restart <n>  # Restart a container by name
\`\`\`

### Task Tracking
\`\`\`bash
brain task add "title"  # Add a new task
brain task list         # Show pending tasks
brain task done <id>    # Mark task as complete
brain task all          # Show all tasks (including completed)
\`\`\`

### Deployment
\`\`\`bash
brain deploy            # Run deployment script
brain backup            # Run backup script
\`\`\`

## Database

Tasks are stored in \`brain.db\` (SQLite) with the following schema:

\`\`\`sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 3,
    created_at TIMESTAMP,
    completed_at TIMESTAMP
);
\`\`\`

## App Registry

The CLI tracks 25 apps:

| Category | Count | Ports |
|----------|-------|-------|
| Finished | 13 | 8080-8081, 3001-3009 |
| Testing | 8 | 3010-3018 |
| Upgrading | 4 | Not deployed |

## Examples

Check if any apps are down:
\`\`\`bash
brain apps health | grep DOWN
\`\`\`

Add and complete a task:
\`\`\`bash
brain task add "Fix carousel layout"
# ... do the work ...
brain task done 1
\`\`\`

Quick status check:
\`\`\`bash
brain status
\`\`\`
    `,
    author: 'Isayah Young-Burke',
    date: '2026-03-17',
    readTime: '3 min read',
    category: 'docs',
    tags: ['CLI', 'Documentation', 'Reference', 'Brain']
  },
  {
    id: 'building-ai-agents-2026',
    title: 'Building AI Agents in 2026: A Practical Guide',
    excerpt: 'Explore the latest techniques for building intelligent AI agents using modern LLM frameworks and best practices for production deployment.',
    content: `
# Building AI Agents in 2026

The landscape of AI agent development has evolved dramatically. In this guide, we'll explore practical approaches to building intelligent agents that can reason, plan, and execute complex tasks.

## Key Components

### 1. Reasoning Engine
Modern agents use chain-of-thought reasoning to break down complex problems into manageable steps.

### 2. Memory Systems
Long-term and short-term memory systems allow agents to maintain context and learn from interactions.

### 3. Tool Integration
Agents become powerful when they can use external tools - APIs, databases, and other services.

## Best Practices

- Start with clear goal definitions
- Implement robust error handling
- Use structured outputs for reliability
- Monitor and iterate on agent behavior

The future of AI agents is collaborative, with multiple specialized agents working together to solve complex problems.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-25',
    readTime: '8 min read',
    category: 'ai',
    tags: ['AI', 'Agents', 'LLM', 'Development'],
    featured: true
  },
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization: Strategies That Actually Work',
    excerpt: 'Learn proven strategies for reducing cloud costs without sacrificing performance or reliability.',
    content: `
# Cloud Cost Optimization Strategies

Cloud costs can quickly spiral out of control. Here's how to keep them in check while maintaining performance.

## Immediate Wins

1. **Right-sizing instances** - Most workloads are over-provisioned
2. **Reserved capacity** - Commit to predictable workloads
3. **Spot instances** - For fault-tolerant workloads

## Long-term Strategies

- Implement auto-scaling policies
- Use serverless where appropriate
- Regularly audit unused resources
- Set up cost alerts and budgets

The key is continuous monitoring and optimization, not one-time fixes.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-20',
    readTime: '6 min read',
    category: 'cloud',
    tags: ['Cloud', 'AWS', 'Cost Optimization', 'Infrastructure']
  },
  {
    id: 'cicd-best-practices',
    title: 'CI/CD Pipeline Best Practices for 2026',
    excerpt: 'Modern deployment pipelines that reduce time-to-production while maintaining quality and security.',
    content: `
# CI/CD Best Practices

Continuous Integration and Deployment are fundamental to modern software delivery. Here's how to do it right.

## Pipeline Architecture

### Build Stage
- Fast feedback loops
- Parallel test execution
- Artifact caching

### Deploy Stage
- Blue-green deployments
- Canary releases
- Automated rollbacks

## Security Integration

Security should be built into every stage:
- SAST scanning
- Dependency audits
- Container scanning
- Runtime protection

Remember: the goal is to ship faster with more confidence, not just to ship faster.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-15',
    readTime: '7 min read',
    category: 'devops',
    tags: ['DevOps', 'CI/CD', 'Automation', 'GitHub Actions']
  },
  {
    id: 'audio-engineering-cloud',
    title: 'Audio Engineering in the Cloud Era',
    excerpt: 'How cloud technology is transforming music production and audio engineering workflows.',
    content: `
# Audio Engineering in the Cloud

The intersection of audio engineering and cloud technology opens new possibilities for collaboration and production.

## Cloud-Based Workflows

- Remote collaboration in real-time
- Distributed rendering for complex projects
- Version control for audio assets
- Scalable processing power

## Tools and Platforms

Modern audio engineers leverage cloud infrastructure for:
- Large-scale sample libraries
- AI-assisted mixing and mastering
- Global distribution pipelines
- Backup and archival systems

The future is hybrid - combining local creativity with cloud scalability.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-10',
    readTime: '5 min read',
    category: 'creative',
    tags: ['Audio', 'Cloud', 'Music Production', 'Engineering']
  },
  {
    id: 'docker-for-developers',
    title: 'Docker Essentials: A Developer\'s Guide',
    excerpt: 'Everything you need to know about containerization for modern application development.',
    content: `
# Docker Essentials

Containers have revolutionized how we build, ship, and run applications. This guide covers the essentials.

## Core Concepts

1. **Images** - Blueprints for containers
2. **Containers** - Running instances
3. **Volumes** - Persistent data storage
4. **Networks** - Container communication

## Best Practices

- Use multi-stage builds
- Keep images small
- Don't run as root
- Use .dockerignore
- Tag images properly

## Docker Compose

For multi-container applications:
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
\`\`\`

Mastering Docker is essential for modern development workflows.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-05',
    readTime: '10 min read',
    category: 'tutorial',
    tags: ['Docker', 'Containers', 'DevOps', 'Tutorial']
  },
  {
    id: 'future-of-work-ai',
    title: 'The Future of Work: AI as a Collaborator',
    excerpt: 'How AI is reshaping the workplace and what it means for professionals in tech and creative fields.',
    content: `
# AI as a Collaborator

We're witnessing a fundamental shift in how humans and AI work together. Here are my observations.

## The Collaborative Model

AI isn't replacing workers - it's augmenting capabilities:
- Code generation and review
- Creative ideation
- Data analysis
- Research acceleration

## Adapting to Change

Professionals should:
1. Learn to prompt effectively
2. Understand AI capabilities and limits
3. Focus on uniquely human skills
4. Embrace continuous learning

## The Opportunity

Those who master AI collaboration will have a significant competitive advantage. The key is to see AI as a powerful tool in your arsenal, not a threat.

The future belongs to those who can effectively orchestrate human creativity with AI capabilities.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-01',
    readTime: '6 min read',
    category: 'insights',
    tags: ['AI', 'Future of Work', 'Insights', 'Career']
  },
  // ============ SCRIPTS ============
  {
    id: 'script-deploy',
    title: 'Deploy Script: One-Command Deployment',
    excerpt: 'A bash script that pulls, builds, and deploys the portfolio with automatic backups.',
    content: `
# Deploy Script

## The Problem
Deploying changes required multiple manual steps:
1. SSH into server
2. Pull latest changes
3. Install dependencies
4. Build the project
5. Hope nothing breaks

## The Solution
A single script that handles everything:
\`\`\`bash
./scripts/deploy.sh
\`\`\`

## What It Does
1. **Backs up current build** - Creates timestamped tarball of dist/
2. **Pulls from GitHub** - Fetches and resets to origin/main
3. **Installs dependencies** - Runs npm ci
4. **Builds production** - Runs npm run build
5. **Verifies success** - Checks dist/index.html exists

## Key Features
- Automatic backup rotation (keeps last 5)
- Color-coded output
- Logging to deploy.log
- Exit on error (set -e)

## What I Learned
- Always backup before deploying
- Use \`npm ci\` instead of \`npm install\` in CI/CD
- Color output makes scripts more readable
- Logging helps debug failed deploys
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-30',
    readTime: '3 min read',
    category: 'scripts',
    tags: ['Bash', 'Deployment', 'Automation', 'DevOps'],
    downloadUrl: '/downloads/scripts/deploy.sh'
  },
  {
    id: 'script-backup',
    title: 'Backup Script: Automated Local Backups',
    excerpt: 'Automated backup script with rotation - keeps your portfolio safe.',
    content: `
# Backup Script

## The Problem
No systematic backups. If something broke, recovery was painful.

## The Solution
\`\`\`bash
./scripts/backup.sh
\`\`\`

## What It Does
1. Creates timestamped backup of:
   - Source code (src/)
   - Configuration files
   - Current build (dist/)
2. Compresses to .tar.gz
3. Rotates old backups (keeps last 10)
4. Reports backup size

## Backup Locations
- Local: \`/var/www/zaylegend/backups/\`
- Includes date in filename: \`backup_20260317_120000.tar.gz\`

## What I Learned
- Regular backups are essential
- Rotation prevents disk filling up
- Compression saves significant space
- Include both source and build
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-30',
    readTime: '2 min read',
    category: 'scripts',
    tags: ['Bash', 'Backup', 'Automation'],
    downloadUrl: '/downloads/scripts/backup.sh'
  },
  {
    id: 'script-session-context',
    title: 'Session Context: Status on SSH Login',
    excerpt: 'Shows portfolio status automatically when you SSH into the server.',
    content: `
# Session Context Script

## The Problem
Every time I SSH into the server, I had to manually check:
- Git status
- Docker containers
- Pending tasks
- Recently modified files

## The Solution
Auto-run on login:
\`\`\`bash
# Added to ~/.bashrc
source /var/www/zaylegend/scripts/session-context.sh
\`\`\`

## What It Shows
\`\`\`
╔══════════════════════════════════════════╗
║  ZAYLEGEND PORTFOLIO - SESSION CONTEXT   ║
╠══════════════════════════════════════════╣
║  2026-03-17 12:00:00                     ║
╚══════════════════════════════════════════╝

▶ GIT STATUS:
  Branch: main | Commit: abc123 | Uncommitted: 3 files

▶ RECENTLY MODIFIED (last 24h):
  Apps.tsx
  music.ts

▶ DOCKER CONTAINERS:
  17 running, 0 stopped

▶ PENDING TASKS:
  - Fix carousel layout
  - Deploy testing apps
\`\`\`

## What I Learned
- Context switching wastes time
- Immediate visibility = faster work
- Sourcing scripts in .bashrc is powerful
- ASCII art makes things fun
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-30',
    readTime: '3 min read',
    category: 'scripts',
    tags: ['Bash', 'Productivity', 'SSH', 'Automation'],
    downloadUrl: '/downloads/scripts/session-context.sh'
  },
  {
    id: 'script-deploy-testing-app',
    title: 'Deploy Testing App: Full App Deployment',
    excerpt: 'Automates deploying a new testing app with Docker, nginx config, and port allocation.',
    content: `
# Deploy Testing App Script

## The Problem
Deploying a new testing app required:
1. Clone the repo
2. Fix vite.config.ts base path
3. Fix BrowserRouter basename
4. Build the app
5. Create Dockerfile
6. Build Docker image
7. Run container
8. Update nginx config
9. Reload nginx

## The Solution
\`\`\`bash
./scripts/deploy-testing-app.sh <folder-name> <url-slug> <port>
\`\`\`

## Example
\`\`\`bash
./scripts/deploy-testing-app.sh my-new-app my-app 3018
\`\`\`

## What It Does
1. Validates the app folder exists
2. Updates vite.config.ts with correct base path
3. Updates BrowserRouter basename
4. Runs npm install and build
5. Creates Dockerfile.simple for nginx serving
6. Builds and runs Docker container
7. Generates nginx location block
8. Reloads nginx

## Critical React Router Fix
Two things MUST be set for SPA routing:
1. \`vite.config.ts\`: \`base: '/url-slug/'\`
2. \`<BrowserRouter basename="/url-slug">\`

## What I Learned
- React Router apps need special handling for subpaths
- Automating complex deploys saves hours
- Always verify with curl after deploy
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-02',
    readTime: '4 min read',
    category: 'scripts',
    tags: ['Bash', 'Docker', 'Nginx', 'Deployment'],
    downloadUrl: '/downloads/scripts/deploy-testing-app.sh'
  },
  {
    id: 'script-upload-music-s3',
    title: 'S3 Music Upload: Batch Upload to IONOS',
    excerpt: 'Python script to batch upload music files to IONOS S3 with auto-generated URLs.',
    content: `
# S3 Music Upload Script

## The Problem
Needed to upload 25 music tracks to S3 and get public URLs for each.

## The Solution
\`\`\`bash
python3 scripts/upload-music-to-s3.py ~/Music/album-folder/
\`\`\`

## What It Does
1. Scans folder for audio files (.mp3, .wav, .flac, etc.)
2. Uploads each to IONOS S3 bucket
3. Sets public-read ACL
4. Outputs TypeScript snippets for music.ts

## Example Output
\`\`\`typescript
{
  id: 'track-1',
  title: 'Abode',
  audioUrl: 'https://s3.ionoscloud.com/bucket/music/Abode.mp3'
}
\`\`\`

## Features
- Dry run mode (\`--dry-run\`)
- Progress indicator
- Error handling with retry
- Supports: MP3, WAV, FLAC, M4A, AAC, OGG

## Configuration
Uses \`.env.s3\` for credentials:
\`\`\`
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_BUCKET=portfoliowebsite
S3_ENDPOINT=https://s3.ionoscloud.com
\`\`\`

## What I Learned
- boto3 makes S3 operations simple
- Always use environment variables for credentials
- Dry run mode prevents accidents
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-16',
    readTime: '3 min read',
    category: 'scripts',
    tags: ['Python', 'S3', 'AWS', 'Music', 'Automation'],
    downloadUrl: '/downloads/scripts/upload-music-to-s3.py'
  },
  {
    id: 'script-rebuild-all-apps',
    title: 'Rebuild All Apps: Mass Docker Rebuild',
    excerpt: 'Rebuilds and redeploys all Docker apps when major changes are needed.',
    content: `
# Rebuild All Apps Script

## The Problem
After a major change (like branding updates), needed to rebuild all Docker containers.

## The Solution
\`\`\`bash
./scripts/rebuild-all-apps.sh
\`\`\`

## What It Does
For each app in the apps directory:
1. Stops the running container
2. Removes the old container
3. Rebuilds the Docker image
4. Starts new container with correct port
5. Verifies health with curl

## Apps Rebuilt
- chord-genesis (3001)
- fineline (3003)
- game-hub (3004)
- dj-visualizer (3005)
- sprite-gen (3006)
- voice-assistant (3007)
- And all testing apps...

## Safety Features
- Confirms before starting
- Logs each step
- Continues on single app failure
- Reports summary at end

## What I Learned
- Mass operations need confirmation prompts
- Parallel rebuilds can overwhelm the system
- Always verify each app after rebuild
    `,
    author: 'Isayah Young-Burke',
    date: '2026-02-26',
    readTime: '3 min read',
    category: 'scripts',
    tags: ['Bash', 'Docker', 'Mass Operations', 'DevOps'],
    downloadUrl: '/downloads/scripts/rebuild-all-apps.sh'
  }
];

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getRecentPosts = (count: number = 3): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};
