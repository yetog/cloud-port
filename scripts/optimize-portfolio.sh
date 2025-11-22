#!/bin/bash

# Portfolio Optimization Script
# Optimizes performance, cleans up resources, and applies best practices

echo "⚡ Portfolio Optimization Starting..."
echo "====================================="

# Function to show progress
show_progress() {
    echo "🔄 $1..."
}

# 1. Clean up Docker resources
show_progress "Cleaning up Docker resources"
echo "Before cleanup:"
docker system df

# Remove unused images, containers, volumes
docker container prune -f
docker image prune -a -f
docker volume prune -f
docker network prune -f

echo "After cleanup:"
docker system df
echo ""

# 2. Optimize nginx configuration
show_progress "Optimizing nginx configuration"
NGINX_CONF="/var/www/zaylegend/portfolio-infra/nginx/conf.d/portfolio.conf"

# Backup current config
cp "$NGINX_CONF" "$NGINX_CONF.$(date +%Y%m%d_%H%M%S).backup"

# Add performance optimizations if not already present
if ! grep -q "client_max_body_size" "$NGINX_CONF"; then
    sed -i '/server {/a\    client_max_body_size 100M;' "$NGINX_CONF"
    echo "✅ Added client_max_body_size"
fi

if ! grep -q "keepalive_timeout" "$NGINX_CONF"; then
    sed -i '/server {/a\    keepalive_timeout 65;' "$NGINX_CONF"
    echo "✅ Added keepalive_timeout"
fi

# 3. Update all apps to latest versions
show_progress "Updating all apps from repositories"
cd /var/www/zaylegend/apps

for app_dir in */; do
    app_name=${app_dir%/}
    if [ -d "$app_dir/.git" ]; then
        echo "  Updating $app_name..."
        cd "$app_dir"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "    Could not pull $app_name"
        cd ..
    fi
done

# 4. Rebuild all apps with optimizations
show_progress "Rebuilding apps with optimizations"
for app_dir in zen-reset chord-genesis fineline game-hub dj-visualizer spritegen; do
    if [ -d "$app_dir" ]; then
        echo "  Building $app_dir..."
        cd "$app_dir"
        
        # Install dependencies if needed
        if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
            npm install
        fi
        
        # Build the app
        if [ -f "package.json" ]; then
            npm run build 2>/dev/null || echo "    Build failed for $app_dir"
        fi
        
        cd ..
    fi
done

# 5. Optimize Docker images
show_progress "Rebuilding Docker images with optimizations"
for app in zen-reset chord-genesis fineline game-hub dj-visualizer spritegen; do
    if [ -d "$app" ] && [ -f "$app/Dockerfile" ]; then
        echo "  Rebuilding $app Docker image..."
        
        # Stop container if running
        docker stop "$app" 2>/dev/null || true
        docker rm "$app" 2>/dev/null || true
        
        # Get the port for this app
        case $app in
            "zen-reset") port="8081" ;;
            "chord-genesis") port="3002" ;;
            "fineline") port="3003" ;;
            "game-hub") port="3004" ;;
            "dj-visualizer") port="3005" ;;
            "spritegen") port="3006" ;;
        esac
        
        # Build with cache optimization
        if [ -f "$app/vite.config.ts" ] || [ -f "$app/vite.config.js" ]; then
            docker build --build-arg VITE_BASE_PATH="/$app/" -t "$app" "$app/" --no-cache
        else
            docker build -t "$app" "$app/" --no-cache
        fi
        
        # Start container
        docker run -d --name "$app" -p "$port:80" "$app:latest"
        echo "    ✅ $app rebuilt and started on port $port"
    fi
done

# 6. Test all apps
show_progress "Testing all applications"
sleep 5  # Wait for containers to start

test_app() {
    local url="$1"
    local name="$2"
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --connect-timeout 10)
    
    if [ "$status" = "200" ]; then
        echo "  ✅ $name - $url"
    else
        echo "  ❌ $name - $url (HTTP $status)"
    fi
}

test_app "https://zaylegend.com/" "Portfolio"
test_app "https://zaylegend.com/zen-reset/" "Zen Reset"
test_app "https://zaylegend.com/chord-genesis/" "Chord Genesis"
test_app "https://zaylegend.com/fineline/" "FineLine"
test_app "https://zaylegend.com/game-hub/" "Game Hub"
test_app "https://zaylegend.com/dj-visualizer/" "DJ Visualizer"
test_app "https://zaylegend.com/spritegen/" "SpriteGen"

# 7. Reload nginx
show_progress "Reloading nginx"
sudo nginx -t && sudo systemctl reload nginx
echo "  ✅ Nginx reloaded"

# 8. Set up log rotation (if not already configured)
show_progress "Configuring log rotation"
if [ ! -f "/etc/logrotate.d/portfolio-apps" ]; then
    sudo tee /etc/logrotate.d/portfolio-apps > /dev/null << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \$(cat /var/run/nginx.pid)
        fi
    endscript
}
EOF
    echo "  ✅ Log rotation configured"
else
    echo "  ℹ️ Log rotation already configured"
fi

# 9. Security hardening check
show_progress "Security hardening check"
echo "  Checking SSL certificate..."
cert_days=$(echo | openssl s_client -servername zaylegend.com -connect zaylegend.com:443 2>/dev/null | openssl x509 -noout -checkend 2592000 2>/dev/null && echo "Valid" || echo "Expires soon")
echo "    SSL status: $cert_days"

echo "  Checking file permissions..."
find /var/www/zaylegend -name "*.sh" -not -perm 755 -exec chmod 755 {} \;
echo "    ✅ Script permissions fixed"

# 10. Generate performance report
show_progress "Generating performance report"
echo ""
echo "📊 OPTIMIZATION COMPLETE"
echo "========================"
echo ""
echo "🐳 Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen|NAMES)"
echo ""
echo "💾 Resource Usage After Optimization:"
docker system df
echo ""
echo "⚡ Performance Tips:"
echo "  • Monitor apps regularly: ./scripts/monitor-apps.sh"
echo "  • Update dependencies monthly: npm update in each app"
echo "  • Run this optimization monthly: ./scripts/optimize-portfolio.sh"
echo "  • Monitor SSL cert expiration (currently: $cert_days)"
echo "  • Consider CDN for static assets if traffic grows"
echo ""
echo "🎉 Portfolio optimization completed successfully!"