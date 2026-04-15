# Session: IONOS Exam Dashboard Integration & Base Path Fix
**Date:** 2026-04-15
**Focus:** Integrating IONOS Cloud Exam app into portfolio infrastructure

---

## Issues Identified

### 1. Dashboard Not Tracking IONOS Exam Updates
**Symptom:** GitHub commits to IONOS-Cloud-Exam-Prep weren't showing in the admin dashboard.

**Root Cause:** The app was never added to `APP_DIRS` in `/var/www/zaylegend/api/routes/apps.py`. Only apps in `APP_DIRS` are tracked for git updates.

**Discovery:** Green Empire worked because it was in `APP_DIRS`. IONOS was missing.

### 2. Blank Page on Domain Access
**Symptom:** Visiting `https://zaylegend.com/ionos-exam/` showed a blank page.

**Root Cause:** Missing base path configuration. Assets were loading from `/assets/` instead of `/ionos-exam/assets/`.

**Files affected:**
- `vite.config.ts` - missing `base: "/ionos-exam/"`
- `src/App.tsx` - missing `basename="/ionos-exam"` on BrowserRouter

### 3. Branch Divergence
**Symptom:** Local server had 3 commits that weren't on GitHub, while GitHub had 1 commit not on local.

**Resolution:** Reset to GitHub version since user confirmed GitHub was the source of truth.

---

## Changes Made

### 1. API Registry Updates (`/var/www/zaylegend/api/routes/apps.py`)

**Added to `APP_DIRS` (git tracking):**
```python
# Testing apps - NEW
"ionos-exam": f"{PORTFOLIO_DIR}/apps/IONOS-Cloud-Exam-Prep",
"bh-ai-79": f"{PORTFOLIO_DIR}/apps/testing/bh-ai-79",
"darkflow": f"{PORTFOLIO_DIR}/apps/testing/darkflow-mind-mapper",
"gmat": f"{PORTFOLIO_DIR}/apps/testing/gmat-mastery-suite",
"got-hired": f"{PORTFOLIO_DIR}/apps/testing/got-hired-ai",
"losk": f"{PORTFOLIO_DIR}/apps/testing/losk",
"purple-lotus": f"{PORTFOLIO_DIR}/apps/testing/purple-lotus",
"zen-tot": f"{PORTFOLIO_DIR}/apps/testing/zen-tot",
```

**Added to `APPS` registry (health checks):**
```python
"ionos-exam": {"port": None, "category": "testing", "container": None},
```

### 2. IONOS Exam Base Path Fix

**vite.config.ts:**
```typescript
export default defineConfig(({ mode }) => ({
  base: "/ionos-exam/",  // ADDED
  // ...
}));
```

**src/App.tsx:**
```tsx
<BrowserRouter basename="/ionos-exam">  // ADDED basename
```

### 3. Git Sync
- Reset local to match GitHub: `git reset --hard origin/main`
- Rebuilt app: `npm run build`

---

## Infrastructure Notes

### Apps Tracking Summary
| Category | In APPS | In APP_DIRS | Notes |
|----------|---------|-------------|-------|
| Finished | 12 | 9 | zen-reset has no git repo |
| Testing | 9 | 9 | All now tracked |
| Total | 21 | 18 | 3 apps have no git repos |

### Critical: New App Deployment Checklist
When adding a new app served under a subdirectory (e.g., `/my-app/`):

1. **vite.config.ts** - Add `base: "/my-app/"`
2. **BrowserRouter** - Add `basename="/my-app"`
3. **APP_DIRS** - Add entry in `api/routes/apps.py` for git tracking
4. **APPS** - Add entry for health checks (port, category, container)
5. **Nginx** - Add location block in `portfolio.conf`
6. **Build** - Run `npm run build` after changes

### API Endpoints for App Management
- `GET /api/apps` - List all apps
- `GET /api/apps/health` - Health check all apps
- `GET /api/apps/updates/check` - Check all apps for git updates
- `GET /api/apps/{name}/updates` - Check specific app for updates
- `POST /api/apps/{name}/update` - Pull and rebuild an app

---

## Verification

```bash
# Check IONOS is tracked
curl -s http://localhost:8000/api/apps | grep ionos

# Check for pending updates
curl -s http://localhost:8000/api/apps/updates/check

# Verify base path in built files
head -30 /var/www/zaylegend/apps/IONOS-Cloud-Exam-Prep/dist/index.html | grep src=
```

---

## Deploy Key Setup

The server's default SSH key didn't have write access to the IONOS repo. We added a deploy key:

**Key added to GitHub:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIrIAK5YaAASGffEbsZHTlwQuM/NVNs6ygWpdw3hkm6Q zaylegend-server
```

**Location:** https://github.com/yetog/IONOS-Cloud-Exam-Prep/settings/keys

**Push command** (uses specific key since SSH config defaults to another):
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes" git push origin main
```

---

## Final Commits

**IONOS-Cloud-Exam-Prep repo:**
```
21dc228 fix: Add base path for subdirectory deployment
13cd181 Fix Learn page formatting — enable typography plugin
08c1d47 Fix mock exam race condition, remove GMAT branding, overhaul Learn section
```

**Portfolio repo changes (to commit):**
- `api/routes/apps.py` - Added IONOS and testing apps to registries
- `sessions/2026-04-15-ionos-dashboard-integration.md` - This session doc

---

## Key Learnings

1. **Always add new apps to both registries** in `api/routes/apps.py`:
   - `APP_DIRS` for git update tracking
   - `APPS` for health checks and dashboard display

2. **React apps in subdirectories need two config changes:**
   - `vite.config.ts`: `base: "/app-slug/"`
   - `BrowserRouter`: `basename="/app-slug"`

3. **Deploy keys are repo-specific** - each repo needs its own key added with write access if you want to push from the server

4. **SSH config matters** - when multiple keys exist, use `GIT_SSH_COMMAND` to specify the correct key

5. **Branch divergence** - always check `git status` and `git log` before assuming GitHub is behind; branches can diverge when work happens on multiple machines
