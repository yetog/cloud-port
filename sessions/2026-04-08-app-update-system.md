# Session Notes: App Update System & Green Empire Fix
**Date:** 2026-04-08

---

## Summary

Built an automated app update system for the portfolio infrastructure, enabling easy synchronization of all apps from their respective GitHub repos. Also deployed Green Empire updates and fixed a form redirect 404 issue.

---

## What Was Built

### 1. App Update System

New brain CLI commands:
- `brain apps check` - Check all apps for pending repo updates
- `brain apps update <name>` - Pull latest and rebuild specific app
- `brain apps update-all` - Update all apps with pending changes

### 2. Scripts Created

| Script | Purpose |
|--------|---------|
| `scripts/check-app-updates.sh` | Scans all git repos, shows commits behind |
| `scripts/update-app.sh` | Pulls and rebuilds a single app |
| `scripts/update-all-apps.sh` | Batch update all apps |
| `scripts/notify-app-updates.sh` | Background checker for cron |

### 3. Notification System

- **Cron job** runs every 30 minutes: `*/30 * * * * /var/www/zaylegend/scripts/notify-app-updates.sh`
- **Login notifications** via `session-context.sh` - shows pending updates on SSH login
- Updates tracked in `.app-updates` file

### 4. Green Empire Updates

- Pulled latest changes from repo (31 files)
- Rebuilt Docker container on port 3019
- Verified Zapier webhook is configured on all forms
- Fixed thank-you.html 404 with nginx redirect

---

## Technical Details

### App Registry

Added to `brain.py`:
```python
# Client projects
"green-empire": (3019, "finished", "green-empire"),
```

### Nginx Fix

Added redirect for form thank-you page:
```nginx
location = /thank-you.html {
    return 301 /green-empire/thank-you.html;
}
```

This handles the root-relative redirect in JS (`window.location.href = '/thank-you.html'`) when running under `/green-empire/` path.

---

## Commits

1. `ea83bea` - feat: Add app update system with repo sync and notifications
2. `70417e1` - chore: Add app update runtime files to gitignore

---

## Files Changed

- `brain.py` - Added apps check/update/update-all commands, green-empire to registry
- `scripts/session-context.sh` - Added update notifications on login
- `scripts/check-app-updates.sh` - New
- `scripts/update-app.sh` - New
- `scripts/update-all-apps.sh` - New
- `scripts/notify-app-updates.sh` - New
- `.gitignore` - Added .app-updates runtime files
- `/etc/nginx/conf.d/portfolio.conf` - Added thank-you.html redirect

---

## Usage

```bash
# Check for updates
brain apps check

# Update specific app
brain apps update green-empire
brain apps update dj-visualizer

# Update all apps
brain apps update-all
```
