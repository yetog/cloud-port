#!/bin/bash
#
# Shadow Server Maintenance
# Run daily to keep things clean
#

LOG="/var/log/server-maintenance.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    echo "[$DATE] $1" | tee -a "$LOG"
}

log "=== Starting maintenance ==="

# 1. Docker cleanup (remove unused images, containers, networks)
log "Cleaning Docker..."
docker system prune -af --filter "until=168h" >> "$LOG" 2>&1
FREED=$(docker system df --format "{{.Reclaimable}}" | head -1)
log "Docker cleanup complete. Images reclaimable: $FREED"

# 2. Clear old logs (older than 14 days)
log "Rotating logs..."
find /var/log -name "*.log" -type f -mtime +14 -exec truncate -s 0 {} \; 2>/dev/null
find /var/log -name "*.gz" -type f -mtime +30 -delete 2>/dev/null

# 3. Clean npm/pip cache
log "Cleaning package caches..."
npm cache clean --force >> "$LOG" 2>&1
pip cache purge >> "$LOG" 2>&1

# 4. SQLite maintenance
log "Optimizing databases..."
for db in /var/www/*/brain.db /var/www/*/*.db; do
    if [[ -f "$db" ]]; then
        sqlite3 "$db" "VACUUM; ANALYZE;" 2>/dev/null && log "Optimized: $db"
    fi
done

# 5. Clear temp files
log "Clearing temp files..."
find /tmp -type f -atime +3 -delete 2>/dev/null
find /var/tmp -type f -atime +7 -delete 2>/dev/null

# 6. Disk space check
USAGE=$(df / --output=pcent | tail -1 | tr -d ' %')
if [[ $USAGE -gt 85 ]]; then
    log "WARNING: Disk usage at ${USAGE}%"
    # Uncomment to send email alert:
    # echo "Disk usage at ${USAGE}% on $(hostname)" | shadow-mail send isayahy@gmail.com "Disk Warning"
fi

log "=== Maintenance complete ==="
