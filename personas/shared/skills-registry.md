# Skills Registry

> Available automation scripts on this server. Use these instead of manual commands when possible.

---

## Quick Reference

| Task | Script | Example |
|------|--------|---------|
| Deploy changes | `./scripts/deploy.sh` | Just run it |
| Add testing app | `./scripts/deploy-testing-app.sh` | `./scripts/deploy-testing-app.sh my-app my-app 3020` |
| Security scan | `./scripts/scan-secrets.sh` | `./scripts/scan-secrets.sh` |
| Full security audit | `./scripts/security-cron.sh --run` | Monthly checks |
| Send email | `./scripts/send-email.py` | `./scripts/send-email.py user@example.com "Subject" "Body"` |
| Check status | `brain status` | System overview |
| App health | `brain apps health` | Check all containers |

---

## Deployment Scripts

### deploy.sh
**Purpose:** Standard full deployment (pull → install → build → verify)
```bash
./scripts/deploy.sh
```
- Backs up current dist/
- Pulls from GitHub
- Runs npm ci
- Builds production bundle
- Verifies dist/index.html exists

### deploy-testing-app.sh
**Purpose:** Deploy a new testing app to a port
```bash
./scripts/deploy-testing-app.sh <folder-name> <url-slug> <port>
# Example: ./scripts/deploy-testing-app.sh my-new-app my-app 3020
```
- Creates nginx location block
- Sets up vite.config.ts with base path
- Configures BrowserRouter basename
- Builds and deploys

### deploy-app-from-repo.sh
**Purpose:** Clone a GitHub repo and deploy it
```bash
./scripts/deploy-app-from-repo.sh <github-url> <slug> <port>
```

---

## Security Scripts

### scan-secrets.sh
**Purpose:** Scan codebase for exposed secrets using gitleaks
```bash
./scripts/scan-secrets.sh           # Run scan
./scripts/scan-secrets.sh --install # Install gitleaks first
```
- Detects API keys, passwords, tokens
- Reports file and line number
- Exit code 1 if secrets found

### security-cron.sh
**Purpose:** Comprehensive monthly security audit
```bash
./scripts/security-cron.sh --run    # Run all checks
./scripts/security-cron.sh --install # Show cron setup
```
Checks:
1. SSH failed login attempts
2. SSL certificate expiry
3. System security updates
4. Docker container health
5. Disk space usage
6. Nginx configuration
7. Secret scanning

---

## Backup Scripts

### backup.sh
**Purpose:** Local backup with rotation (keeps last 5)
```bash
./scripts/backup.sh
```

### github-backup.sh
**Purpose:** Push to GitHub + create dated backup branch
```bash
./scripts/github-backup.sh
```

### daily-backup.sh
**Purpose:** Automated daily backup (for cron)
```bash
# In crontab:
0 3 * * * /var/www/zaylegend/scripts/daily-backup.sh
```

---

## Email Scripts

### send-email.py
**Purpose:** Send emails via Gmail SMTP
```bash
# Simple email
./scripts/send-email.py user@example.com "Subject" "Message body"

# From stdin
echo "Long message" | ./scripts/send-email.py user@example.com "Subject" --stdin

# HTML email
./scripts/send-email.py user@example.com "Subject" --html /path/to/email.html
```

### send-work-report.py
**Purpose:** Send automated work reports
```bash
./scripts/send-work-report.py daily   # Today's git activity
./scripts/send-work-report.py weekly  # This week's summary
```

---

## Update Scripts

### check-app-updates.sh
**Purpose:** Check which apps have git updates available
```bash
./scripts/check-app-updates.sh
```

### update-all-apps.sh
**Purpose:** Pull and rebuild all apps
```bash
./scripts/update-all-apps.sh
```

### update-app.sh
**Purpose:** Update a specific app
```bash
./scripts/update-app.sh <app-name>
```

---

## Verification Scripts

### verify-deployment.sh
**Purpose:** Verify deployment succeeded
```bash
./scripts/verify-deployment.sh
```
- Checks dist/index.html exists
- Tests HTTP response
- Validates nginx config

### verify-app-links.sh
**Purpose:** Check all app URLs are responding
```bash
./scripts/verify-app-links.sh
```

---

## Brain CLI

**Purpose:** Central command center for portfolio management

```bash
brain status              # Full system overview
brain deploy              # Run deployment
brain backup              # Run backup
brain apps                # List all apps
brain apps health         # Check container health
brain apps restart <name> # Restart container
brain task add "title"    # Add task
brain task list           # View pending tasks
brain task done <id>      # Complete task
brain help                # Show help
```

---

## Utility Scripts

### install-personas.sh
**Purpose:** Build and install personas to Claude Code
```bash
./scripts/install-personas.sh
```

### upload-music-to-s3.py
**Purpose:** Upload files to IONOS S3
```bash
./scripts/upload-music-to-s3.py /path/to/file
```

### session-context.sh
**Purpose:** Show session info (runs on SSH login)
```bash
./scripts/session-context.sh
```

---

## When to Use Scripts vs Manual

| Situation | Use |
|-----------|-----|
| Standard deploy | `./scripts/deploy.sh` |
| Debug deploy issue | Manual git/npm commands |
| Add new testing app | `./scripts/deploy-testing-app.sh` |
| One-off nginx edit | Manual edit + `nginx -t && nginx -s reload` |
| Monthly security | `./scripts/security-cron.sh --run` |
| Quick secret check | `./scripts/scan-secrets.sh` |
| Send notification | `./scripts/send-email.py` |
| Check system state | `brain status` |

---

## Port Allocation

| Range | Purpose | Scripts |
|-------|---------|---------|
| 8080-8081 | Main portfolio + Zen Reset | Manual |
| 3001-3009 | Finished apps | Manual |
| 3010-3019 | Testing apps | `deploy-testing-app.sh` |
| 3020+ | Future apps | `deploy-testing-app.sh` |
