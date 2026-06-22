#!/bin/bash
# Capture Insight - Extract learnings from synthesis and update knowledge base
# Usage: ./scripts/capture-insight.sh [synthesis-file] [--interactive]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
KNOWLEDGE_DIR="$PROJECT_ROOT/storage/knowledge"
SESSIONS_DIR="$PROJECT_ROOT/storage/sessions"
GOTCHAS_FILE="$KNOWLEDGE_DIR/gotchas.md"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Ensure directories exist
mkdir -p "$KNOWLEDGE_DIR" "$SESSIONS_DIR"

# Interactive mode - create new synthesis
if [[ "$1" == "--interactive" ]] || [[ -z "$1" ]]; then
    echo "========================================"
    echo "  Capture Session Insight"
    echo "========================================"
    echo ""

    # Get date
    DATE=$(date +%Y-%m-%d)

    # Get title
    echo -e "${BLUE}Brief title for this session:${NC}"
    read -r TITLE
    SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

    FILENAME="$SESSIONS_DIR/${DATE}-${SLUG}.md"

    # Get agent
    echo ""
    echo -e "${BLUE}Which agent? (1=Infra, 2=Portfolio, 3=CodeReview):${NC}"
    read -r AGENT_NUM
    case $AGENT_NUM in
        1) AGENT="Infrastructure Engineer" ;;
        2) AGENT="Portfolio Curator" ;;
        3) AGENT="Code Reviewer" ;;
        *) AGENT="Infrastructure Engineer" ;;
    esac

    # Get task
    echo ""
    echo -e "${BLUE}What was the task?${NC}"
    read -r TASK

    # Get completed items
    echo ""
    echo -e "${BLUE}What was completed? (one per line, empty line to finish):${NC}"
    COMPLETED=""
    while IFS= read -r line; do
        [[ -z "$line" ]] && break
        COMPLETED="${COMPLETED}- ${line}\n"
    done

    # Get issues
    echo ""
    echo -e "${BLUE}Any issues encountered? (one per line, empty to skip):${NC}"
    ISSUES=""
    while IFS= read -r line; do
        [[ -z "$line" ]] && break
        ISSUES="${ISSUES}- ${line}\n"
    done

    # Get gotcha
    echo ""
    echo -e "${YELLOW}New gotcha to add? (leave empty to skip)${NC}"
    echo -e "${BLUE}Gotcha title:${NC}"
    read -r GOTCHA_TITLE

    GOTCHA_SECTION=""
    if [[ -n "$GOTCHA_TITLE" ]]; then
        echo -e "${BLUE}What happened:${NC}"
        read -r GOTCHA_WHAT
        echo -e "${BLUE}Prevention/fix:${NC}"
        read -r GOTCHA_PREVENT

        GOTCHA_SECTION="#### New Gotchas
- **Title:** ${GOTCHA_TITLE}
  - **What happened:** ${GOTCHA_WHAT}
  - **Prevention:** ${GOTCHA_PREVENT}"

        # Append to gotchas.md
        echo "" >> "$GOTCHAS_FILE"
        echo "### $(wc -l < "$GOTCHAS_FILE" | xargs). ${GOTCHA_TITLE}" >> "$GOTCHAS_FILE"
        echo "" >> "$GOTCHAS_FILE"
        echo "**Date Learned:** ${DATE}" >> "$GOTCHAS_FILE"
        echo "" >> "$GOTCHAS_FILE"
        echo "**What Happened:** ${GOTCHA_WHAT}" >> "$GOTCHAS_FILE"
        echo "" >> "$GOTCHAS_FILE"
        echo "**Prevention:** ${GOTCHA_PREVENT}" >> "$GOTCHAS_FILE"
        echo "" >> "$GOTCHAS_FILE"
        echo "---" >> "$GOTCHAS_FILE"

        echo -e "${GREEN}✓ Added gotcha to ${GOTCHAS_FILE}${NC}"
    fi

    # Get recommendations
    echo ""
    echo -e "${BLUE}Recommendations for future? (one per line, empty to finish):${NC}"
    RECOMMENDATIONS=""
    while IFS= read -r line; do
        [[ -z "$line" ]] && break
        RECOMMENDATIONS="${RECOMMENDATIONS}- ${line}\n"
    done

    # Write synthesis file
    cat > "$FILENAME" << EOF
## Session Synthesis

**Date:** ${DATE}
**Agent:** ${AGENT}
**Task:** ${TASK}

### Completed
$(echo -e "$COMPLETED")

### Issues Encountered
$(echo -e "$ISSUES")

### Insights

${GOTCHA_SECTION}

### Recommendations
$(echo -e "$RECOMMENDATIONS")

---
*Captured via capture-insight.sh*
EOF

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Synthesis saved to:${NC}"
    echo -e "${GREEN}  ${FILENAME}${NC}"
    echo -e "${GREEN}========================================${NC}"

else
    # Process existing synthesis file
    SYNTHESIS_FILE="$1"

    if [[ ! -f "$SYNTHESIS_FILE" ]]; then
        echo "Error: File not found: $SYNTHESIS_FILE"
        exit 1
    fi

    echo "Processing: $SYNTHESIS_FILE"

    # Extract gotchas section and append to gotchas.md
    # This is a simple extraction - could be enhanced with better parsing

    if grep -q "New Gotchas" "$SYNTHESIS_FILE"; then
        echo -e "${YELLOW}Found gotchas section - please manually review and add to gotchas.md${NC}"
        grep -A 10 "New Gotchas" "$SYNTHESIS_FILE"
    fi

    # Copy to sessions directory if not already there
    if [[ "$SYNTHESIS_FILE" != "$SESSIONS_DIR"* ]]; then
        BASENAME=$(basename "$SYNTHESIS_FILE")
        cp "$SYNTHESIS_FILE" "$SESSIONS_DIR/$BASENAME"
        echo -e "${GREEN}✓ Copied to $SESSIONS_DIR/$BASENAME${NC}"
    fi
fi

echo ""
echo "Done. Knowledge base updated."
