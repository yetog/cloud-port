#!/bin/bash

# =============================================================================
# Portfolio Server Backup Script
# Creates a comprehensive backup of the portfolio and all apps
# =============================================================================

set -e

BACKUP_ROOT="/var/www/zaylegend/backups"
PORTFOLIO_DIR="/var/www/zaylegend"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_NAME="portfolio_backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_ROOT/$BACKUP_NAME"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${GREEN}PORTFOLIO BACKUP SCRIPT${NC}                                     ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create backup directory
mkdir -p "$BACKUP_PATH"

echo -e "${GREEN}▶ Creating backup at:${NC} $BACKUP_PATH"
echo ""

# 1. Backup source code (excluding node_modules and dist)
echo -e "${YELLOW}[1/5]${NC} Backing up source code..."
tar --exclude='node_modules' \
    --exclude='dist' \
    --exclude='backups' \
    --exclude='.git' \
    --exclude='apps/*/node_modules' \
    --exclude='apps/*/dist' \
    -czf "$BACKUP_PATH/source.tar.gz" \
    -C "$PORTFOLIO_DIR" \
    src public scripts sessions CLAUDE.md PORTFOLIO_ROADMAP.md package.json tsconfig.json vite.config.ts tailwind.config.ts 2>/dev/null || true

# 2. Backup app configurations
echo -e "${YELLOW}[2/5]${NC} Backing up app configurations..."
mkdir -p "$BACKUP_PATH/apps"
for app_dir in "$PORTFOLIO_DIR/apps"/*/; do
    if [ -d "$app_dir" ]; then
        app_name=$(basename "$app_dir")
        # Only backup config files, not full source
        tar --exclude='node_modules' \
            --exclude='dist' \
            --exclude='.git' \
            -czf "$BACKUP_PATH/apps/${app_name}_config.tar.gz" \
            -C "$app_dir" \
            package.json vite.config.ts tsconfig.json .env 2>/dev/null || true
    fi
done

# 3. Backup nginx config
echo -e "${YELLOW}[3/5]${NC} Backing up nginx configuration..."
sudo cp /etc/nginx/conf.d/portfolio.conf "$BACKUP_PATH/nginx_portfolio.conf" 2>/dev/null || echo "  (nginx config not accessible)"

# 4. Backup docker-compose
echo -e "${YELLOW}[4/5]${NC} Backing up Docker configuration..."
cp "$PORTFOLIO_DIR/docker-compose.yml" "$BACKUP_PATH/" 2>/dev/null || true

# 5. Create manifest
echo -e "${YELLOW}[5/5]${NC} Creating backup manifest..."
cat > "$BACKUP_PATH/manifest.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "hostname": "$(hostname)",
  "git_commit": "$(cd $PORTFOLIO_DIR && git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(cd $PORTFOLIO_DIR && git branch --show-current 2>/dev/null || echo 'unknown')",
  "contents": [
    "source.tar.gz - Portfolio source code",
    "apps/ - App configuration files",
    "nginx_portfolio.conf - Nginx configuration",
    "docker-compose.yml - Docker orchestration",
    "manifest.json - This file"
  ]
}
EOF

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  Backup Complete!                                             ${GREEN}║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Location: $BACKUP_PATH"
echo "  Size: $BACKUP_SIZE"
echo "  Timestamp: $(date)"
echo ""

# List backups and cleanup old ones (keep last 10)
echo -e "${YELLOW}Existing backups:${NC}"
ls -1t "$BACKUP_ROOT" | head -10 | sed 's/^/  /'

# Remove old backups (keep last 10)
ls -1t "$BACKUP_ROOT" 2>/dev/null | tail -n +11 | while read old_backup; do
    rm -rf "$BACKUP_ROOT/$old_backup"
    echo "  Removed old backup: $old_backup"
done

echo ""
echo -e "${CYAN}To restore, extract source.tar.gz and run: npm ci && npm run build${NC}"
