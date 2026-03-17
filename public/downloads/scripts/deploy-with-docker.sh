#!/bin/bash

# Enhanced deployment script with Docker app support
echo "Starting enhanced deployment with Docker apps..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
LOG_FILE="/var/log/portfolio-deployment.log"
exec > >(tee -a "$LOG_FILE")
exec 2>&1

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Create backup directory
BACKUP_DIR="/var/backups/zaylegend"
mkdir -p "$BACKUP_DIR"

# Phase 1: Pre-deployment checks
log "=== PHASE 1: PRE-DEPLOYMENT CHECKS ==="
cd /var/www/zaylegend

info "Current commit: $(git rev-parse HEAD)"
info "Recent commits:"
git log --oneline -5

# Check Docker status
info "Checking Docker status..."
if ! systemctl is-active --quiet docker; then
    warning "Docker is not running, starting Docker..."
    systemctl start docker
fi

# Phase 2: Portfolio build
log "=== PHASE 2: BUILDING MAIN PORTFOLIO ==="

# Backup current dist
if [ -d "dist" ]; then
    info "Backing up current build..."
    cp -r dist "$BACKUP_DIR/dist-$(date +%Y%m%d-%H%M%S)"
fi

# Clear caches and build
info "Clearing caches..."
npm cache clean --force
rm -rf node_modules/.vite
rm -rf dist

info "Updating from Git..."
git fetch origin
git reset --hard origin/main
git submodule update --init --recursive

info "Installing dependencies..."
npm ci

info "Building portfolio..."
npm run build

# Verify build
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    error "Build failed - dist directory or index.html not found"
    exit 1
fi

# Phase 3: Docker apps deployment
log "=== PHASE 3: DOCKER APPS DEPLOYMENT ==="

info "Setting up Docker apps..."
./scripts/setup-docker-apps.sh

info "Building Docker containers..."
./scripts/build-docker-apps.sh

# Phase 4: Update Nginx
log "=== PHASE 4: UPDATING NGINX CONFIGURATION ==="

info "Updating Nginx for Docker apps..."
./scripts/update-nginx-docker.sh

# Phase 5: Traditional apps build
log "=== PHASE 5: BUILDING TRADITIONAL APPS ==="

info "Building traditional apps..."
./scripts/build-apps.sh

# Phase 6: Final verification
log "=== PHASE 6: DEPLOYMENT VERIFICATION ==="

info "Testing main portfolio..."
curl -f -s "https://zaylegend.com" > /dev/null
if [ $? -eq 0 ]; then
    log "✓ Main portfolio is accessible"
else
    error "✗ Main portfolio is not accessible"
fi

info "Testing Docker apps..."
docker_apps=("chord-genesis" "spritegen" "dj-visualizer" "fineline" "game-hub")
for app in "${docker_apps[@]}"; do
    curl -f -s "https://zaylegend.com/$app" > /dev/null
    if [ $? -eq 0 ]; then
        log "✓ $app is accessible"
    else
        warning "✗ $app is not accessible"
    fi
done

info "Testing traditional apps..."
traditional_apps=("questful-living-adventure" "media-magic-streamer" "script-scribe-ai-editor" "playful-space-arcade" "pdf-saga-summarize" "serene-chord-scapes" "zen-reset")
for app in "${traditional_apps[@]}"; do
    curl -f -s "https://zaylegend.com/$app" > /dev/null
    if [ $? -eq 0 ]; then
        log "✓ $app is accessible"
    else
        warning "✗ $app is not accessible"
    fi
done

# Phase 7: Cleanup
log "=== PHASE 7: CLEANUP ==="

info "Cleaning up old backups (keeping last 5)..."
ls -t "$BACKUP_DIR"/dist-* 2>/dev/null | tail -n +6 | xargs -r rm -rf

info "Pruning unused Docker images..."
docker image prune -f

# Final summary
log "=== DEPLOYMENT COMPLETE ==="
log "Timestamp: $(date)"
log "Portfolio directory: /var/www/zaylegend"
log "Log file: $LOG_FILE"
log "Git commit: $(git rev-parse HEAD)"

info "All apps should be available at:"
info "Main: https://zaylegend.com"
info "Docker apps: https://zaylegend.com/{chord-genesis,spritegen,dj-visualizer,fineline,game-hub}"
info "Traditional apps: https://zaylegend.com/{questful-living-adventure,media-magic-streamer,script-scribe-ai-editor,playful-space-arcade,pdf-saga-summarize,serene-chord-scapes,zen-reset}"

warning "Remember to force refresh (Ctrl+Shift+R) to see latest changes!"