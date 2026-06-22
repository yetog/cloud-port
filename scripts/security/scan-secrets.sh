#!/bin/bash
# Secret Scanner - Monthly security check for exposed credentials
# Usage: ./scripts/scan-secrets.sh [--install]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/secret-scan-$(date +%Y%m%d).log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Ensure logs directory exists
mkdir -p "$PROJECT_ROOT/logs"

echo "========================================"
echo "  Secret Scanner - $(date +%Y-%m-%d)"
echo "========================================"

# Install gitleaks if requested
if [[ "$1" == "--install" ]]; then
    echo -e "${YELLOW}Installing gitleaks...${NC}"
    GITLEAKS_VERSION="8.18.4"
    wget -q "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -O /tmp/gitleaks.tar.gz
    tar -xzf /tmp/gitleaks.tar.gz -C /tmp
    sudo mv /tmp/gitleaks /usr/local/bin/
    rm /tmp/gitleaks.tar.gz
    echo -e "${GREEN}gitleaks installed successfully${NC}"
fi

# Check if gitleaks is installed
if ! command -v gitleaks &> /dev/null; then
    echo -e "${RED}Error: gitleaks not installed${NC}"
    echo "Run: ./scripts/scan-secrets.sh --install"
    exit 1
fi

echo ""
echo "Scanning repository for secrets..."
echo ""

cd "$PROJECT_ROOT"

# Run gitleaks scan
if gitleaks detect --source . --verbose 2>&1 | tee "$LOG_FILE"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  No secrets detected!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Scan log saved to: $LOG_FILE"
else
    EXITCODE=$?
    if [[ $EXITCODE -eq 1 ]]; then
        echo ""
        echo -e "${RED}========================================${NC}"
        echo -e "${RED}  SECRETS DETECTED! Review log above.${NC}"
        echo -e "${RED}========================================${NC}"
        echo ""
        echo "Full scan log: $LOG_FILE"
        echo ""
        echo "Next steps:"
        echo "1. Rotate any exposed credentials immediately"
        echo "2. Remove secrets from git history (use git-filter-repo)"
        echo "3. Add patterns to .gitignore"
        exit 1
    fi
fi

# Also scan for common secret patterns manually
echo ""
echo "Additional pattern scan..."

PATTERNS=(
    "sk-[a-zA-Z0-9]{20,}"       # OpenAI
    "sk_live_[a-zA-Z0-9]{24,}"  # ElevenLabs
    "AKIA[0-9A-Z]{16}"          # AWS Access Key
    "ghp_[a-zA-Z0-9]{36}"       # GitHub PAT
    "glpat-[a-zA-Z0-9-]{20,}"   # GitLab PAT
)

FOUND_ISSUES=0
for pattern in "${PATTERNS[@]}"; do
    if grep -rE "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.env*" --include="*.py" . 2>/dev/null | grep -v node_modules | grep -v ".git"; then
        FOUND_ISSUES=1
    fi
done

if [[ $FOUND_ISSUES -eq 0 ]]; then
    echo -e "${GREEN}No additional secrets found in source files${NC}"
fi

echo ""
echo "Scan complete. Run monthly with: crontab -e"
echo "Add: 0 9 1 * * /var/www/zaylegend/scripts/scan-secrets.sh >> /var/www/zaylegend/logs/cron-secrets.log 2>&1"
