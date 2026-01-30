#!/bin/bash

# =============================================================================
# Portfolio Deployment Script
# Pulls latest changes, builds, and deploys
# =============================================================================

set -e  # Exit on error

PORTFOLIO_DIR="/var/www/zaylegend"
LOG_FILE="$PORTFOLIO_DIR/deploy.log"
BACKUP_DIR="$PORTFOLIO_DIR/backups"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Change to portfolio directory
cd "$PORTFOLIO_DIR" || error "Cannot access $PORTFOLIO_DIR"

log "Starting deployment..."

# Create backup of current dist
if [ -d "dist" ]; then
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="dist_$(date '+%Y%m%d_%H%M%S').tar.gz"
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" dist/
    log "Backed up current build to $BACKUP_NAME"

    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/dist_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
fi

# Pull latest changes
log "Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main || warn "Git pull had issues, continuing..."

# Install dependencies
log "Installing dependencies..."
npm ci --production=false

# Build
log "Building production bundle..."
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
    error "Build failed - dist/index.html not found"
fi

log "Deployment completed successfully!"
echo ""
echo -e "${GREEN}=== Deployment Summary ===${NC}"
echo "  Time: $(date)"
echo "  Commit: $(git rev-parse --short HEAD)"
echo "  Branch: $(git branch --show-current)"
echo ""
