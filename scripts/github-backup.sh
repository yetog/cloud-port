#!/bin/bash

# =============================================================================
# GitHub Backup Script
# Pushes all uncommitted changes and creates a backup branch
# =============================================================================

PORTFOLIO_DIR="/var/www/zaylegend"

cd "$PORTFOLIO_DIR" || exit 1

echo "=== GitHub Backup ==="
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "Uncommitted changes detected. Creating backup commit..."

    git add -A
    git commit -m "backup: Auto-backup $(date '+%Y-%m-%d %H:%M:%S')

Co-Authored-By: Backup Script <noreply@zaylegend.com>"
fi

# Push to main
echo "Pushing to main..."
git push origin main

# Create dated backup branch
BACKUP_BRANCH="backup/$(date '+%Y%m%d')"
echo "Creating backup branch: $BACKUP_BRANCH"
git branch -f "$BACKUP_BRANCH"
git push origin "$BACKUP_BRANCH" --force

echo ""
echo "Backup complete!"
echo "  Main: pushed"
echo "  Backup branch: $BACKUP_BRANCH"
