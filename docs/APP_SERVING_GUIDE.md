# App Serving Infrastructure Guide

> How apps are served on zaylegend.com
> Last Updated: 2026-01-30

---

## Current Status

### Running Docker Containers (8)

| Container | Host Port | App Port | Status |
|-----------|-----------|----------|--------|
| chord-genesis | 3001 | 80 | Running |
| fineline | 3003 | 80 | Running |
| game-hub | 3004 | 80 | Running |
| dj-visualizer | 3005 | 80 | Running |
| spritegen | 3006 | 80 | Running |
| voice-assistant-frontend | 3007 | 80 | Running (unhealthy) |
| voice-assistant-backend | 5007 | 5001 | Running |
| zen-reset-new | 8081 | 80 | Running |

### Accessible URLs

| App | URL | Method |
|-----|-----|--------|
| Portfolio | https://zaylegend.com/ | Vite preview (8080) |
| Zen Reset | https://zaylegend.com/zen-reset | Docker |
| Chord Genesis | https://zaylegend.com/chord-genesis | Docker |
| Fineline | https://zaylegend.com/fineline | Docker |
| Game Hub | https://zaylegend.com/game-hub | Docker |
| DJ Visualizer | https://zaylegend.com/dj-visualizer | Docker |
| Sprite Gen | https://zaylegend.com/spritegen | Docker |
| Voice Assistant | https://zaylegend.com/voice-assistant | Docker |
| Knowledge Base | https://zaylegend.com/knowledge-base | Static (Nginx) |
| ContentForge | https://zaylegend.com/contentforge | Docker (port 3009) |

---

## Architecture

```
Internet
    │
    ▼
[Nginx] ─────► Port 443 (SSL)
    │
    ├── /                  ► 127.0.0.1:8080 (Portfolio)
    ├── /zen-reset/        ► 127.0.0.1:8081 (Docker)
    ├── /chord-genesis/    ► 127.0.0.1:3001 (Docker)
    ├── /fineline/         ► 127.0.0.1:3003 (Docker)
    ├── /game-hub/         ► 127.0.0.1:3004 (Docker)
    ├── /dj-visualizer/    ► 127.0.0.1:3005 (Docker)
    ├── /spritegen/        ► 127.0.0.1:3006 (Docker)
    ├── /voice-assistant/  ► 127.0.0.1:3007 (Docker)
    ├── /contentforge/     ► 127.0.0.1:3009 (Docker)
    └── /knowledge-base/   ► Static files
```

---

## Serving a New Vite App

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile for Vite App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Important: Set base path for subpath routing
ARG VITE_BASE_PATH=/app-name/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN npm run build

# Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf (in app folder)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location ~* \.(js|mjs)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Content-Type "application/javascript; charset=utf-8";
        try_files $uri =404;
    }

    location ~* \.css$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Content-Type "text/css; charset=utf-8";
        try_files $uri =404;
    }

    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 3: Update vite.config.ts

```typescript
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  // ... other config
})
```

### Step 4: Build & Run Docker

```bash
cd /var/www/zaylegend/apps/app-name
docker build -t app-name .
docker run -d --name app-name -p 30XX:80 --restart unless-stopped app-name
```

### Step 5: Add Nginx Location

Add to `/etc/nginx/conf.d/portfolio.conf`:

```nginx
location /app-name {
    return 301 /app-name/;
}

location /app-name/ {
    proxy_pass http://127.0.0.1:30XX/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Then reload: `sudo nginx -s reload`

### Step 6: Update apps.ts

Add `appUrl` to the app entry:

```typescript
{
  id: 'app-name',
  // ...
  appUrl: 'https://zaylegend.com/app-name',
}
```

---

## Port Allocation

### Reserved Ports
- 8080: Main Portfolio
- 8081: Zen Reset
- 3001: Chord Genesis
- 3003: Fineline
- 3004: Game Hub
- 3005: DJ Visualizer
- 3006: Sprite Gen
- 3007: Voice Assistant Frontend
- 3009: ContentForge
- 5007: Voice Assistant Backend

### Available for Testing Apps (7)
| Port | App | Status |
|------|-----|--------|
| 3010 | darkflow-mind-mapper | Available |
| 3011 | bh-ai-79 | Available |
| 3012 | gmat-mastery-suite | Available |
| 3013 | losk | Available |
| 3014 | got-hired-ai | Available |
| 3015 | zen-tot | Available |
| 3016 | purple-lotus | Available (Expo - needs special handling) |

### Available for Upgrading Apps (4)
| Port | App | Status |
|------|-----|--------|
| 3020 | ask-hr-beta | Available |
| 3021 | sensei-ai-io | Available |
| 3022 | sop-ai-beta | Available |
| N/A | Ashley-v3 | Hosted externally on Streamlit |

---

## App Types & Requirements

### Standard Vite + React Apps
Most apps use: `vite_react_shadcn_ts` template
- darkflow-mind-mapper
- gmat-mastery-suite
- losk
- got-hired-ai
- zen-tot
- ask-hr-beta
- sensei-ai-io
- sop-ai-beta
- bh-ai-79

**Requirement:** Dockerfile + nginx.conf + vite.config base path

### Apps with Backend (Python)
Some apps have `app.py` (Flask/FastAPI/Streamlit):
- got-hired-ai
- ask-hr-beta
- sensei-ai-io
- sop-ai-beta

**Requirement:** Docker Compose for frontend + backend

### Expo/React Native Apps
- purple-lotus

**Requirement:** Expo web build, different Dockerfile

### Already Hosted Externally
- Ashley-v3 (https://ashley-v3.streamlit.app/)
- Sensei AI (https://sensei.zaylegend.com/)
- Wolf AI (https://huggingface.co/spaces/Agents-MCP-Hackathon/Wolf-AI-yetog)

---

## Common Commands

```bash
# Check running containers
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"

# View container logs
docker logs <container-name>

# Restart container
docker restart <container-name>

# Rebuild and restart
cd /var/www/zaylegend/apps/<app-name>
docker build -t <app-name> .
docker stop <app-name> && docker rm <app-name>
docker run -d --name <app-name> -p 30XX:80 --restart unless-stopped <app-name>

# Reload nginx
sudo nginx -s reload

# Test nginx config
sudo nginx -t
```

---

## Troubleshooting

### App shows 502 Bad Gateway
- Check if container is running: `docker ps`
- Check container logs: `docker logs <container-name>`
- Verify port mapping matches nginx config

### Static assets not loading
- Check browser console for 404s
- Verify VITE_BASE_PATH matches nginx location
- Check nginx.conf in container handles static files

### Unhealthy container
- Check logs: `docker logs <container-name>`
- Restart: `docker restart <container-name>`
- Rebuild if needed
