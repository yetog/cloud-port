# Testing App Deployment Guide

> How to deploy React apps to the testing environment without routing issues.

## The Problem

React apps use client-side routing (React Router). When deployed under a subpath like `/my-app/`, two things need to be configured:

1. **Vite `base` path** - Tells Vite where to load JS/CSS assets from
2. **React Router `basename`** - Tells React Router what the base URL is

Without both, you'll get either:
- 404 on assets (JS/CSS won't load)
- React Router 404 inside the app ("User attempted to access non-existent route")

## Quick Deploy (Automated)

Use the deployment script:

```bash
cd /var/www/zaylegend
./scripts/deploy-testing-app.sh <folder-name> <url-slug> <port>

# Example:
./scripts/deploy-testing-app.sh my-new-app my-app 3018
```

The script will:
1. Fix `vite.config.ts` with correct `base` path
2. Add `basename` to `BrowserRouter` in `App.tsx`
3. Build the app
4. Create and start Docker container
5. Show you what to add to nginx and `apps.ts`

## Manual Deploy

### Step 1: Fix vite.config.ts

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/my-app/',  // <-- IMPORTANT: Your URL slug with slashes
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Step 2: Fix React Router basename

In `src/App.tsx`, find `<BrowserRouter>` and add `basename`:

```tsx
// Before
<BrowserRouter>

// After
<BrowserRouter basename="/my-app">
```

### Step 3: Build the app

```bash
cd /var/www/zaylegend/apps/testing/my-new-app
npm install
npm run build
```

### Step 4: Create Dockerfile

Create `Dockerfile.simple`:

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 5: Build and run Docker

```bash
docker build -f Dockerfile.simple -t my-new-app .
docker run -d --name my-new-app -p 3018:80 --restart unless-stopped my-new-app
```

### Step 6: Add nginx config

Edit `/etc/nginx/conf.d/portfolio.conf` and add before `# SSL configuration`:

```nginx
# My New App
location /my-app {
    return 301 /my-app/;
}
location /my-app/ {
    proxy_pass http://127.0.0.1:3018/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Then reload:
```bash
sudo nginx -s reload
```

### Step 7: Add to portfolio

Edit `/var/www/zaylegend/src/data/apps.ts` and add to `testingApps`:

```typescript
{
  id: 'my-new-app',
  title: 'My New App',
  description: 'Description here',
  image: ASSETS.apps.zenReset,
  tags: ['Tag1', 'Tag2'],
  status: 'testing',
  appUrl: 'https://zaylegend.com/my-app',
  githubUrl: 'https://github.com/yetog/my-new-app',
},
```

Rebuild portfolio:
```bash
cd /var/www/zaylegend
npm run build
```

## Port Allocation

| Port Range | Usage |
|------------|-------|
| 3001-3009 | Finished apps |
| 3010-3019 | Testing apps |
| 3020-3029 | Upgrading apps |

Current testing app ports:
- 3010: darkflow-mind-mapper
- 3012: gmat-mastery-suite
- 3013: losk
- 3014: got-hired-ai
- 3015: bh-ai-79
- 3016: purple-lotus
- 3017: zen-tot

## Troubleshooting

### "404 Error: User attempted to access non-existent route"
- BrowserRouter is missing `basename` prop
- Fix: `<BrowserRouter basename="/your-slug">`

### Assets return 404 (JS/CSS not loading)
- Vite `base` path is wrong or missing
- Fix: Add `base: '/your-slug/'` to vite.config.ts

### App loads but links broken
- Make sure internal links use relative paths, not absolute
- `<Link to="/about">` works with basename set

### Rebuilding an existing app
```bash
cd /var/www/zaylegend/apps/testing/<app-name>
npm run build
docker stop <app-name> && docker rm <app-name>
docker build -f Dockerfile.simple -t <app-name> .
docker run -d --name <app-name> -p <port>:80 --restart unless-stopped <app-name>
```
