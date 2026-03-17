#!/bin/bash
# Deploy Testing Apps to Docker
# Usage: ./scripts/deploy-testing-apps.sh [app-name]
# If no app name provided, deploys all configured apps

set -e

APPS_DIR="/var/www/zaylegend/apps/testing"

# App configurations: name:port
declare -A APP_PORTS=(
    ["darkflow-mind-mapper"]=3010
    ["gmat-mastery-suite"]=3012
    ["losk"]=3013
    ["got-hired-ai"]=3014
)

deploy_app() {
    local app_name=$1
    local port=${APP_PORTS[$app_name]}

    if [ -z "$port" ]; then
        echo "❌ Unknown app: $app_name"
        return 1
    fi

    local app_path="$APPS_DIR/$app_name"

    if [ ! -d "$app_path" ]; then
        echo "❌ App directory not found: $app_path"
        return 1
    fi

    if [ ! -f "$app_path/Dockerfile" ]; then
        echo "❌ Dockerfile not found for $app_name"
        return 1
    fi

    echo "🔨 Building $app_name..."
    cd "$app_path"
    docker build -t "$app_name" .

    # Stop and remove existing container if running
    if docker ps -a --format '{{.Names}}' | grep -q "^${app_name}$"; then
        echo "🛑 Stopping existing $app_name container..."
        docker stop "$app_name" 2>/dev/null || true
        docker rm "$app_name" 2>/dev/null || true
    fi

    echo "🚀 Starting $app_name on port $port..."
    docker run -d \
        --name "$app_name" \
        -p "$port:80" \
        --restart unless-stopped \
        "$app_name"

    echo "✅ $app_name deployed at http://localhost:$port"
}

# Main
if [ -n "$1" ]; then
    deploy_app "$1"
else
    echo "🚀 Deploying all testing apps..."
    echo ""
    for app in "${!APP_PORTS[@]}"; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        deploy_app "$app"
        echo ""
    done

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ All apps deployed!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Add nginx configs from docs/nginx-testing-apps.conf"
    echo "2. Run: sudo nginx -s reload"
    echo "3. Rebuild portfolio: npm run build"
fi
