# CLAUDE.md - Portfolio Infrastructure Context

> This file helps Claude understand the portfolio infrastructure for optimal assistance.
> Last Updated: 2026-01-30

---

## Project Overview

**Owner:** Isayah Young-Burke
**Role:** Infrastructure & AI Consultant
**Domain:** Portfolio website showcasing cloud, AI, and creative projects

---

## Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Routing:** React Router v6
- **Build:** Vite with SWC
- **Package Manager:** Bun

### Directory Structure
```
/var/www/zaylegend/           # Main portfolio
├── src/
│   ├── components/           # UI components (Hero, About, Apps, Projects, Contact)
│   ├── pages/                # Route pages (Index, Apps, ProjectDetail)
│   ├── data/                 # Content data (projects.ts, apps.ts, skills.ts)
│   └── config/               # Asset URLs (IONOS S3)
├── apps/                     # Sub-applications
│   ├── chord-genesis/        # AI music composition (port 3001)
│   ├── dj-visualizer/        # Gesture-controlled DJ (port 3005)
│   ├── fineline/             # Timeline journal (port 3003)
│   ├── game-hub/             # Mini-games platform (port 3004)
│   ├── spritegen/            # AI sprite generator (port 3006)
│   ├── voice-assistant/      # Voice AI (port 3007)
│   ├── knowledge-base/       # Knowledge repository (port 3008)
│   ├── contentforge/         # Creative content platform (NOT YET ON PORTFOLIO)
│   ├── zen-reset/            # Meditation app (Docker, port 8081)
│   ├── testing/              # Apps in testing phase
│   └── upgrades/             # Apps being upgraded
├── scripts/                  # Automation scripts
├── dist/                     # Production build
└── PORTFOLIO_ROADMAP.md      # Active task list
```

### Port Mapping
| Port | Application |
|------|-------------|
| 8080 | Main Portfolio |
| 8081 | Zen Reset (Docker) |
| 3001 | Chord Genesis |
| 3003 | Fineline |
| 3004 | Game Hub |
| 3005 | DJ Visualizer |
| 3006 | Sprite Gen |
| 3007 | Voice Assistant |
| 3008 | Knowledge Base |

---

## Key Files to Know

### Content Updates
- `src/data/projects.ts` - Portfolio projects (30+ entries)
- `src/data/apps.ts` - Featured applications
- `src/data/skills.ts` - Skill ratings and categories
- `src/config/assets.ts` - IONOS S3 image URLs

### Components
- `src/components/Hero.tsx` - Landing section with title
- `src/components/About.tsx` - Bio and skills
- `src/components/Apps.tsx` - Featured apps showcase
- `src/components/Projects.tsx` - Project grid with filtering
- `src/components/Sidebar.tsx` - Navigation sidebar

### Configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Theme and styling
- `docker-compose.yml` - Container orchestration

---

## Current Development Context

### Active Roadmap
See `/var/www/zaylegend/PORTFOLIO_ROADMAP.md` for current tasks including:
- Music section (new sidebar + /music page with player)
- Apps categorization (Finished/Testing/Upgrading)
- New apps integration
- CI/CD pipeline setup

### Apps in Testing (`/apps/testing/`)
- darkflow-mind-mapper - Mind mapping tool
- bh-ai-79 - AI application
- gmat-mastery-suite - Test prep suite
- losk - Light Novel Hub
- got-hired-ai - Resume + Cover Letter Builder
- zen-tot - TBD

### Apps Being Upgraded (`/apps/upgrades/`)
- Ashley-v3 - Cloud Provision Agent + 11Labs
- sensei-ai-io - Sales + Retention Assistant
- ask-hr-beta - AI HR Assistant

### Hidden Gem
**ContentForge** (`/apps/contentforge/`) - Full creative platform already built, not yet on portfolio. Combines sprite gen, story creation, voice synthesis, presentations.

---

## Patterns & Conventions

### Adding New Apps
1. Clone repo to `/apps/testing/` or appropriate category
2. Add entry to `src/data/apps.ts`
3. Configure nginx or add to docker-compose if needed
4. Update PORTFOLIO_ROADMAP.md

### Project Categories
- `cloud` - Cloud Infrastructure
- `hosting` - Web Hosting
- `art` - Art Curation
- `audio` - Audio Engineering
- `domain` - Domain Management
- `marketing` - Marketing/Design
- `ecommerce` - E-commerce

### Image Hosting
All images hosted on IONOS S3:
- Bucket: `portfoliowebsite`
- Endpoint: `https://s3.us-central-1.ionoscloud.com`
- Helper: `getAssetUrl(path)` in `src/config/assets.ts`

---

## Build & Deploy

```bash
# Development
bun run dev          # Start dev server on port 8080

# Production
bun run build        # Build to /dist
bun run preview      # Preview production build

# Docker apps
docker-compose up -d  # Start containerized apps
```

---

## Session Insights

### What Works Well
- shadcn/ui components integrate cleanly
- Vite builds are fast with SWC
- IONOS S3 for image hosting is reliable
- Docker for isolated app deployments

### Common Tasks
- Adding new projects: Edit `src/data/projects.ts`
- Adding new apps: Edit `src/data/apps.ts`, configure serving
- Updating bio/skills: Edit `src/components/About.tsx` or `src/data/skills.ts`

### Things to Remember
- Main portfolio runs on port 8080
- Always rebuild after content changes: `bun run build`
- Check nginx config at `/etc/nginx/sites-enabled/` for routing

---

## Future Plans

1. **Music Section** - New sidebar nav, dedicated /music page with audio player
2. **App Categories** - Separate Testing/Upgrading/Finished
3. **CI/CD** - Auto-deploy on git push
4. **Backup System** - Single repo backup of everything
5. **Login Context** - Script showing last session + next steps

---

## Quick Reference

| Action | Command/Location |
|--------|------------------|
| Edit projects | `src/data/projects.ts` |
| Edit apps | `src/data/apps.ts` |
| Edit skills | `src/data/skills.ts` |
| Edit hero text | `src/components/Hero.tsx` |
| Edit about | `src/components/About.tsx` |
| Add sidebar nav | `src/components/Sidebar.tsx` |
| Check roadmap | `PORTFOLIO_ROADMAP.md` |
| Rebuild | `bun run build` |
