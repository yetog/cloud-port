# Nginx Conventions

> Our nginx patterns and configurations. Reference before editing nginx configs.

---

## Config Location

```
/etc/nginx/conf.d/portfolio.conf
```

Always test before reload:
```bash
sudo nginx -t && sudo nginx -s reload
```

---

## Pattern 1: Static SPA (Most Apps)

For Vite/React apps served from a subdirectory:

```nginx
location /app-name/ {
    alias /var/www/zaylegend/apps/app-name/dist/;
    try_files $uri $uri/ /app-name/index.html;
}
```

**Requirements:**
- `vite.config.ts`: `base: '/app-name/'`
- Router: `basename="/app-name"`

---

## Pattern 2: Proxied Docker App

For apps running in Docker containers:

```nginx
location /docker-app/ {
    proxy_pass http://localhost:3015/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**Note:** Trailing slash on `proxy_pass` strips the location prefix.

---

## Pattern 3: WebSocket Support

For apps with real-time features:

```nginx
location /realtime-app/ {
    proxy_pass http://localhost:3016/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;  # 24 hours for long-lived connections
}
```

---

## Pattern 4: API Proxy

For backend API routes:

```nginx
location /api/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # CORS headers if needed
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Authorization, Content-Type";
}
```

---

## Pattern 5: Static Files with Caching

For assets that rarely change:

```nginx
location /assets/ {
    alias /var/www/zaylegend/dist/assets/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Security Headers (Applied Globally)

```nginx
# In server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name zaylegend.com;

    ssl_certificate /etc/letsencrypt/live/zaylegend.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zaylegend.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
}
```

---

## HTTP to HTTPS Redirect

```nginx
server {
    listen 80;
    server_name zaylegend.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Port Assignments

| Port | App | Type |
|------|-----|------|
| 8080 | Main Portfolio | Static |
| 8081 | Zen Reset | Static |
| 3001 | Chord Genesis | Static |
| 3003 | Fineline | Static |
| 3004 | Game Hub | Static |
| 3005 | DJ Visualizer | Static |
| 3006 | Sprite Gen | Static |
| 3007 | Voice Assistant | Docker |
| 3008 | Knowledge Base | Static |
| 3009 | ContentForge | Static |
| 3010-3019 | Testing Apps | Mixed |

---

## Debugging Commands

```bash
# Test config syntax
sudo nginx -t

# Check error log
sudo tail -50 /var/log/nginx/error.log

# Check access log
sudo tail -50 /var/log/nginx/access.log

# Check what's listening on a port
sudo lsof -i :3015

# Reload without downtime
sudo nginx -s reload
```

---

## Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Missing trailing slash in proxy_pass | Path duplication | Add `/` at end |
| Missing try_files | 404 on SPA refresh | Add `try_files $uri $uri/ /app/index.html` |
| Wrong alias path | 404 on all requests | Check path exists |
| Forgot nginx reload | Changes not applied | `sudo nginx -s reload` |
| Duplicate location blocks | Config error | Remove duplicate |
