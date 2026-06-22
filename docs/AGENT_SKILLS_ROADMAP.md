# Agent Skills Roadmap

> How to teach our agents the institutional knowledge on this server.

---

## Current State

### What We Have

| Resource | Location | Purpose |
|----------|----------|---------|
| **36 Scripts** | `scripts/` | Automation for deploy, backup, security, email |
| **Brain CLI** | `brain.py` | Central command center |
| **3 Personas** | `personas/` | Infrastructure, Portfolio, Code Review |
| **AI Insights Repo** | `ai-insights/` | Sebastian's 9-agent workflow + MCP server |
| **Persona Builder** | `ai-persona-builder/` | Platform-agnostic persona generator |

### Personas Created

| Persona | Knows About | Missing Knowledge |
|---------|-------------|-------------------|
| Infrastructure Engineer | Docker, Nginx, general deploy | Local scripts, brain CLI |
| Portfolio Curator | App data, content | Build process, S3 uploads |
| Code Reviewer | Security, best practices | Project conventions |

---

## The Plan: 4-Phase Skill Integration

### Phase 1: Create Skills Registry
**Goal:** Document all scripts so agents know what tools exist.

Create `personas/shared/skills-registry.md`:
```markdown
# Available Skills (Scripts)

## Deployment
| Script | Purpose | When to Use |
|--------|---------|-------------|
| deploy.sh | Full deploy (pull, build, verify) | Standard deployments |
| deploy-testing-app.sh | Deploy new testing app | Adding apps to ports 3010-3019 |
| deploy-app-from-repo.sh | Clone and deploy from GitHub | New app from scratch |

## Security
| Script | Purpose | When to Use |
|--------|---------|-------------|
| scan-secrets.sh | Gitleaks secret scan | Monthly or after commits |
| security-cron.sh | Full 7-point audit | Monthly security review |

## Backup & Maintenance
...
```

### Phase 2: Inject Skills into Personas
**Goal:** Each persona knows about relevant scripts.

Update `personas/src/content/infrastructure-engineer.md`:
```markdown
## Local Skills Available

You have access to these automation scripts:

### Deployment
- `./scripts/deploy.sh` - Full deployment pipeline
- `./scripts/deploy-testing-app.sh <folder> <slug> <port>` - Deploy new testing app
...

### When to use scripts vs manual commands:
- **Use scripts** for standard operations (deploy, backup, security)
- **Use manual** for debugging or one-off tasks
```

### Phase 3: Create Knowledge Base Entries
**Goal:** Persistent learnings that agents can query.

Use Sebastian's MCP server to store insights:

```
storage/knowledge/
├── deployment-patterns.md      # How we deploy apps
├── nginx-conventions.md        # Our nginx patterns
├── docker-conventions.md       # Docker setup patterns
├── security-checklist.md       # Security requirements
├── troubleshooting.md          # Common issues & fixes
└── gotchas.md                  # Things that broke before
```

### Phase 4: Learning Loop (Synthesis)
**Goal:** After each session, capture what was learned.

Following Sebastian's pattern:
1. After completing work, agent writes synthesis
2. Key insights get added to knowledge base
3. Future sessions benefit from past learnings

---

## Implementation Order

### Week 1: Skills Registry
- [ ] Create `personas/shared/skills-registry.md`
- [ ] Categorize all 36 scripts by function
- [ ] Document input/output for each script
- [ ] Add to persona build process

### Week 2: Persona Enhancement
- [ ] Add skills sections to each persona
- [ ] Add local conventions (ports, paths, patterns)
- [ ] Add troubleshooting knowledge
- [ ] Rebuild and test personas

### Week 3: Knowledge Base Setup
- [ ] Create `storage/knowledge/` structure
- [ ] Document deployment patterns
- [ ] Document security conventions
- [ ] Configure MCP server to serve knowledge

### Week 4: Learning Loop
- [ ] Create synthesis template
- [ ] Add synthesis step to personas
- [ ] Test knowledge capture after sessions
- [ ] Review and refine process

---

## Quick Wins (Do Today)

1. **Add brain CLI to personas** - Most useful immediate knowledge
2. **Create skills-registry.md** - Inventory what exists
3. **Document the 5 most-used scripts** - deploy, backup, security

---

## Script Categories

### Deployment (9 scripts)
| Script | Purpose |
|--------|---------|
| `deploy.sh` | Standard full deploy |
| `deploy-testing-app.sh` | New testing app setup |
| `deploy-app-from-repo.sh` | Clone + deploy from GitHub |
| `deploy-enhanced.sh` | Deploy with extra checks |
| `deploy-with-docker.sh` | Docker-based deploy |
| `build-all.sh` | Build all apps |
| `build-apps.sh` | Build specific apps |
| `build-docker-apps.sh` | Build Docker apps |
| `rebuild-all-apps.sh` | Full rebuild |

### Updates (5 scripts)
| Script | Purpose |
|--------|---------|
| `update-all-apps.sh` | Update all apps |
| `update-app.sh` | Update single app |
| `update-apps.sh` | Update multiple apps |
| `check-app-updates.sh` | Check for git updates |
| `notify-app-updates.sh` | Send update notifications |

### Backup (3 scripts)
| Script | Purpose |
|--------|---------|
| `backup.sh` | Local backup with rotation |
| `daily-backup.sh` | Automated daily backup |
| `github-backup.sh` | Push + create backup branch |

### Security (2 scripts)
| Script | Purpose |
|--------|---------|
| `scan-secrets.sh` | Gitleaks secret scan |
| `security-cron.sh` | Monthly security audit |

### Email (3 scripts)
| Script | Purpose |
|--------|---------|
| `send-email.py` | Send emails via Gmail |
| `send-work-report.py` | Daily/weekly work reports |
| `fetch-email-attachments.py` | Download email attachments |

### Nginx & Docker (3 scripts)
| Script | Purpose |
|--------|---------|
| `update-nginx-docker.sh` | Update nginx for Docker |
| `setup-docker-apps.sh` | Initialize Docker apps |
| `fix-app-links.sh` | Fix app routing |

### Verification (3 scripts)
| Script | Purpose |
|--------|---------|
| `verify-deployment.sh` | Verify deploy succeeded |
| `verify-app-links.sh` | Check all app URLs |
| `monitor-alerts.sh` | Health monitoring |

### Utilities (8 scripts)
| Script | Purpose |
|--------|---------|
| `session-context.sh` | Show session info on login |
| `server-maintenance.sh` | General maintenance |
| `migration-export.sh` | Export for migration |
| `geo-sync.sh` | Geo-related sync |
| `upload-music-to-s3.py` | Upload to IONOS S3 |
| `check-mail.py` | Check email |
| `setup-apps.sh` | Initial app setup |
| `install-personas.sh` | Build + install personas |

---

## What Agents Could Learn from ai-insights

| Component | What to Learn |
|-----------|---------------|
| **Persona Structure** | Mission → Philosophy → Constraints → Workflow |
| **Ledger Pattern** | Track work packages, handoffs, synthesis |
| **Knowledge Base** | Store insights with scope (global/repo) |
| **Synthesis Step** | Extract learnings after completing work |
| **9-Agent Pipeline** | Planner → PM → Dev → QA → Security → Review → Release → Docs → Synthesis |

---

## Success Criteria

Agents should be able to:
- [ ] Know which script to use for common tasks
- [ ] Follow local conventions without being told
- [ ] Reference past troubleshooting knowledge
- [ ] Suggest appropriate scripts vs manual commands
- [ ] Capture learnings for future sessions
