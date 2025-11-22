# Automation Tools

Production-ready scripts for portfolio management, application deployment, and infrastructure automation. These tools have been battle-tested in the zaylegend.com production environment.

## Overview

This collection includes deployment automation, app integration tools, and monitoring scripts that handle the complete lifecycle of React/Vite applications in a containerized portfolio infrastructure.

## Contents

- [Portfolio App Deployment Script](#portfolio-app-deployment-script)
- [New App Integration Script](#new-app-integration-script)
- [Monitoring and Health Checks](#monitoring-and-health-checks)

---

## Portfolio App Deployment Script

### Purpose
The `deploy-portfolio-app.sh` script provides a complete deployment workflow for React/Vite applications with Docker containerization, port management, and health checking.

### Features
- ✅ **Automated Docker build and deployment**
- ✅ **Port conflict detection and management**
- ✅ **Health checks and validation**
- ✅ **Nginx configuration guidance**
- ✅ **Rollback support via container replacement**
- ✅ **JavaScript asset validation**

### Usage
```bash
./deploy-portfolio-app.sh <app-name> <port> [rebuild]

# Examples
./deploy-portfolio-app.sh fineline 3003 rebuild     # Force rebuild fineline
./deploy-portfolio-app.sh new-app 3008              # Deploy new app
```

### Key Features Explained

**Port Management**: Automatically detects port conflicts and provides interactive prompts for resolution.

**Health Validation**: Tests both direct container access and nginx proxy routing to ensure complete functionality.

**Asset Testing**: Validates that JavaScript files are serving correctly and contain expected code patterns.

**Error Recovery**: Provides detailed troubleshooting commands and rollback procedures if deployment fails.

### Full Script

```bash
#!/bin/bash
set -e

# Portfolio App Deployment Script
# Usage: ./deploy-portfolio-app.sh <app-name> <port> [rebuild]

APP_NAME="$1"
APP_PORT="$2"
REBUILD_FORCE="$3"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Validation
if [[ -z "$APP_NAME" || -z "$APP_PORT" ]]; then
    log_error "Usage: $0 <app-name> <port> [rebuild]"
    echo ""
    echo "Examples:"
    echo "  $0 fineline 3003 rebuild     # Force rebuild fineline"
    echo "  $0 new-app 3008              # Deploy new app"
    echo ""
    echo "Available ports: 3008-3020 (check with: docker ps | grep 300)"
    exit 1
fi

APP_DIR="/var/www/zaylegend/apps/${APP_NAME}"
BASE_PATH="/${APP_NAME}/"

# Check if app directory exists
if [[ ! -d "$APP_DIR" ]]; then
    log_error "App directory not found: $APP_DIR"
    log_info "Create the app directory and add your Vite project first"
    exit 1
fi

# Check if port is available
if docker ps | grep -q ":${APP_PORT}->"; then
    if [[ "$REBUILD_FORCE" != "rebuild" ]]; then
        log_warning "Port $APP_PORT is already in use"
        EXISTING_CONTAINER=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep ":${APP_PORT}->" | awk '{print $1}')
        if [[ "$EXISTING_CONTAINER" == "$APP_NAME" ]]; then
            log_info "Existing container '$APP_NAME' found on port $APP_PORT"
            read -p "Do you want to rebuild it? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Deployment cancelled"
                exit 0
            fi
            REBUILD_FORCE="rebuild"
        else
            log_error "Port $APP_PORT is used by different container: $EXISTING_CONTAINER"
            exit 1
        fi
    fi
fi

log_info "Starting deployment of '$APP_NAME' on port $APP_PORT..."

# Step 1: Navigate to app directory
cd "$APP_DIR"
log_info "Working in: $(pwd)"

# Step 2: Check for required files
if [[ ! -f "Dockerfile" ]]; then
    log_error "Dockerfile not found in $APP_DIR"
    log_info "Create a Dockerfile using the template in APP-INTEGRATION-TEMPLATE.md"
    exit 1
fi

if [[ ! -f "package.json" ]]; then
    log_error "package.json not found - is this a Node.js app?"
    exit 1
fi

# Step 3: Stop and remove existing container if rebuilding
if [[ "$REBUILD_FORCE" == "rebuild" ]] || docker ps -a | grep -q "\\b${APP_NAME}\\b"; then
    log_info "Stopping existing container..."
    docker stop "$APP_NAME" 2>/dev/null || true
    docker rm "$APP_NAME" 2>/dev/null || true
    log_success "Existing container removed"
fi

# Step 4: Build new image
log_info "Building Docker image..."
docker build \
    --build-arg VITE_BASE_PATH="$BASE_PATH" \
    -t "${APP_NAME}:latest" \
    .

log_success "Docker image built successfully"

# Step 5: Start new container
log_info "Starting container on port $APP_PORT..."
docker run -d \
    --name "$APP_NAME" \
    -p "${APP_PORT}:80" \
    --restart unless-stopped \
    "${APP_NAME}:latest"

# Step 6: Wait for container to be ready
log_info "Waiting for container to start..."
sleep 3

# Step 7: Test container health
if curl -f -s "http://localhost:${APP_PORT}/" > /dev/null; then
    log_success "Container is healthy and responding"
else
    log_error "Container health check failed"
    log_info "Check logs with: docker logs $APP_NAME"
    exit 1
fi

# Step 8: Test through nginx (if nginx is configured)
NGINX_URL="https://zaylegend.com${BASE_PATH}"
if curl -f -s "$NGINX_URL" > /dev/null; then
    log_success "App accessible through nginx: $NGINX_URL"
else
    log_warning "App not accessible through nginx yet"
    log_info "You may need to add nginx configuration:"
    echo ""
    echo "Add this to /etc/nginx/conf.d/portfolio.conf:"
    echo ""
    echo "    # $APP_NAME"
    echo "    location /$APP_NAME {"
    echo "        return 301 /$APP_NAME/;"
    echo "    }"
    echo ""
    echo "    location /$APP_NAME/ {"
    echo "        proxy_pass http://127.0.0.1:$APP_PORT/;"
    echo "        proxy_set_header Host \$host;"
    echo "        proxy_set_header X-Real-IP \$remote_addr;"
    echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
    echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
    echo "        proxy_set_header X-Forwarded-Host \$host;"
    echo "        proxy_set_header X-Forwarded-Port \$server_port;"
    echo "        proxy_http_version 1.1;"
    echo "        proxy_set_header Upgrade \$http_upgrade;"
    echo "        proxy_set_header Connection \"upgrade\";"
    echo "        proxy_connect_timeout 30s;"
    echo "        proxy_send_timeout 30s;"
    echo "        proxy_read_timeout 30s;"
    echo "    }"
    echo ""
    echo "Then run: sudo nginx -t && sudo systemctl reload nginx"
fi

# Step 9: Show deployment summary
echo ""
log_success "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  App Name: $APP_NAME"
echo "  Container Port: $APP_PORT"
echo "  Base Path: $BASE_PATH"
echo "  Container Status: $(docker inspect --format='{{.State.Status}}' $APP_NAME)"
echo "  Direct Access: http://localhost:$APP_PORT/"
echo "  Public URL: $NGINX_URL"
echo ""
echo "🔧 Useful Commands:"
echo "  View logs: docker logs $APP_NAME"
echo "  Restart: docker restart $APP_NAME"
echo "  Rebuild: $0 $APP_NAME $APP_PORT rebuild"
echo "  Shell access: docker exec -it $APP_NAME sh"
echo ""

# Step 10: Optional - Test JavaScript assets
log_info "Testing JavaScript assets..."
CONTAINER_HTML=$(curl -s "http://localhost:${APP_PORT}/")
JS_FILE=$(echo "$CONTAINER_HTML" | grep -o 'src="/[^"]*\.js"' | head -1 | sed 's/src="//; s/"//')

if [[ -n "$JS_FILE" ]]; then
    if curl -f -s "http://localhost:${APP_PORT}${JS_FILE}" | head -c 100 | grep -q "var\|function\|import\|export"; then
        log_success "JavaScript assets are serving correctly"
    else
        log_warning "JavaScript assets may not be serving correctly"
    fi
else
    log_warning "No JavaScript files detected in HTML"
fi

log_info "Deployment script completed! 🚀"
```

---

## New App Integration Script

### Purpose
The `add-new-app.sh` script provides complete automation for integrating new React applications into the portfolio infrastructure, including Git cloning, configuration fixes, Docker setup, nginx configuration, and portfolio registration.

### Features
- ✅ **Automated Git repository cloning**
- ✅ **React Router basename configuration**
- ✅ **Vite base path setup**
- ✅ **Docker container creation and deployment**
- ✅ **Nginx configuration updates**
- ✅ **Portfolio apps.ts integration**
- ✅ **Automatic portfolio rebuild**

### Usage
```bash
./add-new-app.sh <app-name> <port> <github-url> [app-title] [description]

# Example
./add-new-app.sh todo-app 3007 https://github.com/user/todo-app "Todo Master" "A powerful task management application"
```

### Key Automation Features

**React Router Fix**: Automatically detects BrowserRouter usage and adds the correct basename configuration to prevent 404 errors.

**Vite Configuration**: Adds dynamic base path configuration that works with both development and production environments.

**Nginx Integration**: Generates and inserts the complete nginx proxy configuration with proper headers and WebSocket support.

**Portfolio Integration**: Automatically adds the new app to the portfolio's apps.ts file for immediate visibility.

### Full Script

```bash
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
```

---

## Monitoring and Health Checks

### Available Scripts

Additional scripts in the `/var/www/zaylegend/scripts/` directory:

- **`monitor-apps.sh`**: Continuous monitoring of all portfolio applications
- **`optimize-portfolio.sh`**: Performance optimization and cleanup
- **`health-check.sh`**: Comprehensive health verification for all services

### Usage Patterns

```bash
# Monitor all applications
./scripts/monitor-apps.sh

# Optimize and clean up
./scripts/optimize-portfolio.sh

# Comprehensive health check
./apps/health-check.sh
```

### Troubleshooting Commands

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

## Best Practices

### Script Security
- Always validate input parameters
- Use `set -e` to exit on errors
- Provide clear error messages and recovery instructions
- Create backups before making changes

### Error Handling
- Implement graceful degradation
- Provide rollback procedures
- Include comprehensive logging
- Test scripts in staging environments

### Maintenance
- Keep scripts version controlled
- Document all configuration changes
- Regular testing of automation workflows
- Monitor script performance and reliability

## Resources

- [Development Workflows](/tech/development-workflows)
- [Session Recaps](/tech/session-recaps)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

*These automation tools have been refined through real-world usage in the zaylegend.com production environment. They represent battle-tested solutions for common deployment and integration challenges.*