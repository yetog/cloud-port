# Troubleshooting Guide

> Common issues and their solutions. Check here before debugging manually.

---

## Quick Diagnosis

```bash
brain status          # Overall system health
brain apps health     # Which apps are up/down
sudo nginx -t         # Nginx config valid?
docker ps             # Containers running?
df -h                 # Disk space?
```

---

## Website Issues

### Blank Page (White Screen)

**Symptoms:** Page loads but shows nothing, no errors in network tab.

**Causes & Fixes:**

| Cause | Check | Fix |
|-------|-------|-----|
| Missing `base` in vite.config | View source, check asset paths | Add `base: '/slug/'` to vite.config.ts |
| Missing `basename` in router | Check React Router config | Add `basename="/slug"` to BrowserRouter |
| Old index.html | Check asset hashes match | Run `npm run build` |
| JS error | Browser console | Fix the error |

```bash
# Quick fix
npm run build
```

### 404 Not Found

**Symptoms:** "404 Not Found" nginx error page.

**Causes & Fixes:**

| Cause | Check | Fix |
|-------|-------|-----|
| Missing nginx location | `grep 'location /slug' /etc/nginx/conf.d/portfolio.conf` | Add location block |
| Wrong alias path | Check path exists | Fix path in nginx config |
| App not built | Check `apps/slug/dist/` exists | `cd apps/slug && npm run build` |

### 502 Bad Gateway

**Symptoms:** "502 Bad Gateway" nginx error.

**Causes & Fixes:**

| Cause | Check | Fix |
|-------|-------|-----|
| Container not running | `docker ps` | `docker-compose up -d` |
| Wrong port in nginx | Check proxy_pass port | Fix port number |
| App crashed | `docker logs <container>` | Fix app error, restart |

```bash
# Quick fix for Docker apps
cd apps/<app-name>
docker-compose down
docker-compose up -d
docker-compose logs -f
```

### 503 Service Unavailable

**Symptoms:** "503 Service Unavailable" error.

**Cause:** Upstream server overloaded or not responding.

```bash
# Check if process is running
sudo lsof -i :<port>

# Restart the app
brain apps restart <app-name>
```

---

## Asset Loading Issues

### CSS/JS 404

**Symptoms:** Page loads but looks broken, console shows 404 for assets.

**Cause:** index.html references assets that don't exist (old hashes).

```bash
# Check what index.html expects
grep -o 'index-[^"]*\.js' dist/index.html

# Check what actually exists
ls dist/assets/index-*.js

# Fix: rebuild
npm run build
```

### Images Not Loading

**Symptoms:** Broken image icons.

**Causes:**

| Cause | Fix |
|-------|-----|
| Wrong S3 URL | Check `src/config/assets.ts` |
| S3 bucket permissions | Verify public access on IONOS |
| Local file missing | Add file to `public/` |

---

## Docker Issues

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Common issues:
# - Port already in use
# - Missing environment variables
# - Build error

# Force rebuild
docker-compose up -d --build --force-recreate
```

### Container Keeps Restarting

```bash
# Check restart count
docker ps

# View logs for crash reason
docker logs <container> --tail 100

# Common causes:
# - Missing config file
# - Database connection failed
# - Out of memory
```

### Can't Connect to Container

```bash
# Verify it's running
docker ps | grep <name>

# Check what port it's on
docker port <container>

# Test from inside container
docker exec -it <container> curl localhost:<port>
```

---

## Git Issues

### Push Rejected

```bash
# If remote has changes
git pull --rebase origin main
git push origin main

# If history diverged (careful!)
git push origin main --force
```

### Accidentally Committed Secrets

```bash
# 1. Rotate the secret immediately

# 2. Remove from history
pip install git-filter-repo
git filter-repo --path <file-with-secret> --invert-paths --force

# 3. Re-add remote and force push
git remote add origin <url>
git push origin main --force

# 4. Rebuild (history rewrite can affect dist/)
npm run build
```

---

## SSL/HTTPS Issues

### Certificate Expired

```bash
# Check expiry
echo | openssl s_client -servername zaylegend.com -connect zaylegend.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew with certbot
sudo certbot renew

# If auto-renew failed
sudo certbot certonly --nginx -d zaylegend.com
```

### Mixed Content Warnings

**Cause:** HTTP resources loaded on HTTPS page.

```bash
# Find HTTP references
grep -r "http://" src/ --include="*.ts" --include="*.tsx"

# Fix: change to https:// or //
```

---

## Performance Issues

### Slow Page Load

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check nginx connections
sudo netstat -an | grep :443 | wc -l
```

### High Memory Usage

```bash
# Find memory hogs
ps aux --sort=-%mem | head -10

# Restart Docker to free memory
docker system prune -f
```

---

## Email Issues

### Emails Not Sending

```bash
# Test SMTP connection
./scripts/send-email.py test@example.com "Test" "Test body"

# Check mail logs
sudo tail -50 /var/log/mail.log

# Common issues:
# - Gmail app password expired
# - SPF/DKIM not configured for external delivery
```

---

## Emergency Procedures

### Site Completely Down

```bash
# 1. Check nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx

# 2. Check if dist exists
ls -la dist/index.html

# 3. If dist missing, rebuild
npm run build

# 4. Check disk space
df -h
```

### Restore from Backup

```bash
# Find latest backup
ls -la backups/dist_*.tar.gz

# Restore
tar -xzf backups/dist_YYYYMMDD_HHMMSS.tar.gz

# Verify
curl -I https://zaylegend.com/
```

### Rollback Git Changes

```bash
# Find last working commit
git log --oneline -20

# Reset to it
git reset --hard <commit-hash>

# Rebuild
npm run build
```
