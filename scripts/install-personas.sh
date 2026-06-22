#!/bin/bash
# Install Portfolio Personas to Claude Code
# Usage: ./scripts/install-personas.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PERSONAS_DIR="$PROJECT_ROOT/personas"
CLAUDE_AGENTS_DIR="$HOME/.claude/agents"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================"
echo "  Portfolio Personas Installer"
echo "========================================"
echo ""

# Build personas first
echo -e "${BLUE}Building personas...${NC}"
cd "$PERSONAS_DIR"
node build-personas.js

# Create Claude Code agents directory if needed
mkdir -p "$CLAUDE_AGENTS_DIR"

# Copy Claude Code personas
echo ""
echo -e "${BLUE}Installing to Claude Code...${NC}"
cp "$PERSONAS_DIR/claude-code/"*.md "$CLAUDE_AGENTS_DIR/" 2>/dev/null || true

# List installed personas
echo ""
echo -e "${GREEN}Installed personas:${NC}"
ls -la "$CLAUDE_AGENTS_DIR/"*.md 2>/dev/null | awk '{print "  " $NF}'

echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo "To use a persona in Claude Code, type:"
echo "  @infrastructure-engineer <your request>"
echo "  @portfolio-curator <your request>"
echo "  @code-reviewer <your request>"
echo ""
echo "Or reference them in conversations to activate their expertise."
