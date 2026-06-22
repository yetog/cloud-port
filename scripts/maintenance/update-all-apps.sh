#!/bin/bash

# =============================================================================
# Update All Apps
# Pulls latest changes and rebuilds all apps with git repos
#
# Usage: ./update-all-apps.sh [--dry-run]
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

PORTFOLIO_DIR="/var/www/zaylegend"
APPS_DIR="$PORTFOLIO_DIR/apps"
UPDATE_SCRIPT="$PORTFOLIO_DIR/scripts/update-app.sh"
DRY_RUN="$1"

# Track results
updated=0
failed=0
skipped=0
failed_apps=""

print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}UPDATE ALL APPS${NC}                                            ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_and_update() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")

    # Skip if not a git repo
    [ ! -d "$app_dir/.git" ] && return

    cd "$app_dir"

    # Get current branch
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    [ -z "$branch" ] && return

    # Fix permissions if needed
    if [ ! -w "$app_dir" ]; then
        sudo chown -R $USER:$USER "$app_dir" 2>/dev/null || true
    fi

    # Fetch quietly
    git fetch origin "$branch" --quiet 2>/dev/null || {
        echo -e "${YELLOW}⚠${NC}  $app_name - fetch failed, skipping"
        skipped=$((skipped + 1))
        return
    }

    # Check for updates
    local local_commit=$(git rev-parse HEAD 2>/dev/null)
    local remote_commit=$(git rev-parse "origin/$branch" 2>/dev/null)

    if [ "$local_commit" != "$remote_commit" ]; then
        local behind=$(git rev-list --count HEAD..origin/$branch 2>/dev/null || echo "?")
        echo -e "${YELLOW}⬆${NC}  ${BOLD}$app_name${NC} - $behind commit(s) behind"

        if [ "$DRY_RUN" = "--dry-run" ]; then
            echo -e "    └─ Would update (dry run)"
            skipped=$((skipped + 1))
        else
            # Run update script
            if "$UPDATE_SCRIPT" "$app_name" 2>&1; then
                updated=$((updated + 1))
            else
                echo -e "${RED}✗${NC}  Failed to update $app_name"
                failed=$((failed + 1))
                failed_apps="$failed_apps $app_name"
            fi
        fi
    else
        echo -e "${GREEN}✓${NC}  $app_name - already up to date"
        skipped=$((skipped + 1))
    fi
}

# Main
print_header

if [ "$DRY_RUN" = "--dry-run" ]; then
    echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
    echo ""
fi

echo -e "${BOLD}Scanning apps for updates...${NC}"
echo ""

# Update apps in apps directory
for app_dir in "$APPS_DIR"/*/; do
    [ -d "$app_dir" ] && check_and_update "$app_dir"
done

# Update standalone apps (Green-Empire, etc.)
[ -d "/var/www/Green-Empire/.git" ] && check_and_update "/var/www/Green-Empire"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BOLD}Summary:${NC}"
echo -e "  ${GREEN}✓${NC} Updated: $updated"
echo -e "  ${YELLOW}─${NC} Skipped: $skipped"
echo -e "  ${RED}✗${NC} Failed:  $failed"

if [ -n "$failed_apps" ]; then
    echo ""
    echo -e "${RED}Failed apps:$failed_apps${NC}"
fi

echo ""
