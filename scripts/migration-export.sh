#!/bin/bash
#
# Shadow Migration Export
# Creates a complete package to migrate this server to a new machine
#
# Run: ./migration-export.sh
# Output: /var/backups/migration/migration-YYYY-MM-DD.tar.gz
#

set -e

EXPORT_DIR="/var/backups/migration"
DATE=$(date '+%Y-%m-%d')
WORK_DIR="$EXPORT_DIR/staging-$DATE"
FINAL_ARCHIVE="$EXPORT_DIR/migration-$DATE.tar.gz"

echo "=== Shadow Migration Export ==="
echo "Date: $DATE"
echo ""

mkdir -p "$WORK_DIR"/{configs,data,scripts,docker,docs}

# 1. System info snapshot
echo "[1/8] Capturing system info..."
cat > "$WORK_DIR/docs/system-info.txt" << EOF
=== SOURCE SERVER INFO ===
Date: $(date)
Hostname: $(hostname)
IP: $(curl -s ifconfig.me)
OS: $(lsb_release -d 2>/dev/null | cut -f2 || cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
Kernel: $(uname -r)
CPU: $(nproc) cores
RAM: $(free -h | awk '/Mem:/ {print $2}')
Disk: $(df -h / | awk 'NR==2 {print $2 " total, " $3 " used"}')

=== INSTALLED SERVICES ===
$(systemctl list-units --type=service --state=running --no-pager | head -30)

=== DOCKER VERSION ===
$(docker --version)

=== NODE VERSION ===
$(node --version 2>/dev/null || echo "Not installed")

=== PYTHON VERSION ===
$(python3 --version)

=== NGINX VERSION ===
$(nginx -v 2>&1)
EOF

# 2. Package list
echo "[2/8] Recording installed packages..."
dpkg --get-selections > "$WORK_DIR/docs/packages.txt"
pip3 list > "$WORK_DIR/docs/pip-packages.txt" 2>/dev/null
npm list -g --depth=0 > "$WORK_DIR/docs/npm-global.txt" 2>/dev/null

# 3. Nginx configs
echo "[3/8] Exporting nginx configs..."
cp -r /etc/nginx/conf.d "$WORK_DIR/configs/nginx-conf.d"
cp /etc/nginx/nginx.conf "$WORK_DIR/configs/nginx.conf" 2>/dev/null

# 4. Cron jobs
echo "[4/8] Exporting cron jobs..."
crontab -l > "$WORK_DIR/configs/crontab.txt" 2>/dev/null
cp -r /etc/cron.d "$WORK_DIR/configs/cron.d" 2>/dev/null

# 5. Web directories (excluding node_modules, .git, dist)
echo "[5/8] Exporting web directories (this may take a while)..."
for dir in /var/www/*/; do
    name=$(basename "$dir")
    echo "  - $name"
    tar -czf "$WORK_DIR/data/$name.tar.gz" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='.venv' \
        -C /var/www "$name" 2>/dev/null
done

# 6. Docker compose files & running containers info
echo "[6/8] Exporting Docker info..."
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" > "$WORK_DIR/docker/running-containers.txt"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" > "$WORK_DIR/docker/images.txt"

# Find all docker-compose files
find /var/www -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null | while read f; do
    relpath=$(echo "$f" | sed 's|/var/www/||' | tr '/' '_')
    cp "$f" "$WORK_DIR/docker/$relpath"
done

# 7. SSL certs (Let's Encrypt)
echo "[7/8] Noting SSL cert info..."
if [[ -d /etc/letsencrypt ]]; then
    ls -la /etc/letsencrypt/live/ > "$WORK_DIR/configs/ssl-certs.txt" 2>/dev/null
    echo "Note: SSL certs should be regenerated on new server with certbot" >> "$WORK_DIR/configs/ssl-certs.txt"
fi

# 8. Mail config
echo "[8/8] Exporting mail config..."
cp /etc/msmtprc "$WORK_DIR/configs/msmtprc" 2>/dev/null
# Mask password in export
sed -i 's/^password.*/password       ***REDACTED***/' "$WORK_DIR/configs/msmtprc" 2>/dev/null

# Create migration guide
cat > "$WORK_DIR/MIGRATION-GUIDE.md" << 'EOF'
# Shadow Server Migration Guide

## On New Server

### 1. Base Setup
```bash
# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y nginx docker.io docker-compose nodejs npm python3 python3-pip git msmtp msmtp-mta

# Enable services
systemctl enable nginx docker
systemctl start nginx docker
```

### 2. Restore Web Directories
```bash
# Extract each app
cd /var/www
for archive in /path/to/migration/data/*.tar.gz; do
    tar -xzf "$archive"
done
```

### 3. Restore Nginx Config
```bash
cp configs/nginx-conf.d/* /etc/nginx/conf.d/
nginx -t && systemctl reload nginx
```

### 4. Restore Cron Jobs
```bash
crontab configs/crontab.txt
```

### 5. Rebuild Docker Apps
```bash
# For each docker app
cd /var/www/app-name
docker-compose up -d --build
```

### 6. SSL Certificates
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### 7. Mail Config
```bash
# Edit /etc/msmtprc with your credentials
# (password was redacted in export)
```

### 8. DNS
Point your domain DNS to new server IP.

## Checklist
- [ ] All web directories restored
- [ ] Nginx configs in place
- [ ] Docker containers running
- [ ] SSL certs generated
- [ ] Cron jobs restored
- [ ] Mail working
- [ ] DNS updated
- [ ] Test all apps
EOF

# Create final archive
echo ""
echo "Creating final archive..."
tar -czf "$FINAL_ARCHIVE" -C "$EXPORT_DIR" "staging-$DATE"

# Cleanup staging
rm -rf "$WORK_DIR"

# Stats
SIZE=$(du -h "$FINAL_ARCHIVE" | cut -f1)
echo ""
echo "=== Migration Export Complete ==="
echo "Archive: $FINAL_ARCHIVE"
echo "Size: $SIZE"
echo ""
echo "To download:"
echo "  scp user@$(curl -s ifconfig.me):$FINAL_ARCHIVE ."
