#!/bin/bash

# =============================================================================
# Session Context Script
# Displays current project status, pending tasks, and quick actions on login
# Add to ~/.bashrc: source /var/www/zaylegend/scripts/session-context.sh
# =============================================================================

PORTFOLIO_DIR="/var/www/zaylegend"
ROADMAP="$PORTFOLIO_DIR/PORTFOLIO_ROADMAP.md"
SESSION_LOG="$PORTFOLIO_DIR/sessions"
DEPLOY_LOG="$PORTFOLIO_DIR/deploy.log"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}ZAYLEGEND PORTFOLIO - SESSION CONTEXT${NC}                       ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  $(date '+%Y-%m-%d %H:%M:%S')                                        ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Git status
echo -e "${MAGENTA}▶ GIT STATUS:${NC}"
cd "$PORTFOLIO_DIR" 2>/dev/null
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
CHANGES=$(git status -s 2>/dev/null | wc -l)
echo "  Branch: $BRANCH | Commit: $COMMIT | Uncommitted: $CHANGES files"

# Check if ahead/behind remote
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
if [ "$AHEAD" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠ $AHEAD commit(s) ahead of origin - run: git push${NC}"
fi
if [ "$BEHIND" -gt 0 ]; then
    echo -e "  ${RED}⚠ $BEHIND commit(s) behind origin - run: git pull${NC}"
fi
echo ""

# Recently modified files
echo -e "${YELLOW}▶ RECENTLY MODIFIED (last 24h):${NC}"
find "$PORTFOLIO_DIR/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -mtime -1 2>/dev/null | head -5 | while read file; do
    echo "  $(basename $file)"
done
[ $(find "$PORTFOLIO_DIR/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -mtime -1 2>/dev/null | wc -l) -eq 0 ] && echo "  (none)"
echo ""

# Pending tasks from roadmap
if [ -f "$ROADMAP" ]; then
    PENDING=$(grep -c "^\- \[ \]" "$ROADMAP" 2>/dev/null || echo "0")
    DONE=$(grep -c "^\- \[x\]" "$ROADMAP" 2>/dev/null || echo "0")
    echo -e "${GREEN}▶ ROADMAP STATUS:${NC} $DONE done, $PENDING pending"
    echo -e "  ${YELLOW}Next tasks:${NC}"
    grep -m 5 "^\- \[ \]" "$ROADMAP" 2>/dev/null | sed 's/^- \[ \] /  • /' | head -5
    echo ""
fi

# App status
echo -e "${BLUE}▶ APPS INVENTORY:${NC}"
FINISHED=$(ls -1d "$PORTFOLIO_DIR/apps"/*/ 2>/dev/null | grep -v testing | grep -v upgrades | wc -l)
TESTING=$(ls -1 "$PORTFOLIO_DIR/apps/testing" 2>/dev/null | wc -l)
UPGRADES=$(ls -1 "$PORTFOLIO_DIR/apps/upgrades" 2>/dev/null | wc -l)
echo "  Finished: $FINISHED | Testing: $TESTING | Upgrading: $UPGRADES"
echo ""

# Docker containers
echo -e "${CYAN}▶ DOCKER STATUS:${NC}"
RUNNING=$(docker ps -q 2>/dev/null | wc -l)
echo "  Running containers: $RUNNING"
docker ps --format "  • {{.Names}}: {{.Status}}" 2>/dev/null | head -5 || echo "  (docker not running)"
echo ""

# Last deployment
if [ -f "$DEPLOY_LOG" ]; then
    LAST_DEPLOY=$(tail -1 "$DEPLOY_LOG" 2>/dev/null)
    echo -e "${GREEN}▶ LAST DEPLOYMENT:${NC}"
    echo "  $LAST_DEPLOY"
    echo ""
fi

# Quick commands
echo -e "${BOLD}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}QUICK COMMANDS:${NC}"
echo ""
echo -e "  ${GREEN}Development:${NC}"
echo "    cd $PORTFOLIO_DIR && npm run dev    # Start dev server"
echo "    npm run build                        # Build production"
echo ""
echo -e "  ${YELLOW}Deployment:${NC}"
echo "    ./scripts/deploy.sh                  # Pull, build, deploy"
echo "    ./scripts/backup.sh                  # Create local backup"
echo "    ./scripts/github-backup.sh           # Push to GitHub"
echo ""
echo -e "  ${CYAN}Context:${NC}"
echo "    cat PORTFOLIO_ROADMAP.md            # View task roadmap"
echo "    cat CLAUDE.md                        # View Claude context"
echo "    cat sessions/                        # View session logs"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
