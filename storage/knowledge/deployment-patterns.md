# Deployment Patterns

> How we deploy apps on this server. Reference this before any deployment.

---

## Standard Portfolio Deployment

**Script:** `./scripts/deploy.sh`

```bash
# What it does:
1. Backs up current dist/ to backups/
2. git fetch origin main && git reset --hard origin/main
3. npm ci --production=false
4. npm run build
5. Verifies dist/index.html exists
```

**When to use:** Any change to the main portfolio (src/, public/, etc.)

---

## Adding a New Testing App

**Script:** `./scripts/deploy-testing-app.sh <folder> <slug> <port>`

### Prerequisites
1. App code exists in `apps/<folder>/`
2. Port is available (check with `brain apps`)
3. App has `package.json` with build script

### Steps the Script Performs
1. Updates `vite.config.ts` with `base: '/<slug>/'`
2. Updates router with `basename="/<slug>"`
3. Adds nginx location block to `/etc/nginx/conf.d/portfolio.conf`
4. Runs `npm install && npm run build`
5. Reloads nginx

### Manual Checklist (if script fails)
```bash
# 1. vite.config.ts
export default defineConfig({
  base: '/my-app/',
  ...
})

# 2. Router (if using React Router)
<BrowserRouter basename="/my-app">

# 3. Nginx
location /my-app/ {
    alias /var/www/zaylegend/apps/my-app/dist/;
    try_files $uri $uri/ /my-app/index.html;
}

# 4. Build
cd apps/my-app && npm run build

# 5. Reload nginx
sudo nginx -t && sudo nginx -s reload
```

---

## Docker App Deployment

**Location:** `apps/<app-name>/docker-compose.yml`

```bash
# Start
cd apps/<app-name>
docker-compose up -d

# Restart
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

### Nginx for Docker Apps
```nginx
location /docker-app/ {
    proxy_pass http://localhost:3015/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## Static Site Deployment (No Build)

For pre-built static sites:

```nginx
location /static-site/ {
    alias /var/www/zaylegend/apps/static-site/;
    try_files $uri $uri/ /static-site/index.html;
}
```

---

## Post-Deployment Verification

```bash
# 1. Check nginx config
sudo nginx -t

# 2. Test local response
curl -I http://localhost:<port>/

# 3. Test public URL
curl -I https://zaylegend.com/<slug>/

# 4. Check for JS/CSS loading
curl -s https://zaylegend.com/<slug>/ | grep -o 'src="[^"]*"' | head -5
```

---

## Common Deployment Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Blank page | Missing `base` in vite.config | Add `base: '/slug/'` |
| 404 on refresh | Missing `basename` in router | Add `basename="/slug"` |
| 502 Bad Gateway | Container not running | `docker-compose up -d` |
| Assets 404 | Old index.html | Rebuild: `npm run build` |
| CORS errors | Missing proxy headers | Check nginx proxy_set_header |

---

## Rollback Procedure

```bash
# 1. Find backup
ls -la backups/dist_*.tar.gz

# 2. Restore
tar -xzf backups/dist_YYYYMMDD_HHMMSS.tar.gz -C /var/www/zaylegend/

# 3. Verify
curl -I https://zaylegend.com/
```
