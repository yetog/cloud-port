#!/bin/bash

# Portfolio Health Check Script
# Monitors portfolio service and auto-restarts if needed

LOG_FILE="/var/www/zaylegend/health-check.log"
PORT=8080
SERVICE_DIR="/var/www/zaylegend"
DIST_DIR="/var/www/zaylegend/dist"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_port() {
    if ss -tlnp | grep -q ":$PORT "; then
        return 0
    else
        return 1
    fi
}

check_http_response() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ 2>/dev/null)
    if [ "$response" = "200" ]; then
        return 0
    else
        log_message "HTTP check failed. Response code: $response"
        return 1
    fi
}

check_assets() {
    # Check if main assets are accessible
    local js_asset=$(curl -s http://localhost:$PORT/ | grep -o '/assets/index-[^"]*\.js' | head -1)
    local css_asset=$(curl -s http://localhost:$PORT/ | grep -o '/assets/index-[^"]*\.css' | head -1)
    
    if [ -n "$js_asset" ] && [ -n "$css_asset" ]; then
        local js_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT$js_asset" 2>/dev/null)
        local css_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT$css_asset" 2>/dev/null)
        
        if [ "$js_response" = "200" ] && [ "$css_response" = "200" ]; then
            return 0
        else
            log_message "Assets check failed. JS: $js_response, CSS: $css_response"
            return 1
        fi
    else
        log_message "Could not find asset references in HTML"
        return 1
    fi
}

restart_service() {
    log_message "Attempting to restart portfolio service..."
    
    # Kill existing processes on port
    local pids=$(ss -tlnp | grep ":$PORT " | grep -o 'pid=[0-9]*' | grep -o '[0-9]*')
    for pid in $pids; do
        log_message "Killing process $pid"
        kill -9 "$pid" 2>/dev/null
    done
    
    sleep 2
    
    # Start new service from dist directory
    cd "$DIST_DIR"
    nohup python3 -m http.server $PORT > /dev/null 2>&1 &
    
    sleep 3
    
    if check_port && check_http_response; then
        log_message "Portfolio service restarted successfully"
        return 0
    else
        log_message "Failed to restart portfolio service"
        return 1
    fi
}

send_notification() {
    local message="$1"
    log_message "ALERT: $message"
    
    # Add notification methods here:
    # Example: curl webhook, email command, etc.
    
    # Slack webhook example (uncomment and configure):
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"🚨 Portfolio Alert: $message\"}" \
    #   YOUR_SLACK_WEBHOOK_URL
    
    # Email example (if mailutils is installed):
    # echo "$message" | mail -s "Portfolio Alert" your-email@domain.com
}

# Main health check
main() {
    log_message "Starting health check..."
    
    if ! check_port; then
        log_message "Port $PORT is not listening"
        send_notification "Portfolio service is down - port $PORT not listening"
        restart_service
        return
    fi
    
    if ! check_http_response; then
        log_message "HTTP health check failed"
        send_notification "Portfolio HTTP check failed"
        restart_service
        return
    fi
    
    if ! check_assets; then
        log_message "Assets health check failed"
        send_notification "Portfolio assets check failed"
        restart_service
        return
    fi
    
    log_message "All health checks passed"
}

# Run the health check
main "$@"