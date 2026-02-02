# Portfolio Roadmap & Task Checklist

> Last Updated: 2026-01-31
> Status: Phases 1-6 Complete, Phase 7 In Progress

---

## Completed Phases

### Phase 1: Content Fixes ✅
- [x] Change "Infrastructure and Cloud Consultant" → "Infrastructure and AI Consultant"

### Phase 2: App Category System ✅
- [x] Clone 11 new repos to server
- [x] Restructure apps.ts with status field
- [x] Update Apps page with category sections (Finished/Testing/Upgrading)
- [x] Add ContentForge to portfolio
- [x] Configure nginx for ContentForge (port 3009)

### Phase 3: Music Section ✅
- [x] Add Music option to sidebar navigation
- [x] Create music.ts data structure
- [x] Build /music page with audio player
- [x] Add route in App.tsx
- [x] Fix SPA routing for /music page

### Phase 4: CI/CD & Infrastructure ✅
- [x] Create GitHub Actions workflow
- [x] Create deploy.sh script
- [x] Create backup.sh script
- [x] Create github-backup.sh script
- [x] Enhance session-context.sh
- [x] Add to ~/.bashrc for auto-load

### Phase 5: Documentation ✅
- [x] Update CLAUDE.md comprehensively
- [x] Create session logging system
- [x] Update PORTFOLIO_ROADMAP.md

### Phase 6: RPG UI Theme ✅ (2026-01-31)
- [x] Apply dark purple theme from sandbox
- [x] Add FF7-style panels and glow effects
- [x] Implement collapsible sidebar
- [x] Add theme toggle (dark/light)
- [x] Add sound effects toggle
- [x] Update Hero with grid background and text glow
- [x] Update About with RPG skill bars (AttributeBar, MateriaIndicator)
- [x] Remove emojis from app titles

### Phase 7: Testing Apps Deployment (In Progress)
- [x] Deploy darkflow-mind-mapper (port 3010)
- [x] Deploy gmat-mastery-suite (port 3012)
- [x] Deploy losk (port 3013)
- [x] Deploy got-hired-ai (port 3014)
- [ ] Deploy bh-ai-79 (needs backend config)
- [ ] Deploy zen-tot (needs credentials)
- [ ] Deploy purple-lotus (Expo app - special handling)

---

## Next Up: Phase 8

### Apps Page Optimization ✅ (2026-01-31)
- [x] Add List/Grid view toggle
- [x] Create compact list view
- [x] Create compact grid view
- [x] Collapse Testing/Upgrading by default
- [x] Apply RPG styling

---

## Future Phases

### Phase 9: Music Streaming
- [ ] Upload tracks to IONOS S3
- [ ] Make bucket publicly accessible
- [ ] Update music.ts with track URLs
- [ ] Enhance player with actual audio playback

### Phase 10: Content & Polish
- [ ] Add custom images for testing/upgrading apps
- [ ] Review Cloud Infrastructure entries
- [ ] Add Art Curation entries
- [ ] Add Audio Engineering projects
- [ ] Fix voice-assistant (unhealthy container)

### Phase 11: CI/CD Automation
- [ ] Configure GitHub Actions secrets
- [ ] Set up automated backup schedule

---

## Apps Inventory (23 Total)

### Finished (12) - All Running
Sensei AI, Zen Reset, Chord Genesis, Wolf AI, Voice Assistant, ContentForge, Cloud LLM Assistant, DJ Visualizer, FineLine, Game Hub, Sprite Gen, Knowledge Base

### Testing (7) - 4 Running, 3 Pending
| App | Port | Status |
|-----|------|--------|
| darkflow-mind-mapper | 3010 | ✅ Running |
| gmat-mastery-suite | 3012 | ✅ Running |
| losk | 3013 | ✅ Running |
| got-hired-ai | 3014 | ✅ Running |
| bh-ai-79 | - | ⏳ Needs config |
| zen-tot | - | ⏳ Needs credentials |
| purple-lotus | - | ⏳ Expo app |

### Upgrading (4) - Not Deployed
Ashley-v3, sensei-ai-io, ask-hr-beta, sop-ai-beta

---

## Quick Reference

| Script | Purpose |
|--------|---------|
| `./scripts/deploy.sh` | Pull, build, deploy |
| `./scripts/backup.sh` | Local backup |
| `./scripts/github-backup.sh` | Push + backup branch |
| `./scripts/session-context.sh` | Show status |
| `./scripts/deploy-testing-apps.sh` | Deploy testing apps |

---

## Session Log

### 2026-01-31
- Deployed 4 testing apps to Docker
- Applied RPG UI theme from sandbox
- Fixed Music page SPA routing
- Redesigned Apps page with List/Grid toggle
- Removed emojis from app titles
- 12 Docker containers now running

### 2026-01-30
- Completed Phases 1-5
- 23 apps total (12 finished, 7 testing, 4 upgrading)
- Music page with player built
- CI/CD and backup infrastructure created
