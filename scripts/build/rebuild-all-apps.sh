#!/bin/bash

# =============================================================================
# Rebuild All Docker Apps
# Rebuilds all Docker-based apps to apply latest changes (SEO, branding, etc.)
# =============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  REBUILDING ALL DOCKER APPS                                   ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

APPS_DIR="/var/www/zaylegend/apps"

# Main apps
MAIN_APPS="chord-genesis dj-visualizer fineline game-hub spritegen contentforge forge-fit"

# Testing apps
TESTING_APPS="darkflow-mind-mapper gmat-mastery-suite losk got-hired-ai bh-ai-79 zen-tot purple-lotus"

rebuild_app() {
    local app_path="$1"
    local app_name="$2"

    if [ -f "$app_path/docker-compose.yml" ]; then
        echo -e "${YELLOW}▶${NC} Rebuilding $app_name..."
        cd "$app_path"
        docker-compose up -d --build --quiet-pull 2>&1 | grep -v "^Step\|^--->\|^Sending\|^DEPRECATED" | tail -3
        echo -e "${GREEN}✓${NC} $app_name rebuilt"
    else
        echo -e "  Skipping $app_name (no docker-compose.yml)"
    fi
}

echo "Rebuilding main apps..."
for app in $MAIN_APPS; do
    rebuild_app "$APPS_DIR/$app" "$app"
done

echo ""
echo "Rebuilding testing apps..."
for app in $TESTING_APPS; do
    rebuild_app "$APPS_DIR/testing/$app" "testing/$app"
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ALL APPS REBUILT                                             ${GREEN}║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Running containers:"
docker ps --format "  {{.Names}}: {{.Status}}" | head -15
