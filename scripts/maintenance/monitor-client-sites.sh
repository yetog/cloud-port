#!/bin/bash
#
# Client Site Monitor - Alert on site downtime
# Run via cron every 5-10 minutes
#
# Usage: ./monitor-client-sites.sh
#

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/client-sites.conf"
STATE_FILE="/tmp/client-sites-state"
LOG_FILE="/var/www/zaylegend/storage/logs/client-site-alerts.log"
EMAIL_SCRIPT="/var/www/zaylegend/scripts/email/send-email.py"
ALERT_EMAIL="isayahy@gmail.com"

# Ensure state file exists
touch "$STATE_FILE"

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Send alert email
send_alert() {
    local subject="$1"
    local body="$2"

    if [[ -x "$EMAIL_SCRIPT" ]]; then
        echo "$body" | python3 "$EMAIL_SCRIPT" "$ALERT_EMAIL" "[Site Alert] $subject" --stdin
        log "Alert sent: $subject"
    else
        log "ERROR: Email script not found at $EMAIL_SCRIPT"
    fi
}

# Check if site was already down (avoid duplicate alerts)
was_down() {
    local site="$1"
    grep -q "^DOWN:$site$" "$STATE_FILE" 2>/dev/null
}

# Mark site as down
mark_down() {
    local site="$1"
    if ! was_down "$site"; then
        echo "DOWN:$site" >> "$STATE_FILE"
    fi
}

# Mark site as up (clear down state)
mark_up() {
    local site="$1"
    sed -i "/^DOWN:$site$/d" "$STATE_FILE" 2>/dev/null
}

# Check a single site
check_site() {
    local name="$1"
    local url="$2"

    # Try HTTPS first, then HTTP
    local status
    status=$(curl -sf -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 30 "$url" 2>/dev/null)

    if [[ "$status" -ge 200 && "$status" -lt 400 ]]; then
        # Site is UP
        if was_down "$name"; then
            # Site recovered - send recovery notice
            send_alert "$name is BACK UP" "Good news: $name ($url) is responding again.

Status code: $status
Time: $(date)"
            mark_up "$name"
            log "$name recovered (HTTP $status)"
        fi
        echo "✓ $name: UP ($status)"
    else
        # Site is DOWN
        echo "✗ $name: DOWN ($status)"
        log "$name is down (HTTP $status)"

        if ! was_down "$name"; then
            # First time down - send alert
            send_alert "$name is DOWN" "ALERT: $name ($url) is not responding!

Status code: $status
Time: $(date)

Please check the site immediately."
            mark_down "$name"
        fi
    fi
}

# Default sites if config file doesn't exist
load_sites() {
    if [[ -f "$CONFIG_FILE" ]]; then
        cat "$CONFIG_FILE"
    else
        # Default client sites
        cat << 'EOF'
# Client Site Monitoring Configuration
# Format: NAME|URL
# Lines starting with # are ignored

GOAT Handyman|https://goathandymanny.com
GOAT Landscaping|https://goatlandscapeli.com
GreenRidge Landscape|https://greenridgelandscapedesign.com
Green Empire Landscaping|https://greenempireland.com
Green Empire Builders|https://greenempirebuild.com
EOF
    fi
}

# Main
echo "=== Client Site Monitor ==="
echo "Time: $(date)"
echo ""

while IFS='|' read -r name url; do
    # Skip comments and empty lines
    [[ "$name" =~ ^#.*$ || -z "$name" ]] && continue

    check_site "$name" "$url"
done < <(load_sites)

echo ""
echo "Log: $LOG_FILE"
