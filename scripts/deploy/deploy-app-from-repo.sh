#!/bin/bash

# =============================================================================
# Deploy App from GitHub Repository
# Automates the complete deployment of a Vite React app from GitHub
#
# Usage: ./deploy-app-from-repo.sh <github-url> <app-name> [port]
# Example: ./deploy-app-from-repo.sh https://github.com/yetog/my-app my-app 3019
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Configuration
APPS_DIR="/var/www/zaylegend/apps"
PORTFOLIO_DIR="/var/www/zaylegend"
NGINX_CONF="/etc/nginx/conf.d/portfolio.conf"
APPS_TS="$PORTFOLIO_DIR/src/data/apps.ts"

# Default port range for new apps
DEFAULT_PORT_START=3018

print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}DEPLOY APP FROM GITHUB REPOSITORY${NC}                          ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Find next available port
find_next_port() {
    local port=$DEFAULT_PORT_START
    while grep -q "proxy_pass http://127.0.0.1:$port" "$NGINX_CONF" 2>/dev/null || \
          docker ps --format '{{.Ports}}' | grep -q ":$port->" 2>/dev/null; do
        ((port++))
    done
    echo $port
}

# Validate inputs
validate_inputs() {
    if [ -z "$GITHUB_URL" ]; then
        print_error "GitHub URL is required"
        echo "Usage: $0 <github-url> <app-name> [port]"
        echo "Example: $0 https://github.com/yetog/my-app my-app 3019"
        exit 1
    fi

    if [ -z "$APP_NAME" ]; then
        # Extract app name from URL
        APP_NAME=$(basename "$GITHUB_URL" .git)
        print_warning "No app name provided, using: $APP_NAME"
    fi

    if [ -z "$PORT" ]; then
        PORT=$(find_next_port)
        print_warning "No port provided, using next available: $PORT"
    fi

    # Check if app directory already exists
    if [ -d "$APPS_DIR/$APP_NAME" ]; then
        print_error "App directory already exists: $APPS_DIR/$APP_NAME"
        read -p "Remove and reinstall? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            rm -rf "$APPS_DIR/$APP_NAME"
            docker stop "$APP_NAME" 2>/dev/null || true
            docker rm "$APP_NAME" 2>/dev/null || true
        else
            exit 1
        fi
    fi
}

# Clone repository
clone_repo() {
    print_step "Cloning repository..."
    cd "$APPS_DIR"
    git clone "$GITHUB_URL" "$APP_NAME"
    cd "$APP_NAME"
    print_success "Repository cloned to $APPS_DIR/$APP_NAME"
}

# Update vite.config.ts with base path
update_vite_config() {
    print_step "Updating vite.config.ts with base path..."

    if [ -f "vite.config.ts" ]; then
        # Check if base is already set
        if grep -q "base:" vite.config.ts; then
            sed -i "s|base:.*|base: '/$APP_NAME/',|" vite.config.ts
        else
            # Add base after defineConfig opening
            sed -i "/defineConfig.*({/a\\  base: '/$APP_NAME/'," vite.config.ts
        fi

        # Update PWA start_url if present
        if grep -q "start_url:" vite.config.ts; then
            sed -i "s|start_url:.*|start_url: '/$APP_NAME/',|" vite.config.ts
        fi

        print_success "vite.config.ts updated"
    else
        print_warning "vite.config.ts not found, skipping"
    fi
}

# Update BrowserRouter basename
update_router_basename() {
    print_step "Updating React Router basename..."

    # Find files with BrowserRouter
    for file in $(grep -rl "BrowserRouter" src/ 2>/dev/null); do
        if grep -q "<BrowserRouter>" "$file"; then
            sed -i "s|<BrowserRouter>|<BrowserRouter basename=\"/$APP_NAME\">|g" "$file"
            print_success "Updated $file"
        fi
    done
}

# Remove Lovable branding if present
remove_lovable_branding() {
    print_step "Removing third-party branding and setting consistent SEO..."

    if [ -f "index.html" ]; then
        # Remove Lovable meta tags
        sed -i '/<meta name="author" content="Lovable"/d' index.html
        sed -i '/lovable.dev\/opengraph/d' index.html
        sed -i '/@lovable_dev/d' index.html
        sed -i '/gptengineer.js/d' index.html
        sed -i '/DO NOT REMOVE THIS SCRIPT TAG/d' index.html

        # Update author
        sed -i 's/<meta name="author" content="[^"]*"/<meta name="author" content="Isayah Young-Burke"/' index.html

        # Set consistent og:image and twitter:image for social sharing
        sed -i 's|<meta property="og:image" content="[^"]*"|<meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg"|g' index.html
        sed -i 's|<meta name="twitter:image" content="[^"]*"|<meta name="twitter:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg"|g' index.html

        print_success "Branding and SEO updated"
    fi
}

# Create Dockerfile
create_dockerfile() {
    print_step "Creating Dockerfile..."

    cat > Dockerfile << 'DOCKERFILE'
# Dockerfile for Vite App
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

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
DOCKERFILE

    print_success "Dockerfile created"
}

# Create docker-compose.yml
create_docker_compose() {
    print_step "Creating docker-compose.yml..."

    cat > docker-compose.yml << COMPOSE
version: '3.8'

services:
  $APP_NAME:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "$PORT:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    container_name: $APP_NAME
COMPOSE

    print_success "docker-compose.yml created (port $PORT)"
}

# Update nginx configuration
update_nginx_config() {
    print_step "Updating nginx configuration..."

    # Create nginx block
    NGINX_BLOCK="
    # $APP_NAME (port $PORT)
    location /$APP_NAME {
        return 301 /$APP_NAME/;
    }
    location /$APP_NAME/ {
        proxy_pass http://127.0.0.1:$PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
    }"

    # Insert before SSL configuration line
    sudo sed -i "/# SSL configuration/i\\$NGINX_BLOCK" "$NGINX_CONF"

    # Test and reload nginx
    if sudo nginx -t 2>/dev/null; then
        sudo nginx -s reload
        print_success "Nginx configuration updated and reloaded"
    else
        print_error "Nginx configuration test failed!"
        exit 1
    fi
}

# Install dependencies and build
build_container() {
    print_step "Installing dependencies..."
    npm install

    print_step "Building Docker container..."
    docker-compose up -d --build

    # Wait for container to start
    sleep 3

    if docker ps | grep -q "$APP_NAME"; then
        print_success "Container '$APP_NAME' is running"
    else
        print_error "Container failed to start"
        docker-compose logs
        exit 1
    fi
}

# Add to apps.ts (optional)
add_to_portfolio() {
    print_step "Adding to portfolio apps.ts..."

    read -p "Add to portfolio? (Y/n): " add_confirm
    if [ "$add_confirm" = "n" ] || [ "$add_confirm" = "N" ]; then
        print_warning "Skipping portfolio addition"
        return
    fi

    read -p "App title (default: $APP_NAME): " APP_TITLE
    APP_TITLE=${APP_TITLE:-$APP_NAME}

    read -p "Description: " APP_DESC
    APP_DESC=${APP_DESC:-"A web application"}

    read -p "Tags (comma-separated): " APP_TAGS
    APP_TAGS=${APP_TAGS:-"Web"}

    read -p "Status (finished/testing/upgrading) [finished]: " APP_STATUS
    APP_STATUS=${APP_STATUS:-finished}

    # Format tags for TypeScript
    TAGS_FORMATTED=$(echo "$APP_TAGS" | sed "s/,/', '/g" | sed "s/^/'/" | sed "s/$/'/")

    # Create the app entry
    APP_ENTRY="  {
    id: '$APP_NAME',
    title: '$APP_TITLE',
    description: '$APP_DESC',
    image: ASSETS.apps.zenReset,
    tags: [$TAGS_FORMATTED],
    status: '$APP_STATUS',
    appUrl: 'https://zaylegend.com/$APP_NAME',
    githubUrl: '$GITHUB_URL',
  },"

    # Add to appropriate array based on status
    case $APP_STATUS in
        finished)
            ARRAY_END="^];\$"
            # Find the end of finishedApps array and insert before it
            # This is simplified - in production you might want more robust insertion
            print_warning "Please manually add the following to $APPS_TS in the appropriate array:"
            echo ""
            echo "$APP_ENTRY"
            ;;
        testing)
            print_warning "Please manually add the following to testingApps in $APPS_TS:"
            echo ""
            echo "$APP_ENTRY"
            ;;
        upgrading)
            print_warning "Please manually add the following to upgradingApps in $APPS_TS:"
            echo ""
            echo "$APP_ENTRY"
            ;;
    esac
}

# Main execution
main() {
    print_header

    GITHUB_URL="$1"
    APP_NAME="$2"
    PORT="$3"

    validate_inputs

    echo ""
    echo -e "${BOLD}Configuration:${NC}"
    echo "  GitHub URL: $GITHUB_URL"
    echo "  App Name:   $APP_NAME"
    echo "  Port:       $PORT"
    echo "  App URL:    https://zaylegend.com/$APP_NAME/"
    echo ""

    read -p "Proceed with deployment? (Y/n): " proceed
    if [ "$proceed" = "n" ] || [ "$proceed" = "N" ]; then
        echo "Deployment cancelled."
        exit 0
    fi

    echo ""
    clone_repo
    update_vite_config
    update_router_basename
    remove_lovable_branding
    create_dockerfile
    create_docker_compose
    build_container
    update_nginx_config
    add_to_portfolio

    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}  ${BOLD}DEPLOYMENT COMPLETE!${NC}                                       ${GREEN}║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  App URL: https://zaylegend.com/$APP_NAME/"
    echo "  Port:    $PORT"
    echo "  Status:  $(docker ps --filter name=$APP_NAME --format '{{.Status}}')"
    echo ""
    echo "  To rebuild: cd $APPS_DIR/$APP_NAME && docker-compose up -d --build"
    echo "  To stop:    docker stop $APP_NAME"
    echo "  To logs:    docker logs $APP_NAME"
    echo ""
}

main "$@"
