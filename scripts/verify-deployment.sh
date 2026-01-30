#!/bin/bash

# Deployment Verification Script
# Checks if the latest changes are actually live on the website

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== DEPLOYMENT VERIFICATION ===${NC}"

# Check git status
echo "Current commit:"
git rev-parse HEAD

# Check if changes contain UI modifications
echo -e "\n${YELLOW}Recent UI file changes:${NC}"
git diff HEAD~5..HEAD --name-only | grep -E '\.(tsx?|css|html)$' || echo "No UI files changed in last 5 commits"

# Check build timestamps
echo -e "\n${YELLOW}Build file timestamps:${NC}"
if [ -d "dist" ]; then
    ls -la dist/*.html 2>/dev/null || echo "No HTML files in dist"
    echo "Dist directory size: $(du -sh dist 2>/dev/null || echo 'N/A')"
else
    echo -e "${RED}No dist directory found${NC}"
fi

# Test website response with cache busting
echo -e "\n${YELLOW}Testing website with cache busting:${NC}"
TIMESTAMP=$(date +%s)
curl -s -I "https://zaylegend.com/?v=$TIMESTAMP" | head -5

# Check for recent commits that actually change content
echo -e "\n${YELLOW}Commits with actual content changes:${NC}"
for commit in $(git rev-list HEAD~10..HEAD); do
    if git diff-tree --no-commit-id --name-only $commit | grep -qE '\.(tsx?|css|html)$'; then
        echo "$(git log --oneline -1 $commit) - HAS UI CHANGES"
    fi
done

echo -e "\n${GREEN}Verification complete!${NC}"
echo -e "${YELLOW}If website doesn't show changes:${NC}"
echo "1. Try hard refresh (Ctrl+Shift+R)"
echo "2. Check if recent commits actually contain visual changes"
echo "3. Run enhanced deployment: ./scripts/deploy-enhanced.sh"