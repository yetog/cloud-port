#!/bin/bash

# Portfolio App Integration Script
# Usage: ./add-new-app.sh <app-name> <port> <github-url> [app-title] [description]

set -e

APP_NAME="$1"
PORT="$2" 
GITHUB_URL="$3"
APP_TITLE="${4:-$APP_NAME}"
DESCRIPTION="${5:-A new application}"

if [ $# -lt 3 ]; then
    echo "Usage: $0 <app-name> <port> <github-url> [app-title] [description]"
    echo "Example: $0 my-app 3007 https://github.com/user/my-app 'My App' 'Description of my app'"
    exit 1
fi

APPS_DIR="/var/www/zaylegend/apps"
NGINX_CONF="/var/www/zaylegend/portfolio-infra/nginx/conf.d/portfolio.conf"
PORTFOLIO_APPS_FILE="/var/www/zaylegend/portfolio/src/data/apps.ts"

echo "🚀 Adding new app: $APP_NAME"
echo "   Port: $PORT"
echo "   GitHub: $GITHUB_URL"

# Step 1: Clone the repository
echo "📥 Cloning repository..."
cd "$APPS_DIR"
if [ -d "$APP_NAME" ]; then
    echo "   Directory exists, pulling latest changes..."
    cd "$APP_NAME"
    git pull
    cd ..
else
    git clone "$GITHUB_URL" "$APP_NAME"
fi

cd "$APP_NAME"

# Step 2: Check if it's a React/Vite app and fix router configuration
echo "🔧 Configuring React Router (if applicable)..."
if [ -f "src/App.tsx" ] || [ -f "src/App.jsx" ]; then
    # Check if BrowserRouter exists and add basename
    if grep -q "BrowserRouter" src/App.*; then
        echo "   Found React Router, adding basename configuration..."
        
        # Backup original
        cp src/App.tsx src/App.tsx.backup 2>/dev/null || cp src/App.jsx src/App.jsx.backup 2>/dev/null || true
        
        # Fix BrowserRouter basename
        if grep -q "BrowserRouter>" src/App.*; then
            sed -i "s/<BrowserRouter>/<BrowserRouter basename=\"\/$APP_NAME\">/g" src/App.*
            echo "   ✅ Added basename=\"/$APP_NAME\" to BrowserRouter"
        fi
    fi
fi

# Step 3: Check and fix vite.config
echo "🔧 Configuring Vite base path..."
if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
    # Check if base is already configured
    if ! grep -q "base:" vite.config.*; then
        # Add base configuration
        sed -i "/export default defineConfig/a\\  base: process.env.VITE_BASE_PATH || '/$APP_NAME/'," vite.config.*
        echo "   ✅ Added base path configuration to vite.config"
    else
        echo "   ℹ️  Base path already configured"
    fi
fi

# Step 4: Create/Update Dockerfile
echo "🐳 Creating Dockerfile..."
cat > Dockerfile << EOF
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build args for base path configuration
ARG VITE_BASE_PATH=/$APP_NAME/
ENV VITE_BASE_PATH=\${VITE_BASE_PATH}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \\
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \\
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \\
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \\
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \\
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \\
    echo '        try_files \$uri \$uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \\
    echo '    }' >> /etc/nginx/conf.d/default.conf && \\
    echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

echo "   ✅ Created Dockerfile"

# Step 5: Build and run Docker container
echo "🏗️  Building Docker image..."
docker build --build-arg VITE_BASE_PATH=/$APP_NAME/ -t $APP_NAME .

echo "🚀 Starting Docker container..."
# Stop existing container if it exists
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

# Start new container
docker run -d --name $APP_NAME -p $PORT:80 $APP_NAME:latest

# Step 6: Add nginx configuration
echo "🌐 Updating nginx configuration..."
# Create backup
cp "$NGINX_CONF" "$NGINX_CONF.backup"

# Add new app configuration before the static assets section
NEW_CONFIG="
    # $APP_NAME
    location /$APP_NAME {
        return 301 /$APP_NAME/;
    }
    
    location /$APP_NAME/ {
        proxy_pass http://127.0.0.1:$PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        
        # Handle WebSocket upgrades
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
"

# Insert before the static assets section
sed -i "/# Static assets caching/i\\$NEW_CONFIG" "$NGINX_CONF"

echo "   ✅ Added nginx configuration for $APP_NAME"

# Step 7: Reload nginx
echo "🔄 Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Step 8: Add to portfolio apps data
echo "📝 Adding to portfolio apps.ts..."
# Create the new app entry
NEW_APP_ENTRY="  {
    id: '$APP_NAME',
    title: '$APP_TITLE',
    description: '$DESCRIPTION',
    image: ASSETS.apps.placeholder || '/placeholder.svg',
    tags: ['React', 'Vite', 'TypeScript'],
    appUrl: 'https://zaylegend.com/$APP_NAME',
    githubUrl: '$GITHUB_URL',
  },"

# Add before the closing bracket
sed -i "/^];$/i\\$NEW_APP_ENTRY" "$PORTFOLIO_APPS_FILE"

echo "   ✅ Added $APP_NAME to portfolio apps"

# Step 9: Rebuild portfolio (optional)
echo "🏗️  Rebuilding portfolio..."
cd /var/www/zaylegend/portfolio
npm run build

echo ""
echo "🎉 SUCCESS! App '$APP_NAME' has been deployed!"
echo ""
echo "📋 Summary:"
echo "   • App URL: https://zaylegend.com/$APP_NAME/"
echo "   • Container: $APP_NAME (port $PORT)"
echo "   • Status: $(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep $APP_NAME || echo 'Not running')"
echo ""
echo "🔍 Next steps:"
echo "   1. Test your app: https://zaylegend.com/$APP_NAME/"
echo "   2. Update the app description in $PORTFOLIO_APPS_FILE"
echo "   3. Add a proper image asset to replace placeholder"
echo "   4. Consider adding the app to your main portfolio navigation"
echo ""
echo "🚨 If there are issues:"
echo "   • Check logs: docker logs $APP_NAME"
echo "   • Check nginx: sudo nginx -t"
echo "   • Restore nginx backup: cp $NGINX_CONF.backup $NGINX_CONF"