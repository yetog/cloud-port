#!/bin/bash
# Server Security Monitoring - Monthly Cron Jobs
# Run: ./scripts/security-cron.sh --install (to set up cron)
# Run: ./scripts/security-cron.sh --run (to run all checks manually)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs/security"
DATE=$(date +%Y%m%d)
REPORT_FILE="$LOG_DIR/security-report-$DATE.md"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure directories exist
mkdir -p "$LOG_DIR"

# Initialize report
init_report() {
    cat > "$REPORT_FILE" << EOF
# Security Report - $(date +%Y-%m-%d)

Generated: $(date)
Server: $(hostname)

---

EOF
}

# 1. Check for failed SSH login attempts
check_ssh_failures() {
    echo -e "${BLUE}[1/7] Checking SSH login failures...${NC}"
    echo "## SSH Login Failures (Last 30 Days)" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    if [ -f /var/log/auth.log ]; then
        FAILED_COUNT=$(grep -c "Failed password" /var/log/auth.log 2>/dev/null || echo "0")
        UNIQUE_IPS=$(grep "Failed password" /var/log/auth.log 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort -u | wc -l || echo "0")

        echo "- Failed attempts: $FAILED_COUNT" >> "$REPORT_FILE"
        echo "- Unique IPs: $UNIQUE_IPS" >> "$REPORT_FILE"

        if [ "$FAILED_COUNT" -gt 100 ]; then
            echo -e "${RED}  WARNING: $FAILED_COUNT failed SSH attempts detected${NC}"
            echo "- **WARNING**: High volume of failed attempts" >> "$REPORT_FILE"

            # Show top 10 attacking IPs
            echo "" >> "$REPORT_FILE"
            echo "### Top 10 Attacking IPs:" >> "$REPORT_FILE"
            grep "Failed password" /var/log/auth.log 2>/dev/null | \
                grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | \
                sort | uniq -c | sort -rn | head -10 | \
                while read count ip; do
                    echo "- $ip: $count attempts" >> "$REPORT_FILE"
                done
        else
            echo -e "${GREEN}  OK: $FAILED_COUNT failed attempts${NC}"
        fi
    else
        echo "- Auth log not accessible" >> "$REPORT_FILE"
    fi
    echo "" >> "$REPORT_FILE"
}

# 2. Check SSL certificate expiry
check_ssl_certs() {
    echo -e "${BLUE}[2/7] Checking SSL certificates...${NC}"
    echo "## SSL Certificate Status" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    DOMAINS=("zaylegend.com" "sensei.zaylegend.com")

    for domain in "${DOMAINS[@]}"; do
        EXPIRY=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
            openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

        if [ -n "$EXPIRY" ]; then
            EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
            NOW_EPOCH=$(date +%s)
            DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

            if [ "$DAYS_LEFT" -lt 14 ]; then
                echo -e "${RED}  $domain: EXPIRES IN $DAYS_LEFT DAYS${NC}"
                echo "- **$domain**: Expires in $DAYS_LEFT days - RENEW NOW" >> "$REPORT_FILE"
            elif [ "$DAYS_LEFT" -lt 30 ]; then
                echo -e "${YELLOW}  $domain: Expires in $DAYS_LEFT days${NC}"
                echo "- $domain: Expires in $DAYS_LEFT days - Renew soon" >> "$REPORT_FILE"
            else
                echo -e "${GREEN}  $domain: Valid for $DAYS_LEFT days${NC}"
                echo "- $domain: Valid for $DAYS_LEFT days" >> "$REPORT_FILE"
            fi
        else
            echo "- $domain: Could not check certificate" >> "$REPORT_FILE"
        fi
    done
    echo "" >> "$REPORT_FILE"
}

# 3. Check for system updates
check_system_updates() {
    echo -e "${BLUE}[3/7] Checking system updates...${NC}"
    echo "## System Updates" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    if command -v apt &> /dev/null; then
        apt-get update -qq 2>/dev/null
        UPDATES=$(apt list --upgradable 2>/dev/null | grep -c upgradable || echo "0")
        SECURITY=$(apt list --upgradable 2>/dev/null | grep -c security || echo "0")

        echo "- Available updates: $UPDATES" >> "$REPORT_FILE"
        echo "- Security updates: $SECURITY" >> "$REPORT_FILE"

        if [ "$SECURITY" -gt 0 ]; then
            echo -e "${RED}  $SECURITY security updates available${NC}"
            echo "- **ACTION NEEDED**: Install security updates" >> "$REPORT_FILE"
        else
            echo -e "${GREEN}  System up to date${NC}"
        fi
    else
        echo "- apt not available" >> "$REPORT_FILE"
    fi
    echo "" >> "$REPORT_FILE"
}

# 4. Check Docker container health
check_docker_health() {
    echo -e "${BLUE}[4/7] Checking Docker containers...${NC}"
    echo "## Docker Container Health" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    if command -v docker &> /dev/null; then
        RUNNING=$(docker ps -q | wc -l)
        UNHEALTHY=$(docker ps --filter "health=unhealthy" -q | wc -l)
        EXITED=$(docker ps -a --filter "status=exited" -q | wc -l)

        echo "- Running containers: $RUNNING" >> "$REPORT_FILE"
        echo "- Unhealthy containers: $UNHEALTHY" >> "$REPORT_FILE"
        echo "- Exited containers: $EXITED" >> "$REPORT_FILE"

        if [ "$UNHEALTHY" -gt 0 ]; then
            echo -e "${RED}  $UNHEALTHY unhealthy containers detected${NC}"
            echo "" >> "$REPORT_FILE"
            echo "### Unhealthy Containers:" >> "$REPORT_FILE"
            docker ps --filter "health=unhealthy" --format "- {{.Names}}: {{.Status}}" >> "$REPORT_FILE"
        else
            echo -e "${GREEN}  All containers healthy${NC}"
        fi
    else
        echo "- Docker not available" >> "$REPORT_FILE"
    fi
    echo "" >> "$REPORT_FILE"
}

# 5. Check disk space
check_disk_space() {
    echo -e "${BLUE}[5/7] Checking disk space...${NC}"
    echo "## Disk Space" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    df -h / | tail -1 | awk '{
        print "- Root partition: " $5 " used (" $3 " of " $2 ")"
    }' >> "$REPORT_FILE"

    USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$USAGE" -gt 85 ]; then
        echo -e "${RED}  Disk usage: ${USAGE}% - Clean up needed${NC}"
        echo "- **WARNING**: Disk usage above 85%" >> "$REPORT_FILE"
    elif [ "$USAGE" -gt 70 ]; then
        echo -e "${YELLOW}  Disk usage: ${USAGE}%${NC}"
    else
        echo -e "${GREEN}  Disk usage: ${USAGE}%${NC}"
    fi
    echo "" >> "$REPORT_FILE"
}

# 6. Check nginx config and open ports
check_nginx_security() {
    echo -e "${BLUE}[6/7] Checking Nginx security...${NC}"
    echo "## Nginx Security" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    if command -v nginx &> /dev/null; then
        # Test nginx config
        if nginx -t 2>&1 | grep -q "successful"; then
            echo -e "${GREEN}  Nginx config: Valid${NC}"
            echo "- Config: Valid" >> "$REPORT_FILE"
        else
            echo -e "${RED}  Nginx config: Invalid${NC}"
            echo "- **Config: Invalid** - Run: nginx -t" >> "$REPORT_FILE"
        fi

        # Check for HTTP headers
        HEADERS=$(curl -sI https://zaylegend.com 2>/dev/null | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" | wc -l)
        echo "- Security headers present: $HEADERS/3" >> "$REPORT_FILE"
    else
        echo "- Nginx not found" >> "$REPORT_FILE"
    fi
    echo "" >> "$REPORT_FILE"
}

# 7. Run secret scan
run_secret_scan() {
    echo -e "${BLUE}[7/7] Running secret scan...${NC}"
    echo "## Secret Scan" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    if [ -x "$SCRIPT_DIR/scan-secrets.sh" ]; then
        if "$SCRIPT_DIR/scan-secrets.sh" > "$LOG_DIR/secret-scan-$DATE.log" 2>&1; then
            echo -e "${GREEN}  No secrets detected${NC}"
            echo "- Status: No secrets detected" >> "$REPORT_FILE"
        else
            echo -e "${RED}  Secrets detected - check log${NC}"
            echo "- **STATUS: SECRETS DETECTED** - Review $LOG_DIR/secret-scan-$DATE.log" >> "$REPORT_FILE"
        fi
    else
        echo "- Secret scanner not available" >> "$REPORT_FILE"
    fi
    echo "" >> "$REPORT_FILE"
}

# Finalize report
finalize_report() {
    echo "---" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "*Report generated by security-cron.sh*" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Next scheduled run: 1st of next month at 9:00 AM" >> "$REPORT_FILE"

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Security report saved to:${NC}"
    echo -e "${GREEN}  $REPORT_FILE${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# Install cron jobs
install_cron() {
    echo "Installing security cron jobs..."

    # Create cron entries
    CRON_ENTRIES="# Security monitoring cron jobs
# Secret scan - 1st of every month at 9:00 AM
0 9 1 * * $SCRIPT_DIR/scan-secrets.sh >> $LOG_DIR/cron-secrets.log 2>&1

# Full security check - 1st of every month at 9:30 AM
30 9 1 * * $SCRIPT_DIR/security-cron.sh --run >> $LOG_DIR/cron-security.log 2>&1

# SSL certificate check - Every Sunday at 8:00 AM
0 8 * * 0 echo | openssl s_client -servername zaylegend.com -connect zaylegend.com:443 2>/dev/null | openssl x509 -noout -checkend 1209600 || echo 'SSL cert expires within 14 days' | mail -s 'SSL Alert' root

# Docker health check - Daily at 6:00 AM
0 6 * * * docker ps --filter 'health=unhealthy' -q | wc -l | xargs -I {} test {} -gt 0 && echo 'Unhealthy containers detected' >> $LOG_DIR/docker-health.log
"

    echo "$CRON_ENTRIES"
    echo ""
    echo "To install, run:"
    echo "  crontab -e"
    echo ""
    echo "Then add the above entries, or run:"
    echo "  (crontab -l 2>/dev/null; echo \"$CRON_ENTRIES\") | crontab -"
}

# Main
case "${1:-}" in
    --install)
        install_cron
        ;;
    --run)
        echo "========================================"
        echo "  Security Check - $(date +%Y-%m-%d)"
        echo "========================================"
        echo ""
        init_report
        check_ssh_failures
        check_ssl_certs
        check_system_updates
        check_docker_health
        check_disk_space
        check_nginx_security
        run_secret_scan
        finalize_report
        ;;
    *)
        echo "Server Security Monitoring"
        echo ""
        echo "Usage:"
        echo "  $0 --install    Show cron job installation instructions"
        echo "  $0 --run        Run all security checks now"
        echo ""
        echo "Checks performed:"
        echo "  1. SSH login failure monitoring"
        echo "  2. SSL certificate expiry"
        echo "  3. System security updates"
        echo "  4. Docker container health"
        echo "  5. Disk space usage"
        echo "  6. Nginx configuration"
        echo "  7. Secret scanning (gitleaks)"
        ;;
esac
