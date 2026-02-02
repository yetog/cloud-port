#!/bin/bash
# =============================================================================
# Deploy Testing App Script
# =============================================================================
# Usage: ./deploy-testing-app.sh <app-folder-name> <url-slug> <port>
# Example: ./deploy-testing-app.sh my-new-app my-app 3018
#
# This script handles:
# 1. Fixing vite.config.ts with correct base path
# 2. Adding basename to BrowserRouter in App.tsx
# 3. Building the app
# 4. Creating and starting Docker container
# 5. Adding nginx configuration
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 3 ]; then
    echo -e "${RED}Usage: $0 <app-folder-name> <url-slug> <port>${NC}"
    echo "Example: $0 my-new-app my-app 3018"
    exit 1
fi

APP_FOLDER=$1
URL_SLUG=$2
PORT=$3
APP_PATH="/var/www/zaylegend/apps/testing/$APP_FOLDER"

echo -e "${GREEN}=== Deploying Testing App ===${NC}"
echo "App folder: $APP_FOLDER"
echo "URL slug: /$URL_SLUG/"
echo "Port: $PORT"
echo ""

# Check if app folder exists
if [ ! -d "$APP_PATH" ]; then
    echo -e "${RED}Error: App folder not found at $APP_PATH${NC}"
    exit 1
fi

cd "$APP_PATH"

# =============================================================================
# Step 1: Fix vite.config.ts
# =============================================================================
echo -e "${YELLOW}Step 1: Fixing vite.config.ts...${NC}"

cat > vite.config.ts << EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/$URL_SLUG/',
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
EOF

echo -e "${GREEN}✓ vite.config.ts updated with base: '/$URL_SLUG/'${NC}"

# =============================================================================
# Step 2: Fix BrowserRouter basename in App.tsx
# =============================================================================
echo -e "${YELLOW}Step 2: Fixing BrowserRouter basename...${NC}"

if grep -q "<BrowserRouter>" src/App.tsx 2>/dev/null; then
    sed -i "s/<BrowserRouter>/<BrowserRouter basename=\"\/$URL_SLUG\">/" src/App.tsx
    echo -e "${GREEN}✓ Added basename=\"/$URL_SLUG\" to BrowserRouter${NC}"
elif grep -q "BrowserRouter basename" src/App.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ BrowserRouter already has basename${NC}"
else
    echo -e "${YELLOW}⚠ BrowserRouter not found in App.tsx - may need manual fix${NC}"
fi

# =============================================================================
# Step 3: Install dependencies if needed
# =============================================================================
echo -e "${YELLOW}Step 3: Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

# =============================================================================
# Step 4: Build the app
# =============================================================================
echo -e "${YELLOW}Step 4: Building app...${NC}"

npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist folder not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# =============================================================================
# Step 5: Create Dockerfile if needed
# =============================================================================
echo -e "${YELLOW}Step 5: Creating Dockerfile...${NC}"

cat > Dockerfile.simple << 'EOF'
FROM nginx:alpine
COPY dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

echo -e "${GREEN}✓ Dockerfile.simple created${NC}"

# =============================================================================
# Step 6: Build and run Docker container
# =============================================================================
echo -e "${YELLOW}Step 6: Building Docker image...${NC}"

# Stop and remove existing container if it exists
docker stop "$APP_FOLDER" 2>/dev/null || true
docker rm "$APP_FOLDER" 2>/dev/null || true

# Build new image
docker build -f Dockerfile.simple -t "$APP_FOLDER" .

# Run container
docker run -d --name "$APP_FOLDER" -p "$PORT:80" --restart unless-stopped "$APP_FOLDER"

echo -e "${GREEN}✓ Docker container '$APP_FOLDER' running on port $PORT${NC}"

# =============================================================================
# Step 7: Show nginx config to add
# =============================================================================
echo ""
echo -e "${YELLOW}Step 7: Add this to /etc/nginx/conf.d/portfolio.conf:${NC}"
echo ""
echo "    # $APP_FOLDER"
echo "    location /$URL_SLUG {"
echo "        return 301 /$URL_SLUG/;"
echo "    }"
echo "    location /$URL_SLUG/ {"
echo "        proxy_pass http://127.0.0.1:$PORT/;"
echo "        proxy_set_header Host \$host;"
echo "        proxy_set_header X-Real-IP \$remote_addr;"
echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
echo "    }"
echo ""

# =============================================================================
# Step 8: Show apps.ts entry to add
# =============================================================================
echo -e "${YELLOW}Step 8: Add this to /var/www/zaylegend/src/data/apps.ts (testingApps array):${NC}"
echo ""
echo "  {"
echo "    id: '$APP_FOLDER',"
echo "    title: 'APP_TITLE_HERE',"
echo "    description: 'APP_DESCRIPTION_HERE',"
echo "    image: ASSETS.apps.zenReset,"
echo "    tags: ['TAG1', 'TAG2'],"
echo "    status: 'testing',"
echo "    appUrl: 'https://zaylegend.com/$URL_SLUG',"
echo "    githubUrl: 'https://github.com/yetog/$APP_FOLDER',"
echo "  },"
echo ""

# =============================================================================
# Done!
# =============================================================================
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Add the nginx config above (before '# SSL configuration')"
echo "2. Run: sudo nginx -s reload"
echo "3. Add the app entry to apps.ts"
echo "4. Run: cd /var/www/zaylegend && npm run build"
echo "5. Test: curl -s -o /dev/null -w '%{http_code}' http://localhost/$URL_SLUG/"
echo ""
echo -e "${GREEN}App URL: https://zaylegend.com/$URL_SLUG/${NC}"
