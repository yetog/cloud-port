#!/bin/bash

# Portfolio Apps Monitoring Script
# Shows status, health, and resource usage of all apps

echo "🔍 Portfolio Apps Status Monitor"
echo "=================================="
echo ""

# Function to check if URL is accessible
check_url() {
    local url="$1"
    local app_name="$2"
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" --connect-timeout 5)
    
    if [ "$status" = "200" ]; then
        echo "✅ $app_name - $url (HTTP $status)"
    else
        echo "❌ $app_name - $url (HTTP $status)"
    fi
}

# Docker containers status
echo "🐳 Docker Containers:"
echo "--------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen)" || echo "No app containers running"
echo ""

# Web accessibility check
echo "🌐 Web Accessibility Check:"
echo "---------------------------"
check_url "https://zaylegend.com/" "Portfolio"
check_url "https://zaylegend.com/zen-reset/" "Zen Reset"
check_url "https://zaylegend.com/chord-genesis/" "Chord Genesis"
check_url "https://zaylegend.com/fineline/" "FineLine"
check_url "https://zaylegend.com/game-hub/" "Game Hub"
check_url "https://zaylegend.com/dj-visualizer/" "DJ Visualizer"
check_url "https://zaylegend.com/spritegen/" "SpriteGen"
echo ""

# Resource usage
echo "💻 Resource Usage:"
echo "------------------"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -n 1
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen)" || echo "No app containers running"
echo ""

# Disk usage
echo "💾 Disk Usage:"
echo "--------------"
echo "Apps directory: $(du -sh /var/www/zaylegend/apps 2>/dev/null || echo 'N/A')"
echo "Docker images: $(docker images --format 'table {{.Repository}}\t{{.Size}}' | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen)" | awk '{sum+=$2} END {print sum "MB"}' 2>/dev/null || echo 'N/A')"
echo "Total Docker usage: $(docker system df --format 'table {{.Type}}\t{{.Size}}' | grep -v TYPE | awk '{print $2}' | head -1)"
echo ""

# Recent logs (errors only)
echo "🚨 Recent Errors:"
echo "-----------------"
echo "Nginx errors (last 5):"
sudo tail -n 5 /var/log/nginx/error.log 2>/dev/null | grep -i error || echo "No recent nginx errors"
echo ""

echo "App container errors (last 24h):"
for app in zen-reset chord-genesis fineline game-hub dj-visualizer spritegen; do
    if docker ps -q -f name=$app > /dev/null 2>&1; then
        errors=$(docker logs $app --since 24h 2>&1 | grep -i error | wc -l)
        if [ "$errors" -gt 0 ]; then
            echo "  $app: $errors errors"
        fi
    fi
done
echo ""

# SSL Certificate check
echo "🔒 SSL Certificate:"
echo "-------------------"
cert_info=$(echo | openssl s_client -servername zaylegend.com -connect zaylegend.com:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "$cert_info"
else
    echo "Could not retrieve SSL certificate info"
fi
echo ""

# Performance suggestions
echo "⚡ Performance Suggestions:"
echo "---------------------------"
total_containers=$(docker ps | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen)" | wc -l)
echo "• Total apps running: $total_containers"

if [ $total_containers -gt 5 ]; then
    echo "• Consider stopping unused apps to save resources"
fi

# Check for unused Docker resources
unused_images=$(docker images -f "dangling=true" -q | wc -l)
if [ $unused_images -gt 0 ]; then
    echo "• Clean up unused Docker images: docker image prune -a"
fi

unused_volumes=$(docker volume ls -f dangling=true -q | wc -l)
if [ $unused_volumes -gt 0 ]; then
    echo "• Clean up unused Docker volumes: docker volume prune"
fi

echo ""
echo "📊 Summary: Portfolio is $([ $(docker ps | grep -E "(zen-reset|chord-genesis|fineline|game-hub|dj-visualizer|spritegen)" | wc -l) -gt 0 ] && echo 'RUNNING' || echo 'DOWN')"