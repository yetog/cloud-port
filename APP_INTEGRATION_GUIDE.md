# Portfolio App Integration Guide

## Quick Start: Adding a New App

```bash
./scripts/add-new-app.sh <app-name> <port> <github-url> [app-title] [description]
```

**Example:**
```bash
./scripts/add-new-app.sh todo-app 3007 https://github.com/user/todo-app "Todo Master" "A powerful task management application"
```

## Manual Integration Checklist

If you need to add an app manually, follow this checklist:

### 1. Repository Setup ✅
- [ ] Clone app to `/var/www/zaylegend/apps/`
- [ ] Ensure app has `package.json` with build script
- [ ] Test local build: `npm run build`

### 2. React Router Configuration ✅
**Critical: This prevents 404 errors!**

In `src/App.tsx` or `src/App.jsx`:
```tsx
// ❌ Wrong (causes 404s)
<BrowserRouter>

// ✅ Correct
<BrowserRouter basename="/app-name">
```

### 3. Vite Configuration ✅
In `vite.config.ts`:
```typescript
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/app-name/',
  // ... other config
});
```

### 4. Docker Configuration ✅
Create `Dockerfile` with proper build args:
```dockerfile
# Build args for base path configuration
ARG VITE_BASE_PATH=/app-name/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
```

### 5. Build and Deploy ✅
```bash
# Build with correct base path
docker build --build-arg VITE_BASE_PATH=/app-name/ -t app-name .

# Run container
docker run -d --name app-name -p PORT:80 app-name:latest
```

### 6. Nginx Configuration ✅
Add to `/var/www/zaylegend/portfolio-infra/nginx/conf.d/portfolio.conf`:
```nginx
# app-name
location /app-name {
    return 301 /app-name/;
}

location /app-name/ {
    proxy_pass http://127.0.0.1:PORT/;
    # ... proxy headers
}
```

### 7. Portfolio Integration ✅
Add to `/var/www/zaylegend/portfolio/src/data/apps.ts`:
```typescript
{
  id: 'app-name',
  title: 'App Title',
  description: 'App description',
  image: ASSETS.apps.appName,
  tags: ['React', 'Vite'],
  appUrl: 'https://zaylegend.com/app-name',
  githubUrl: 'https://github.com/user/app-name',
},
```

### 8. Testing ✅
- [ ] App loads at `https://zaylegend.com/app-name/`
- [ ] No 404 errors in browser console
- [ ] Assets load correctly
- [ ] Navigation within app works
- [ ] Appears in portfolio carousel

## Port Management

### Assigned Ports:
- 8080: Portfolio main site
- 8081: zen-reset
- 3002: chord-genesis
- 3003: fineline
- 3004: game-hub
- 3005: dj-visualizer
- 3006: spritegen
- **Available: 3007, 3008, 3009...**

## Common Issues & Solutions

### Issue: 404 "User attempted to access non-existent route"
**Cause:** Missing `basename` in BrowserRouter
**Fix:** Add `basename="/app-name"` to BrowserRouter

### Issue: Assets return 404
**Cause:** Missing base path in vite.config
**Fix:** Add `base: '/app-name/'` to vite.config

### Issue: Docker build uses wrong paths
**Cause:** Missing VITE_BASE_PATH build arg
**Fix:** Use `--build-arg VITE_BASE_PATH=/app-name/`

### Issue: App shows blank page
**Cause:** JavaScript errors, check browser console
**Fix:** Ensure all dependencies are installed and built correctly

## Optimization Tips

### Performance:
- Use `npm run build` for production builds
- Enable gzip in nginx (already configured)
- Optimize images and assets
- Consider lazy loading for large apps

### Security:
- Never commit secrets to repositories
- Use environment variables for API keys
- Keep dependencies updated
- Use HTTPS only (already configured)

### Monitoring:
- Check `docker logs <app-name>` for errors
- Monitor nginx logs: `tail -f /var/log/nginx/access.log`
- Use `docker ps` to check container status

## Knowledge Base Integration Options

For your HTML knowledge base, consider:

### Option 1: Static HTML (Simplest)
```bash
mkdir /var/www/zaylegend/apps/knowledge-base
cp your-knowledge.html /var/www/zaylegend/apps/knowledge-base/index.html
# Add nginx static serving configuration
```

### Option 2: Convert to React App
- Convert HTML to React components
- Add search functionality
- Make it responsive
- Follow same deployment process

### Option 3: Documentation Site (Recommended)
- Use tools like VitePress, Docusaurus, or GitBook
- Version control your documentation
- Search functionality built-in
- Easy to maintain

## Automation Scripts

### Available Scripts:
- `./scripts/add-new-app.sh` - Full app deployment
- `./scripts/build-apps.sh` - Rebuild all apps
- `./scripts/update-apps.sh` - Pull and rebuild apps

### Create Custom Scripts:
```bash
# Quick app update
./scripts/update-single-app.sh app-name

# Health check
./scripts/health-check.sh

# Backup before changes
./scripts/backup-config.sh
```

## Best Practices

1. **Always test locally first** before deploying
2. **Use consistent naming** (kebab-case for app names)
3. **Document your apps** in the portfolio description
4. **Keep Docker images lightweight** (use alpine base images)
5. **Monitor resource usage** (`docker stats`)
6. **Backup configurations** before major changes
7. **Use semantic versioning** for your apps
8. **Test on mobile** - ensure responsive design

## Troubleshooting Commands

```bash
# Check all container status
docker ps -a

# View app logs
docker logs app-name --tail 50

# Test nginx config
sudo nginx -t

# Reload nginx safely
sudo systemctl reload nginx

# Check port usage
netstat -tulnp | grep :PORT

# Free up space
docker system prune -a
```