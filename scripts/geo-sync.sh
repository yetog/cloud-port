#!/bin/bash
#
# Geo-Redundancy Sync Script
# Syncs portfolio to secondary server for failover
#
# Usage: ./geo-sync.sh [secondary-server-ip]
#

set -e

# Configuration
SECONDARY="${1:-user@secondary-server}"
SOURCE="/var/www/zaylegend/"
DEST="/var/www/zaylegend/"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== Portfolio Geo-Sync ===${NC}"
echo "Source: $SOURCE"
echo "Destination: $SECONDARY:$DEST"
echo ""

# Pre-flight checks
if [ "$SECONDARY" == "user@secondary-server" ]; then
    echo -e "${RED}Error: Please specify secondary server${NC}"
    echo "Usage: $0 user@ip-address"
    exit 1
fi

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=5 "$SECONDARY" "echo 'Connection OK'" 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to $SECONDARY${NC}"
    exit 1
fi
echo -e "${GREEN}SSH connection successful${NC}"

# Sync portfolio files
echo -e "${YELLOW}Syncing portfolio files...${NC}"
rsync -avz --progress --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='*.log' \
    --exclude='__pycache__' \
    --exclude='.env' \
    --exclude='brain.db' \
    "$SOURCE" "$SECONDARY:$DEST"

# Sync brain.db separately (important data)
echo -e "${YELLOW}Syncing brain.db...${NC}"
rsync -avz "${SOURCE}brain.db" "$SECONDARY:${DEST}brain.db"

# Sync nginx configs
echo -e "${YELLOW}Syncing nginx configs...${NC}"
rsync -avz /etc/nginx/conf.d/*.conf "$SECONDARY:/tmp/nginx-configs/"
ssh "$SECONDARY" "sudo mv /tmp/nginx-configs/*.conf /etc/nginx/conf.d/"

# Remote: Rebuild if needed
echo -e "${YELLOW}Building on secondary...${NC}"
ssh "$SECONDARY" "cd $DEST && npm install && npm run build"

# Remote: Reload nginx
echo -e "${YELLOW}Reloading nginx on secondary...${NC}"
ssh "$SECONDARY" "sudo nginx -t && sudo systemctl reload nginx"

echo ""
echo -e "${GREEN}=== Sync Complete ===${NC}"
echo "Secondary server is now up to date."
echo ""
echo "To verify, run on secondary:"
echo "  brain status"
echo "  brain apps health"
