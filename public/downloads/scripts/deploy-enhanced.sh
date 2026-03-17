#!/bin/bash

# Enhanced Portfolio Deployment Script with Debugging
# Usage: ./scripts/deploy-enhanced.sh

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/var/www/zaylegend/portfolio"
BACKUP_DIR="/var/www/zaylegend/backups"
LOG_FILE="/var/log/portfolio-deploy.log"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Phase 1: Pre-deployment checks and diagnosis
phase1_diagnosis() {
    log "=== PHASE 1: DIAGNOSIS ==="
    
    cd "$PROJECT_DIR"
    
    # Check current commit
    CURRENT_COMMIT=$(git rev-parse HEAD)
    log "Current commit: $CURRENT_COMMIT"
    
    # Check recent commits for actual content changes
    log "Recent commits:"
    git log --oneline -5 | tee -a "$LOG_FILE"
    
    # Check for changes in key files
    log "Checking for UI-related changes in recent commits..."
    git diff HEAD~3..HEAD --name-only | grep -E '\.(tsx?|css|html)$' || warning "No UI file changes found in recent commits"
    
    # Check submodule status
    log "Checking submodule status..."
    git submodule status | tee -a "$LOG_FILE"
    
    # Check if dist directory exists and its age
    if [ -d "dist" ]; then
        DIST_AGE=$(find dist -type f -name "*.html" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f1)
        CURRENT_TIME=$(date +%s)
        AGE_MINUTES=$(( (CURRENT_TIME - ${DIST_AGE%.*}) / 60 ))
        log "Dist directory last modified: $AGE_MINUTES minutes ago"
    else
        warning "No dist directory found"
    fi
}

# Phase 2: Enhanced build process with cache clearing
phase2_build() {
    log "=== PHASE 2: ENHANCED BUILD PROCESS ==="
    
    cd "$PROJECT_DIR"
    
    # Clear all caches
    log "Clearing npm cache..."
    npm cache clean --force
    
    log "Clearing Vite cache..."
    rm -rf node_modules/.vite
    rm -rf dist
    
    # Update from git
    log "Updating from git..."
    git fetch origin
    git reset --hard origin/main
    
    # Update submodules
    log "Updating submodules..."
    git submodule update --remote --recursive
    
    # Install dependencies with verification
    log "Installing dependencies..."
    npm ci
    
    # Build apps first
    log "Building submodule apps..."
    ./scripts/build-apps.sh
    
    # Build main portfolio with detailed output
    log "Building main portfolio..."
    npm run build 2>&1 | tee -a "$LOG_FILE"
    
    # Verify build output
    if [ -d "dist" ]; then
        BUILT_FILES=$(find dist -type f | wc -l)
        log "Build successful: $BUILT_FILES files generated"
        
        # Check for critical files
        for file in "dist/index.html" "dist/assets"; do
            if [ -e "$file" ]; then
                log "✓ $file exists"
            else
                error "✗ $file missing"
            fi
        done
    else
        error "Build failed: no dist directory created"
        exit 1
    fi
}

# Phase 3: Cache management and busting
phase3_cache() {
    log "=== PHASE 3: CACHE MANAGEMENT ==="
    
    cd "$PROJECT_DIR"
    
    # Add cache-busting to index.html
    if [ -f "dist/index.html" ]; then
        CACHE_BUST="?v=$TIMESTAMP"
        
        # Add no-cache headers to HTML
        sed -i '/<head>/a\  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n  <meta http-equiv="Pragma" content="no-cache">\n  <meta http-equiv="Expires" content="0">' dist/index.html
        
        log "Added cache-busting headers to index.html"
    fi
    
    # Set proper permissions
    log "Setting file permissions..."
    chown -R www-data:www-data dist/
    chmod -R 755 dist/
    chown -R www-data:www-data public/
    chmod -R 755 public/
}

# Phase 4: Deployment verification
phase4_verify() {
    log "=== PHASE 4: DEPLOYMENT VERIFICATION ==="
    
    # Reload nginx
    log "Reloading nginx..."
    systemctl reload nginx
    
    # Wait a moment for reload
    sleep 2
    
    # Test main site
    log "Testing main portfolio..."
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://zaylegend.com/")
    if [ "$RESPONSE" = "200" ]; then
        log "✓ Main portfolio responding (HTTP $RESPONSE)"
    else
        error "✗ Main portfolio not responding (HTTP $RESPONSE)"
    fi
    
    # Test each app
    apps=("questful-living-adventure" "media-magic-streamer" "script-scribe-ai-editor" "playful-space-arcade" "pdf-saga-summarize" "serene-chord-scapes")
    
    for app in "${apps[@]}"; do
        RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://zaylegend.com/$app/")
        if [ "$RESPONSE" = "200" ]; then
            log "✓ $app responding (HTTP $RESPONSE)"
        else
            warning "✗ $app not responding (HTTP $RESPONSE)"
        fi
    done
    
    # Check file timestamps
    log "Verifying file timestamps..."
    find dist -name "*.html" -printf '%T+ %p\n' | head -5 | tee -a "$LOG_FILE"
    
    # Generate content hash for verification
    CONTENT_HASH=$(find dist -type f -exec md5sum {} \; | md5sum | cut -d' ' -f1)
    log "Content hash: $CONTENT_HASH"
    echo "$TIMESTAMP:$CONTENT_HASH" >> /var/log/portfolio-hashes.log
}

# Phase 5: Cleanup and reporting
phase5_cleanup() {
    log "=== PHASE 5: CLEANUP AND REPORTING ==="
    
    # Show recent commits deployed
    log "Successfully deployed commits:"
    git log --oneline -3 | tee -a "$LOG_FILE"
    
    # Clean old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        log "Cleaning old backups..."
        ls -t "$BACKUP_DIR" | tail -n +6 | xargs -r -I {} rm -rf "$BACKUP_DIR/{}"
    fi
    
    # Show deployment summary
    log "=== DEPLOYMENT COMPLETE ==="
    log "Timestamp: $TIMESTAMP"
    log "Project: $PROJECT_DIR"
    log "Log: $LOG_FILE"
    
    # Force browser cache refresh hint
    info "To force browser cache refresh, use Ctrl+F5 or Ctrl+Shift+R"
    info "Or open developer tools and disable cache while testing"
}

# Main execution
main() {
    log "Starting enhanced portfolio deployment..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Run all phases
    phase1_diagnosis
    phase2_build
    phase3_cache
    phase4_verify
    phase5_cleanup
    
    log "Enhanced deployment completed successfully!"
}

# Run main function
main "$@"