# Portfolio Roadmap & Task Checklist

> Last Updated: 2026-01-30
> Status: Planning Phase

---

## Quick Wins (Can do now)

- [x] Change "Infrastructure and Cloud Consultant" → "Infrastructure and AI Consultant" in About section (DONE - 2026-01-30)

---

## Content Updates

### Cloud Infrastructure Projects
- [ ] Review existing entries - some may fit better under "Web Hosting"
- [ ] Add new deals/projects as separate entries
- [ ] Reorganize categories as needed

### Art Curation
- [ ] Add new curation entries (awaiting links/files from user)

### Audio Engineering
- [ ] Add completed projects
- [ ] Add upcoming/past events

---

## Apps Section Restructure

### New Category System (for /apps page only - main page stays the same)
1. **Finished Apps** - Production-ready applications
2. **Apps in Testing** - Beta/experimental
3. **Apps Upgrading** - Active development/improvements

### Apps to Clone & Add

#### Testing Category
| App | Repo | Description |
|-----|------|-------------|
| Darkflow Mind Mapper | https://github.com/yetog/darkflow-mind-mapper.git | Mind mapping tool |
| BH AI 79 | https://github.com/Akasuki-de/bh-ai-79.git | AI application |
| GMAT Mastery Suite | https://github.com/yetog/gmat-mastery-suite | Test prep suite |
| Losk | https://github.com/yetog/losk.git | Light Novel Hub |
| Purple Lotus | https://github.com/yetog/purple-lotus.git | Zodiac Social Media |
| Got Hired AI | https://github.com/yetog/got-hired-ai.git | Resume + Cover Letter Builder |
| Zen ToT | https://github.com/yetog/zen-tot | TBD |

#### Upgrades Category
| App | Repo | Description |
|-----|------|-------------|
| Ashley v3 | https://github.com/yetog/Ashley-v3 | Cloud Provision Agent + 11Labs |
| Sensei AI IO | https://github.com/yetog/sensei-ai-io.git | Sales + Retention Assistant |
| Ask HR Beta | https://github.com/yetog/ask-hr-beta.git | AI HR Assistant |
| SOP AI Beta | https://github.com/yetog/sop-ai-beta.git | SOP AI RAG Chatbot |

### Knowledge Base App
- [ ] Review current state
- [ ] Decide: rebuild or improve existing

---

## New Music Section

### Requirements
- [ ] Add "Music" option to sidebar navigation
- [ ] Create music section on main portfolio page (artist projects overview)
- [ ] Build dedicated `/music` page with:
  - [ ] Full discography display
  - [ ] Music player component with:
    - [ ] Autoplay functionality
    - [ ] Shuffle mode
    - [ ] Track browsing (songs, projects, albums)
  - [ ] Artist bio/info

### Content Needed
- [ ] Track list / discography data
- [ ] Audio files or streaming links
- [ ] Album artwork
- [ ] Project descriptions

---

## DevOps & Infrastructure

### CI/CD Pipeline Goals
- [ ] Create GitHub Actions workflow template
- [ ] Auto-deploy on repo push → serve on portfolio
- [ ] Reference: Check loft-story repo for good example

### Backup Strategy
- [ ] Create single GitHub repo backup of entire server
- [ ] Document backup/restore process
- [ ] Set up automated backup schedule

### Login Context Script
- [ ] Build script that runs on server login
- [ ] Shows: last worked on, next priorities
- [ ] Pulls from session documents
- [ ] Display checklist status

---

## Session & Context Optimization

### CLAUDE.md Enhancement
- [ ] Create comprehensive CLAUDE.md for project
- [ ] Document infrastructure architecture
- [ ] Include insights from past sessions
- [ ] Add workflow patterns that worked well

### Skills to Build
- [ ] Session insight compiler
- [ ] Context loader for new sessions
- [ ] Progress tracker

### Documentation
- [ ] Document server infrastructure
- [ ] Create architecture diagrams
- [ ] Push to backed-up location

---

## Priority Order (Suggested)

### Phase 1: Quick Content Fixes
1. Update "Infrastructure and AI Consultant" text
2. Reorganize existing project categories

### Phase 2: Apps Infrastructure
1. Clone new repos to server
2. Update apps.ts with new app categories
3. Modify /apps page to show categories

### Phase 3: Music Section
1. Add sidebar navigation
2. Build music section component
3. Create /music page with player

### Phase 4: DevOps
1. Set up CI/CD workflows
2. Implement backup system
3. Create login context script

### Phase 5: Meta/Optimization
1. Build CLAUDE.md
2. Create session insight system
3. Document everything

---

## Notes & Ideas

- Consider building custom skills for recurring tasks
- Session documents should be structured for easy parsing
- Infrastructure is complex but powerful - worth documenting well

---

## Session Log

### 2026-01-30
- Initial roadmap created
- Captured all requirements from brain dump
- Repos documented for cloning
