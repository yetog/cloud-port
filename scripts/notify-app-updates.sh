#!/bin/bash

# =============================================================================
# App Update Notifier
# Checks for repo updates and writes notifications
# Run via cron: */30 * * * * /var/www/zaylegend/scripts/notify-app-updates.sh
# =============================================================================

PORTFOLIO_DIR="/var/www/zaylegend"
APPS_DIR="$PORTFOLIO_DIR/apps"
NOTIFY_FILE="$PORTFOLIO_DIR/.app-updates"
LOG_FILE="$PORTFOLIO_DIR/.app-updates.log"

# App locations to check
APP_LOCATIONS=(
    "$APPS_DIR"
    "/var/www/Green-Empire"
)

updates=""
update_count=0

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

check_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")

    # Skip if not a git repo
    [ ! -d "$app_dir/.git" ] && return

    cd "$app_dir" 2>/dev/null || return

    # Get current branch
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    [ -z "$branch" ] && return

    # Fetch quietly (with timeout)
    timeout 10 git fetch origin "$branch" --quiet 2>/dev/null || return

    # Check for updates
    local local_commit=$(git rev-parse HEAD 2>/dev/null)
    local remote_commit=$(git rev-parse "origin/$branch" 2>/dev/null)

    if [ "$local_commit" != "$remote_commit" ]; then
        local behind=$(git rev-list --count HEAD..origin/$branch 2>/dev/null || echo "?")
        local latest_msg=$(git log origin/$branch -1 --format="%s" 2>/dev/null | head -c 50)
        updates="$updates$app_name|$behind|$latest_msg\n"
        update_count=$((update_count + 1))
        log "Update available: $app_name ($behind commits behind)"
    fi
}

# Main
log "Checking for app updates..."

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

# Write notification file
if [ $update_count -gt 0 ]; then
    echo -e "# App Updates Available ($(date '+%Y-%m-%d %H:%M'))\n# Format: app_name|commits_behind|latest_commit_message\n$updates" > "$NOTIFY_FILE"
    log "Found $update_count app(s) with updates"
else
    # Clear notification file if no updates
    [ -f "$NOTIFY_FILE" ] && rm "$NOTIFY_FILE"
    log "All apps up to date"
fi

# Keep log file small (last 100 lines)
if [ -f "$LOG_FILE" ]; then
    tail -100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi
