# CLAUDE.md - Portfolio Infrastructure Context

> This file helps Claude understand the portfolio infrastructure for optimal assistance.
> Last Updated: 2026-03-29

---

## Project Overview

**Owner:** Isayah Young-Burke
**Role:** Infrastructure & AI Consultant
**Domain:** Portfolio website showcasing cloud, AI, and creative projects
**GitHub:** git@github.com:yetog/cloud-port.git

---

## Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Routing:** React Router v6
- **Build:** Vite with SWC
- **Package Manager:** npm (bun available)
- **CI/CD:** GitHub Actions
- **Hosting:** Self-hosted Linux server with Nginx

### Directory Structure
```
/var/www/zaylegend/
├── src/
│   ├── components/        # UI components
│   ├── pages/             # Route pages (Index, Apps, Music, ProjectDetail)
│   ├── data/              # Content data (projects, apps, skills, music)
│   └── config/            # Asset URLs (IONOS S3)
├── apps/
│   ├── [finished apps]/   # 12 production apps
│   ├── testing/           # 8 beta apps
│   └── upgrades/          # 4 apps being enhanced
├── telos/                 # Personal context (mission, goals, beliefs)
├── scripts/               # Automation (deploy, backup, context)
├── sessions/              # Session logs
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
├── dist/                  # Production build
├── brain.py               # CLI command center
├── brain.db               # SQLite task database
├── CLAUDE.md              # This file
└── PORTFOLIO_ROADMAP.md   # Task tracking
```

### Port Mapping
| Port | Application | Status |
|------|-------------|--------|
| 8080 | Main Portfolio | Finished |
| 8081 | Zen Reset | Finished |
| 3001 | Chord Genesis | Finished |
| 3003 | Fineline | Finished |
| 3004 | Game Hub | Finished |
| 3005 | DJ Visualizer | Finished |
| 3006 | Sprite Gen | Finished |
| 3007 | Voice Assistant | Finished |
| 3008 | Knowledge Base | Finished |
| 3009 | ContentForge | Finished |
| 3010 | Darkflow Mind Mapper | Testing |
| 3012 | GMAT Mastery Suite | Testing |
| 3013 | Losk | Testing |
| 3014 | Got Hired AI | Testing |
| 3015 | BH AI 79 | Testing |
| 3016 | Purple Lotus | Testing |
| 3017 | Zen ToT | Testing |
| 3018 | Forge Fit | Testing |
| 3019 | Green Empire Landscaping | Client Project (→ /green-empire) |

---

## Apps Inventory (25 Total)

Run `brain apps` or `brain apps health` for live status.

### Finished Apps (13)
Production-ready, fully functional:
- Sensei AI, Zen Reset, Chord Genesis, Wolf AI, Voice Assistant
- ContentForge, Cloud LLM Assistant, DJ Visualizer
- FineLine, Game Hub, Sprite Gen, Knowledge Base, Portfolio

### Testing Apps (8)
Beta/experimental, running on ports 3010-3018:
- Darkflow Mind Mapper, BH AI 79, GMAT Mastery Suite
- Losk (Light Novel Hub), Purple Lotus (Zodiac Social)
- Got Hired AI (Resume Builder), Zen ToT, Forge Fit

### Upgrading Apps (4)
Active development, not yet deployed:
- Ashley-v3 (Cloud Provision + 11Labs)
- Sensei AI IO (Sales + Retention)
- Ask HR Beta (AI HR Assistant)
- SOP AI Beta (SOP RAG Chatbot)

---

## Key Files

### Data Files (Content)
| File | Purpose |
|------|---------|
| `src/data/apps.ts` | App definitions with status (finished/testing/upgrading) |
| `src/data/projects.ts` | Portfolio projects (30+ entries) |
| `src/data/skills.ts` | Skill ratings and categories |
| `src/data/music.ts` | Music/discography data (PH Pool album) |
| `src/data/dj.ts` | DJ EPK data (mixes, events, journey posts) |
| `src/config/assets.ts` | IONOS S3 image URLs |

### Pages
| File | Route | Description |
|------|-------|-------------|
| `src/pages/Index.tsx` | `/` | Main portfolio page |
| `src/pages/Apps.tsx` | `/apps` | Apps with category sections |
| `src/pages/Music.tsx` | `/music` | Music portfolio with player |
| `src/pages/ProjectDetail.tsx` | `/projects/:id` | Project details |
| `src/pages/DJ.tsx` | `/dj` | DJ EPK landing page |
| `src/pages/DJMixes.tsx` | `/dj/mixes` | DJ mixes with audio player |
| `src/pages/DJEvents.tsx` | `/dj/events` | DJ events & experience |
| `src/pages/DJJourney.tsx` | `/dj/journey` | Timeline blog (28 posts) |
| `src/pages/DJJourneyPost.tsx` | `/dj/journey/:id` | Individual journey post |
| `src/pages/DJBooking.tsx` | `/dj/booking` | DJ booking form |

### Components
| File | Purpose |
|------|---------|
| `src/components/Sidebar.tsx` | Navigation (About, Apps, Projects, Music, Contact) |
| `src/components/Hero.tsx` | Landing section |
| `src/components/About.tsx` | Bio + skills |
| `src/components/Apps.tsx` | Featured apps carousel |
| `src/components/Projects.tsx` | Project grid with filtering |

---

## Scripts & Automation

### Deployment
```bash
./scripts/deploy.sh          # Pull from GitHub, build, deploy
./scripts/github-backup.sh   # Push + create backup branch
./scripts/backup.sh          # Local backup with rotation
```

### Session Context
```bash
./scripts/session-context.sh  # Shows status on login
# Auto-runs on SSH login (added to ~/.bashrc)
```

### CI/CD (GitHub Actions)
- `.github/workflows/deploy.yml`
- Builds on push to main
- Deploys via SSH (needs secrets: SERVER_HOST, SERVER_USER, SERVER_SSH_KEY)

---

## Brain CLI

The `brain` command is the central CLI for managing the portfolio. Available globally via `/usr/local/bin/brain`.

### Commands
```bash
brain status              # Overview: nginx, docker, git, disk, pending tasks
brain deploy              # Run deployment script
brain backup              # Run backup script
brain apps                # List all 25 apps by category
brain apps health         # Check which apps are UP/DOWN
brain apps restart <name> # Restart a specific container
brain task add "title"    # Add a task to SQLite database
brain task list           # View pending tasks
brain task done <id>      # Mark task as complete
brain task all            # View all tasks including completed
brain help                # Show help
```

### Database
Tasks are stored in `brain.db` (SQLite). Tables:
- `tasks` - id, title, status, priority, created_at, completed_at
- `sessions` - id, date, summary, created_at

### TELOS (Personal Context)
Located in `/telos/` directory:
- `mission.md` - Who you are, what you do
- `goals.md` - Short and long-term objectives
- `beliefs.md` - Core principles

---

## Common Tasks

### Add a New Testing App
**Use the deployment script** (recommended):
```bash
./scripts/deploy-testing-app.sh <folder-name> <url-slug> <port>
# Example: ./scripts/deploy-testing-app.sh my-new-app my-app 3018
```

**CRITICAL: React Router apps need TWO fixes:**
1. `vite.config.ts` needs `base: '/url-slug/'`
2. `<BrowserRouter>` needs `basename="/url-slug"`

Without both, you'll get routing 404 errors inside the app.

See `docs/TESTING_APP_DEPLOYMENT.md` for full manual instructions.

**Port allocation:**
- 3010-3019: Testing apps
- Next available: 3018

### Add a Project
Edit `src/data/projects.ts`:
```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Description...',
  category: 'cloud', // cloud, hosting, art, audio, etc.
  image: getAssetUrl('projects/image.jpg'),
  tags: ['Tag1', 'Tag2'],
}
```

### Add Music
Edit `src/data/music.ts` - add to `musicProjects` array.

### Update Skills
Edit `src/data/skills.ts` or `src/components/About.tsx`.

### Deploy Changes
```bash
npm run build              # Build locally
git add -A && git commit   # Commit changes
git push origin main       # Push to GitHub
# Or use: ./scripts/deploy.sh
```

---

## Session Insights

### What Works Well
- shadcn/ui + Radix for accessible components
- Vite builds are fast (~17s)
- Category system for apps (Finished/Testing/Upgrading)
- Session logging for context continuity
- IONOS S3 for reliable image hosting

### Patterns Established
- Apps have `status` field for categorization
- Music page has fixed bottom player
- Sidebar handles both hash links and routes
- Scripts are in `/scripts/` and executable

### Things to Remember
- Use `brain status` for quick overview
- Use `brain task add` to track work
- Rebuild after changes: `npm run build`
- Nginx config: `/etc/nginx/conf.d/portfolio.conf`
- Docker apps: `docker-compose up -d`
- 17 Docker containers typically running

---

## Project Categories
- `cloud` - Cloud Infrastructure
- `hosting` - Web Hosting
- `art` - Art Curation
- `audio` - Audio Engineering
- `domain` - Domain Management
- `marketing` - Marketing/Design
- `ecommerce` - E-commerce

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Brain CLI** | |
| Full status | `brain status` |
| Apps health check | `brain apps health` |
| Add task | `brain task add "title"` |
| View tasks | `brain task list` |
| **Development** | |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Deploy | `brain deploy` or `./scripts/deploy.sh` |
| Backup | `brain backup` or `./scripts/backup.sh` |
| **Git** | |
| Push to GitHub | `git push origin main` |
| **Infrastructure** | |
| Nginx reload | `sudo nginx -s reload` |
| Docker status | `docker ps` |
| Restart app | `brain apps restart <name>` |

---

## Completed Features

### Session 2026-01-30
1. **Phase 1:** Changed "Cloud Consultant" → "AI Consultant"
2. **Phase 2:** App category system (23 apps across 3 categories)
3. **Phase 3:** Music section with /music page and audio player
4. **Phase 4:** CI/CD, backup scripts, session context
5. **Phase 5:** Documentation updates

### Session 2026-03-17
6. **TELOS System:** Personal context docs (mission, goals, beliefs)
7. **Brain CLI:** Unified command center with 25 apps tracked
8. **SQLite Tasks:** Task tracking with add/list/done commands
9. **Carousel Fix:** Resolved left-edge clipping issue

### Session 2026-03-29
10. **DJ Zay EPK:** Full DJ portfolio section with 6 pages
11. **Journey Blog:** Timeline system with 28 posts (Season 1)
12. **PH Pool Album:** Added 25 tracks to music.ts with S3 URLs
13. **IONOS Exam Prep:** Added to testing apps
14. **Project Categories:** Added design, ecommerce, domain, marketing icons

---

## Future Enhancements

- [x] Add actual music tracks to discography (PH Pool - 25 tracks)
- [ ] Deploy upgrading apps (Ashley-v3, Sensei AI IO, etc.)
- [ ] Add session logging commands to brain CLI
- [ ] More Cloud Infrastructure projects
- [ ] Custom images for new apps
- [ ] Upload DJ mixes to S3 (`portfoliowebsite/dj/mixes/`)
- [ ] Upload DJ event photos to S3 (`portfoliowebsite/dj/events/`)
- [ ] Write full content for 28 journey posts
- [ ] Connect DJ booking form to email service

See `docs/DJ_SECTION.md` for full DJ documentation.
