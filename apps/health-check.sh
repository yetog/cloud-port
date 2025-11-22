#!/bin/bash

# Health check script for all Docker apps
echo "=== Docker Apps Health Check ==="
echo "Timestamp: $(date)"
echo

apps=("chord-genesis:3001" "spritegen:3002" "dj-visualizer:3003" "fineline:3004" "game-hub:3005")

for app_port in "${apps[@]}"; do
    app=$(echo $app_port | cut -d: -f1)
    port=$(echo $app_port | cut -d: -f2)
    
    printf "%-15s: " "$app"
    
    if curl -f -s "http://localhost:$port" > /dev/null; then
        echo "✓ HEALTHY"
    else
        echo "✗ UNHEALTHY"
    fi
done

echo
echo "Docker container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "label=app.name"
