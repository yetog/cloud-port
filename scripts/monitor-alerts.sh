#!/bin/bash
#
# Shadow Monitor - Alert on critical issues
# Run every 10-15 minutes
#

ALERT_EMAIL="isayahy@gmail.com"
STATE_FILE="/tmp/shadow-monitor-state"

alert() {
    local subject="$1"
    local body="$2"
    echo "$body" | shadow-mail send "$ALERT_EMAIL" "[Alert] $subject"
    echo "$(date): Alerted - $subject" >> /var/log/shadow-alerts.log
}

# Track state to avoid repeat alerts
check_state() {
    local key="$1"
    grep -q "$key" "$STATE_FILE" 2>/dev/null
}

set_state() {
    local key="$1"
    echo "$key" >> "$STATE_FILE"
}

clear_state() {
    local key="$1"
    sed -i "/$key/d" "$STATE_FILE" 2>/dev/null
}

# === CHECKS ===

# 1. Disk space > 90%
DISK_USAGE=$(df / --output=pcent | tail -1 | tr -d ' %')
if [[ $DISK_USAGE -gt 90 ]]; then
    if ! check_state "disk_critical"; then
        alert "Disk Critical: ${DISK_USAGE}%" "Server disk is at ${DISK_USAGE}% capacity.\n\nTop space usage:\n$(du -sh /var/www/* 2>/dev/null | sort -rh | head -5)"
        set_state "disk_critical"
    fi
else
    clear_state "disk_critical"
fi

# 2. Memory usage > 90%
MEM_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')
if [[ $MEM_USAGE -gt 90 ]]; then
    if ! check_state "mem_critical"; then
        alert "Memory Critical: ${MEM_USAGE}%" "Server memory at ${MEM_USAGE}%.\n\nTop processes:\n$(ps aux --sort=-%mem | head -6)"
        set_state "mem_critical"
    fi
else
    clear_state "mem_critical"
fi

# 3. Nginx down
if ! systemctl is-active --quiet nginx; then
    if ! check_state "nginx_down"; then
        alert "Nginx Down" "Nginx is not running!\n\nAttempting restart..."
        sudo systemctl restart nginx
        set_state "nginx_down"
    fi
else
    clear_state "nginx_down"
fi

# 4. Portfolio site down (port 8080)
if ! curl -sf http://localhost:8080 > /dev/null 2>&1; then
    if ! check_state "portfolio_down"; then
        alert "Portfolio Down" "Main portfolio site (port 8080) is not responding."
        set_state "portfolio_down"
    fi
else
    clear_state "portfolio_down"
fi

# 5. Docker daemon
if ! docker info > /dev/null 2>&1; then
    if ! check_state "docker_down"; then
        alert "Docker Down" "Docker daemon is not responding."
        set_state "docker_down"
    fi
else
    clear_state "docker_down"
fi

# 6. SSL cert expiring soon (< 7 days)
DOMAIN="zaylegend.com"
CERT_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [[ -n "$CERT_EXPIRY" ]]; then
    EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    if [[ $DAYS_LEFT -lt 7 ]]; then
        if ! check_state "ssl_expiring"; then
            alert "SSL Expiring" "SSL certificate for $DOMAIN expires in $DAYS_LEFT days.\n\nRun: sudo certbot renew"
            set_state "ssl_expiring"
        fi
    else
        clear_state "ssl_expiring"
    fi
fi

# Cleanup state file (keep last 100 lines)
tail -100 "$STATE_FILE" > "${STATE_FILE}.tmp" 2>/dev/null && mv "${STATE_FILE}.tmp" "$STATE_FILE"
