# Gotchas & Lessons Learned

> Things that broke before and how to avoid them. **Read this before major operations.**

---

## Critical Gotchas

### 1. Git Filter-Repo Breaks dist/

**Date Learned:** 2026-06-21

**What Happened:**
- Ran `git filter-repo` to remove exposed secret
- dist/ was tracked in git (shouldn't have been)
- Old index.html was restored with stale asset hashes
- Site showed blank page (404 on JS files)

**Prevention:**
```bash
# Ensure dist/ is NOT tracked
git rm -r --cached dist/

# After ANY git history operation, always rebuild
npm run build
```

**Rule:** dist/ should NEVER be in git. It's a build artifact.

---

### 2. Subdirectory Apps Need Two Config Changes

**What Happens:**
- Deploy app to `/my-app/`
- App shows blank page
- No console errors

**Cause:** Missing base path configuration.

**Fix - Both Required:**
```typescript
// 1. vite.config.ts
export default defineConfig({
  base: '/my-app/',
  // ...
})

// 2. React Router
<BrowserRouter basename="/my-app">
```

**Without #1:** Assets load from wrong path (404)
**Without #2:** Client-side routing breaks (404 on refresh)

---

### 3. Secrets in Git History

**Date Learned:** 2026-06-21

**What Happened:**
- Backup tar.gz with API key was committed
- File was later deleted but stayed in history
- Security researcher found it via GitHub search

**Prevention:**
```bash
# .gitignore MUST include:
*.tar.gz
*.zip
.env
.env.*
*.key
*.pem

# Scan before committing
./scripts/scan-secrets.sh
```

**If It Happens:**
1. Rotate the credential IMMEDIATELY
2. Remove from history: `git filter-repo --path <file> --invert-paths`
3. Force push: `git push --force`
4. Rebuild: `npm run build` (see Gotcha #1)

---

### 4. Nginx Trailing Slash Matters

**What Happens:**
- `proxy_pass http://localhost:3015` → `/app/path` → `http://localhost:3015/app/path`
- `proxy_pass http://localhost:3015/` → `/app/path` → `http://localhost:3015/path`

**Rule:** Use trailing slash to strip location prefix.

```nginx
# CORRECT - strips /app/ prefix
location /app/ {
    proxy_pass http://localhost:3015/;
}

# WRONG - keeps /app/ prefix (usually breaks the app)
location /app/ {
    proxy_pass http://localhost:3015;
}
```

---

### 5. Docker Container Port Conflicts

**What Happens:**
- Start new container on port 3015
- Get "port already in use" error

**Check First:**
```bash
sudo lsof -i :3015
# or
brain apps health
```

**Port Allocation:**
- 3010-3019: Testing apps (check before using)
- 3020+: New apps

---

### 6. Email Delivery to External Addresses

**What Happens:**
- Email sends successfully (no error)
- Never arrives at Gmail/external address

**Cause:** Missing SPF/DKIM records, or Gmail rejects unknown senders.

**Workaround:** Use Gmail SMTP directly:
```bash
./scripts/send-email.py user@example.com "Subject" "Body"
```

This uses authenticated Gmail SMTP which bypasses the issue.

---

### 7. npm ci vs npm install

**What Happens:**
- `npm install` works locally
- `npm ci` fails in deploy script

**Cause:** package-lock.json out of sync with package.json.

**Fix:**
```bash
# Regenerate lock file
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Regenerate package-lock.json"
```

---

### 8. Vite Build Cache Issues

**What Happens:**
- Make code changes
- Build succeeds
- Old code still runs

**Fix:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

---

### 9. Browser Caching After Deploy

**What Happens:**
- Deploy new version
- Users still see old version

**Fix for Users:**
- Hard refresh: Ctrl+Shift+R

**Prevention:** Vite already uses content hashes in filenames. If this persists, check if old index.html is being served (see Gotcha #1).

---

### 10. Docker Volume Permissions

**What Happens:**
- Container can't write to mounted volume
- Permission denied errors

**Fix:**
```bash
# Check ownership
ls -la /path/to/volume

# Fix ownership (match container user)
sudo chown -R 1000:1000 /path/to/volume
```

---

## Pre-Flight Checklists

### Before Deploying New App

- [ ] Port is available (`sudo lsof -i :<port>`)
- [ ] vite.config.ts has `base: '/slug/'`
- [ ] Router has `basename="/slug"`
- [ ] Nginx location block added
- [ ] App builds successfully (`npm run build`)
- [ ] Added to `src/data/apps.ts`
- [ ] Added to API registries (if using dashboard)

### Before Git History Operations

- [ ] Credential being removed has been rotated
- [ ] dist/ is not tracked (`git ls-files dist/`)
- [ ] Have a backup (`./scripts/backup.sh`)
- [ ] Ready to rebuild after (`npm run build`)
- [ ] Ready to force push (`git push --force`)

### Before Major Nginx Changes

- [ ] Backed up current config (`cp portfolio.conf portfolio.conf.bak`)
- [ ] Test syntax (`sudo nginx -t`)
- [ ] Know how to rollback (`cp portfolio.conf.bak portfolio.conf`)

---

## Recovery Commands

```bash
# Site is down - quick recovery
sudo nginx -t && sudo nginx -s reload
npm run build

# Container crashed
docker-compose down && docker-compose up -d

# Git mess
git reflog  # Find last good state
git reset --hard HEAD@{n}

# Restore from backup
tar -xzf backups/dist_*.tar.gz
```
