# CLAUDE.md - Portfolio Infrastructure Context

> This file helps Claude understand the portfolio infrastructure for optimal assistance.
> Last Updated: 2026-01-30

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
│   ├── [finished apps]/   # 9 production apps
│   ├── testing/           # 7 beta apps
│   └── upgrades/          # 4 apps being enhanced
├── scripts/               # Automation (deploy, backup, context)
├── sessions/              # Session logs
├── .github/workflows/     # CI/CD pipelines
├── dist/                  # Production build
├── CLAUDE.md              # This file
└── PORTFOLIO_ROADMAP.md   # Task tracking
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
| 3009 | ContentForge |

---

## Apps Inventory (23 Total)

### Finished Apps (12)
Production-ready, fully functional:
- Sensei AI, Zen Reset, Chord Genesis, Wolf AI, Voice Assistant
- ContentForge, Cloud LLM Assistant, DJ Visualizer
- FineLine, Game Hub, Sprite Gen, Knowledge Base

### Testing Apps (7)
Beta/experimental in `/apps/testing/`:
- darkflow-mind-mapper, bh-ai-79, gmat-mastery-suite
- losk (Light Novel Hub), purple-lotus (Zodiac Social)
- got-hired-ai (Resume Builder), zen-tot

### Upgrading Apps (4)
Active development in `/apps/upgrades/`:
- Ashley-v3 (Cloud Provision + 11Labs)
- sensei-ai-io (Sales + Retention)
- ask-hr-beta (AI HR Assistant)
- sop-ai-beta (SOP RAG Chatbot)

---

## Key Files

### Data Files (Content)
| File | Purpose |
|------|---------|
| `src/data/apps.ts` | App definitions with status (finished/testing/upgrading) |
| `src/data/projects.ts` | Portfolio projects (30+ entries) |
| `src/data/skills.ts` | Skill ratings and categories |
| `src/data/music.ts` | Music/discography data |
| `src/config/assets.ts` | IONOS S3 image URLs |

### Pages
| File | Route | Description |
|------|-------|-------------|
| `src/pages/Index.tsx` | `/` | Main portfolio page |
| `src/pages/Apps.tsx` | `/apps` | Apps with category sections |
| `src/pages/Music.tsx` | `/music` | Music portfolio with player |
| `src/pages/ProjectDetail.tsx` | `/projects/:id` | Project details |

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

## Common Tasks

### Add a New App
1. Clone to `/apps/testing/` or `/apps/upgrades/`
2. Add entry to `src/data/apps.ts` with appropriate `status`
3. Configure nginx in `/etc/nginx/conf.d/portfolio.conf`
4. Restart nginx: `sudo nginx -s reload`

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
- Rebuild after changes: `npm run build`
- Nginx config: `/etc/nginx/conf.d/portfolio.conf`
- Docker apps: `docker-compose up -d`
- 8 Docker containers typically running

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
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Deploy | `./scripts/deploy.sh` |
| Backup | `./scripts/backup.sh` |
| Push to GitHub | `git push origin main` |
| View roadmap | `cat PORTFOLIO_ROADMAP.md` |
| Session context | `./scripts/session-context.sh` |
| Nginx reload | `sudo nginx -s reload` |
| Docker status | `docker ps` |

---

## Completed Features (Session 2026-01-30)

1. **Phase 1:** Changed "Cloud Consultant" → "AI Consultant"
2. **Phase 2:** App category system (23 apps across 3 categories)
3. **Phase 3:** Music section with /music page and audio player
4. **Phase 4:** CI/CD, backup scripts, session context
5. **Phase 5:** Documentation updates

---

## Future Enhancements

- [ ] Add actual music tracks to discography
- [ ] More Cloud Infrastructure projects
- [ ] Art Curation entries
- [ ] Audio Engineering projects/events
- [ ] Serve testing/upgrading apps
- [ ] Custom images for new apps
