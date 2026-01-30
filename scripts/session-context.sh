#!/bin/bash

# Session Context Script
# Displays current project status and next steps on login
# Add to ~/.bashrc: source /var/www/zaylegend/scripts/session-context.sh

PORTFOLIO_DIR="/var/www/zaylegend"
ROADMAP="$PORTFOLIO_DIR/PORTFOLIO_ROADMAP.md"
SESSION_LOG="$PORTFOLIO_DIR/sessions"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}ZAYLEGEND PORTFOLIO - SESSION CONTEXT${NC}                       ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Last modified files (recent work)
echo -e "${YELLOW}▶ RECENTLY MODIFIED FILES:${NC}"
find "$PORTFOLIO_DIR/src" -type f -name "*.tsx" -o -name "*.ts" 2>/dev/null | \
    xargs ls -lt 2>/dev/null | head -5 | \
    awk '{print "  " $6, $7, $8, $9}'
echo ""

# Pending tasks from roadmap
if [ -f "$ROADMAP" ]; then
    echo -e "${GREEN}▶ PENDING TASKS (from PORTFOLIO_ROADMAP.md):${NC}"
    grep -E "^\- \[ \]" "$ROADMAP" 2>/dev/null | head -8 | sed 's/^/  /'
    echo ""
fi

# App status
echo -e "${BLUE}▶ APP STATUS:${NC}"
echo -e "  Testing apps:  $(ls -1 $PORTFOLIO_DIR/apps/testing 2>/dev/null | wc -l) repos"
echo -e "  Upgrade apps:  $(ls -1 $PORTFOLIO_DIR/apps/upgrades 2>/dev/null | wc -l) repos"
echo -e "  Featured apps: $(ls -1d $PORTFOLIO_DIR/apps/*/ 2>/dev/null | grep -v testing | grep -v upgrades | wc -l) apps"
echo ""

# Git status
echo -e "${MAGENTA}▶ GIT STATUS:${NC}"
cd "$PORTFOLIO_DIR" 2>/dev/null && git status -s 2>/dev/null | head -5 | sed 's/^/  /'
if [ $(cd "$PORTFOLIO_DIR" && git status -s 2>/dev/null | wc -l) -gt 5 ]; then
    echo "  ... and more changes"
fi
echo ""

# Docker containers
echo -e "${CYAN}▶ DOCKER CONTAINERS:${NC}"
docker ps --format "  {{.Names}}: {{.Status}}" 2>/dev/null | head -5 || echo "  No containers running"
echo ""

# Quick actions
echo -e "${BOLD}QUICK ACTIONS:${NC}"
echo "  cd $PORTFOLIO_DIR          # Go to portfolio"
echo "  bun run dev                 # Start dev server"
echo "  cat PORTFOLIO_ROADMAP.md   # View full roadmap"
echo "  cat CLAUDE.md              # View Claude context"
echo ""

# Latest session (if exists)
if [ -d "$SESSION_LOG" ]; then
    LATEST=$(ls -1t "$SESSION_LOG"/*.md 2>/dev/null | head -1)
    if [ -n "$LATEST" ]; then
        echo -e "${YELLOW}▶ LATEST SESSION:${NC}"
        echo "  $(basename $LATEST)"
        head -5 "$LATEST" 2>/dev/null | sed 's/^/  /'
        echo ""
    fi
fi

echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
echo ""
