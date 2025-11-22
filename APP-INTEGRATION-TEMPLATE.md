# Portfolio Apps Integration Template

## 🎯 Purpose
Standardized CI/CD template for adding new Vite apps to the zaylegend.com portfolio with clean integration and automated deployments.

## 📋 Prerequisites

### Required Tools
- Docker & Docker Compose
- Git (with SSH keys configured)
- Node.js 18+ (for local development)
- nginx (configured on server)

### Directory Structure
```
/var/www/zaylegend/
├── apps/
│   ├── your-new-app/           # New app goes here
│   ├── fineline/               # Example existing app
│   ├── chord-genesis/          # Example existing app
│   └── deployment-scripts/     # Shared deployment utilities
├── portfolio/                  # Main portfolio site
├── portfolio-infra/
│   └── nginx/
│       └── conf.d/
│           └── portfolio.conf  # Main nginx config
└── APP-INTEGRATION-TEMPLATE.md # This file
```

## 🚀 Step-by-Step Integration Guide

### Step 1: Prepare Your Vite App

#### 1.1 Vite Configuration
Create/update `vite.config.ts` in your app:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
```

#### 1.2 Dockerfile Template
Create `Dockerfile` in your app root:

```dockerfile
# Multi-stage build for Vite app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build argument for base path
ARG VITE_BASE_PATH=/your-app-name/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx for SPA routing
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 1.3 Package.json Scripts
Ensure your `package.json` has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "./scripts/deploy.sh"
  }
}
```

### Step 2: Deploy Your App

#### 2.1 Choose Available Port
Check existing app ports:
```bash
docker ps | grep -E ":(300[0-9])->"
```

Common port assignments:
- 3002: chord-genesis  
- 3003: fineline
- 3004: game-hub
- 3005: dj-visualizer
- 3006: spritegen
- 3007: voice-assistant
- **3008: YOUR-NEW-APP** ← Next available

#### 2.2 Build and Deploy Script
Create `scripts/deploy.sh` in your app:

```bash
#!/bin/bash
set -e

APP_NAME="your-app-name"
APP_PORT="3008"  # Update to your assigned port
BASE_PATH="/${APP_NAME}/"

echo "🚀 Deploying ${APP_NAME}..."

# Stop and remove existing container
docker stop ${APP_NAME} 2>/dev/null || true
docker rm ${APP_NAME} 2>/dev/null || true

# Build new image
docker build \
  --build-arg VITE_BASE_PATH=${BASE_PATH} \
  -t ${APP_NAME}:latest .

# Run new container
docker run -d \
  --name ${APP_NAME} \
  -p ${APP_PORT}:80 \
  --restart unless-stopped \
  ${APP_NAME}:latest

echo "✅ ${APP_NAME} deployed on port ${APP_PORT}"
echo "🌐 Access at: https://zaylegend.com${BASE_PATH}"
```

#### 2.3 Execute Deployment
```bash
cd /var/www/zaylegend/apps/your-app-name
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Step 3: Update Nginx Configuration

#### 3.1 Add App Route
Edit `/etc/nginx/conf.d/portfolio.conf`:

```nginx
# Add before the SSL configuration section

# your-app-name
location /your-app-name {
    return 301 /your-app-name/;
}

location /your-app-name/ {
    proxy_pass http://127.0.0.1:3008/;  # Your assigned port
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    
    # Handle WebSocket upgrades (if needed)
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # Standard timeouts
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
}
```

#### 3.2 Test and Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Add to Portfolio Navigation

#### 4.1 Update Portfolio Data
Edit `/var/www/zaylegend/portfolio/src/data/apps.ts`:

```typescript
export const apps = [
  // ... existing apps
  {
    id: 'your-app-name',
    title: 'Your App Title',
    description: 'Brief description of your app',
    href: '/your-app-name',
    image: '/images/your-app-screenshot.png',
    tags: ['React', 'TypeScript', 'Vite'],
    featured: true, // Set to true if you want it in featured carousel
    status: 'active'
  }
]
```

#### 4.2 Rebuild Portfolio
```bash
cd /var/www/zaylegend/portfolio
npm run build
# Portfolio service automatically serves new build
```

## 🔄 CI/CD Pipeline Template

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml` in your app repository:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build app
      run: npm run build
      env:
        VITE_BASE_PATH: /your-app-name/
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/zaylegend/apps/your-app-name
          git pull origin main
          ./scripts/deploy.sh
```

### Required GitHub Secrets
- `HOST`: Your server IP/domain
- `USERNAME`: SSH username  
- `SSH_KEY`: Private SSH key for deployment

## 🧪 Testing Checklist

### Pre-deployment Tests
- [ ] `npm run build` succeeds locally
- [ ] `docker build` succeeds  
- [ ] App works on `http://localhost:PORT`

### Post-deployment Tests
- [ ] `https://zaylegend.com/your-app-name/` loads
- [ ] No console errors in browser DevTools
- [ ] Assets load with correct MIME types
- [ ] App works on mobile devices
- [ ] All interactive features function

### Nginx Tests
```bash
# Test nginx configuration
sudo nginx -t

# Test app routing
curl -I https://zaylegend.com/your-app-name/

# Test asset loading
curl -I https://zaylegend.com/your-app-name/assets/index-HASH.js
```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Blank Screen / MIME Type Errors
**Problem**: JavaScript files served as HTML
**Solution**: Rebuild app container to generate new asset hashes
```bash
./scripts/deploy.sh
```

#### 2. 404 Not Found
**Problem**: Nginx routing not configured
**Solution**: Check nginx configuration and reload
```bash
sudo nginx -t && sudo systemctl reload nginx
```

#### 3. Assets Not Loading
**Problem**: Incorrect base path configuration
**Solution**: Verify `VITE_BASE_PATH` in Dockerfile and build

#### 4. Container Won't Start
**Problem**: Port conflict or build error
**Solution**: Check logs and available ports
```bash
docker logs your-app-name
docker ps | grep 300[0-9]
```

## 📚 Best Practices

### Development
- Always test locally before deploying
- Use semantic versioning for releases
- Keep dependencies updated
- Write comprehensive tests

### Deployment  
- Use multi-stage Docker builds
- Generate new asset hashes for cache-busting
- Monitor container health after deployment
- Keep nginx configuration simple

### Maintenance
- Regular security updates
- Monitor application logs
- Backup configuration files
- Document any custom modifications

## 🔗 Useful Commands

```bash
# View all running apps
docker ps | grep -E "(fineline|chord-genesis|game-hub)"

# Check nginx access logs
tail -f /var/log/nginx/access.log

# Rebuild all apps (emergency reset)
cd /var/www/zaylegend/apps && for app in fineline chord-genesis game-hub; do
  cd $app && ./scripts/deploy.sh && cd ..
done

# Test all app endpoints
for app in fineline chord-genesis game-hub; do
  echo "Testing $app..."
  curl -I https://zaylegend.com/$app/
done
```

---

## 📝 Documentation Updates

After successful integration:
1. Update this template with app-specific notes
2. Add app to main portfolio README
3. Update monitoring/health check scripts
4. Commit changes to git repository

**Remember**: Each app should be self-contained, follow consistent patterns, and integrate cleanly with the overall portfolio architecture.

---
*Template Version: 1.0*  
*Last Updated: October 7, 2025*  
*Tested With: Vite 5.x, React 18.x, Node 18.x*