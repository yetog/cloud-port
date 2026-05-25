#!/bin/bash
#
# Shadow Daily Backup
# Backs up critical data to a local archive + optional remote
#

BACKUP_DIR="/var/backups/shadow"
DATE=$(date '+%Y-%m-%d')
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

# What to backup
TARGETS=(
    "/var/www/zaylegend"
    "/var/www/greenridgelandscapedesign"
    "/etc/nginx/conf.d"
)

# Create backup
ARCHIVE="$BACKUP_DIR/backup-$DATE.tar.gz"

echo "Creating backup: $ARCHIVE"
tar -czf "$ARCHIVE" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    "${TARGETS[@]}" 2>/dev/null

# Show size
SIZE=$(du -h "$ARCHIVE" | cut -f1)
echo "Backup complete: $SIZE"

# Cleanup old backups
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +$KEEP_DAYS -delete
echo "Cleaned backups older than $KEEP_DAYS days"

# Optional: sync to remote/S3
# aws s3 cp "$ARCHIVE" s3://your-bucket/backups/
# rsync -az "$ARCHIVE" user@remote:/backups/
