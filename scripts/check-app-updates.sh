#!/bin/bash

# =============================================================================
# Check App Updates
# Scans all apps with git repos and shows which have updates available
#
# Usage: ./check-app-updates.sh [--notify]
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
PORTFOLIO_DIR="/var/www/zaylegend"
APPS_DIR="$PORTFOLIO_DIR/apps"
NOTIFY_FILE="$PORTFOLIO_DIR/.app-updates"
NOTIFY_FLAG="$1"

# App directories to scan (add more as needed)
APP_LOCATIONS=(
    "$APPS_DIR"
    "/var/www/Green-Empire"
)

updates_found=0
update_list=""

print_header() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}APP UPDATE CHECKER${NC}                                         ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")

    # Skip if not a git repo
    [ ! -d "$app_dir/.git" ] && return

    cd "$app_dir"

    # Get current branch
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    [ -z "$branch" ] && return

    # Fetch quietly
    git fetch origin "$branch" --quiet 2>/dev/null || return

    # Check for updates
    local local_commit=$(git rev-parse HEAD 2>/dev/null)
    local remote_commit=$(git rev-parse "origin/$branch" 2>/dev/null)

    if [ "$local_commit" != "$remote_commit" ]; then
        local behind=$(git rev-list --count HEAD..origin/$branch 2>/dev/null || echo "?")
        echo -e "${YELLOW}⬆${NC}  ${BOLD}$app_name${NC} - $behind commit(s) behind origin/$branch"

        # Show latest commit message
        local latest_msg=$(git log origin/$branch -1 --format="%s" 2>/dev/null | head -c 60)
        echo -e "    └─ Latest: ${CYAN}$latest_msg${NC}"

        updates_found=$((updates_found + 1))
        update_list="$update_list$app_name\n"
    else
        echo -e "${GREEN}✓${NC}  $app_name - up to date"
    fi
}

# Main
print_header

echo -e "${BOLD}Checking apps for updates...${NC}"
echo ""

# Check apps in apps directory
for app_dir in "$APPS_DIR"/*/; do
    [ -d "$app_dir" ] && check_app "$app_dir"
done

# Check standalone apps
for location in "${APP_LOCATIONS[@]}"; do
    if [ -d "$location" ] && [ "$location" != "$APPS_DIR" ]; then
        check_app "$location"
    fi
done

echo ""
echo "─────────────────────────────────────────────────────────────────"

if [ $updates_found -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}$updates_found app(s) have updates available${NC}"
    echo ""
    echo "Run: brain apps update <app-name>  - Update specific app"
    echo "Run: brain apps update-all         - Update all apps"

    # Write to notify file if --notify flag
    if [ "$NOTIFY_FLAG" = "--notify" ]; then
        echo -e "$update_list" > "$NOTIFY_FILE"
        echo ""
        echo -e "Update list written to $NOTIFY_FILE"
    fi
else
    echo -e "${GREEN}${BOLD}All apps are up to date!${NC}"
    # Clear notify file
    [ -f "$NOTIFY_FILE" ] && rm "$NOTIFY_FILE"
fi

echo ""
