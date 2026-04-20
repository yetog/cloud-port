#!/bin/bash

# =============================================================================
# Update App from Repository
# Pulls latest changes and rebuilds Docker container for a specific app
#
# Usage: ./update-app.sh <app-name>
# Example: ./update-app.sh green-empire
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

APP_NAME="$1"
PORTFOLIO_DIR="/var/www/zaylegend"
APPS_DIR="$PORTFOLIO_DIR/apps"

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Find app directory
find_app_dir() {
    local name="$1"

    # Check common locations
    local locations=(
        "$APPS_DIR/$name"
        "$APPS_DIR/$(echo $name | tr '-' '_')"
        "$APPS_DIR/$(echo $name | tr '_' '-')"
        "/var/www/$name"
        "/var/www/$(echo $name | sed 's/\b\(.\)/\u\1/g')"  # Title case
        "/var/www/Green-Empire"  # Special case
    )

    for loc in "${locations[@]}"; do
        if [ -d "$loc/.git" ]; then
            echo "$loc"
            return 0
        fi
    done

    # Try case-insensitive search
    local found=$(find "$APPS_DIR" /var/www -maxdepth 2 -type d -iname "*$name*" 2>/dev/null | head -1)
    if [ -n "$found" ] && [ -d "$found/.git" ]; then
        echo "$found"
        return 0
    fi

    return 1
}

# Determine build method
get_build_method() {
    local dir="$1"

    if [ -f "$dir/docker-compose.yml" ] || [ -f "$dir/docker-compose.yaml" ]; then
        echo "docker-compose"
    elif [ -f "$dir/Dockerfile" ]; then
        echo "dockerfile"
    elif [ -f "$dir/package.json" ]; then
        echo "npm"
    else
        echo "static"
    fi
}

# Update and rebuild app
update_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")
    local container_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | tr '_' '-')

    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${BOLD}UPDATING: $app_name${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    cd "$app_dir"

    # Fix permissions if needed
    if [ ! -w "$app_dir" ]; then
        print_step "Fixing permissions..."
        sudo chown -R $USER:$USER "$app_dir"
    fi

    # Get current branch
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    print_step "Branch: $branch"

    # Stash any local changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Stashing local changes..."
        git stash
    fi

    # Pull latest (use merge strategy)
    print_step "Pulling latest changes..."
    git pull --no-rebase origin "$branch" || {
        print_warning "Merge conflict or divergent branches detected"
        print_step "Attempting to reset to remote..."
        git fetch origin "$branch"
        git reset --hard "origin/$branch"
    }

    # Determine build method
    local build_method=$(get_build_method "$app_dir")
    print_step "Build method: $build_method"

    case "$build_method" in
        "docker-compose")
            print_step "Rebuilding with docker-compose..."
            docker-compose up -d --build
            ;;
        "dockerfile")
            print_step "Rebuilding Docker image..."
            docker build -t "$container_name:latest" .

            # Check if container exists
            if docker ps -a --format '{{.Names}}' | grep -q "^$container_name$"; then
                print_step "Restarting container..."
                local port=$(docker port "$container_name" 80 2>/dev/null | cut -d: -f2 || echo "")

                docker stop "$container_name" 2>/dev/null || true
                docker rm "$container_name" 2>/dev/null || true

                if [ -n "$port" ]; then
                    docker run -d --name "$container_name" -p "$port:80" --restart unless-stopped "$container_name:latest"
                else
                    print_warning "Could not determine port. Container stopped but not restarted."
                    print_warning "Run: docker run -d --name $container_name -p <PORT>:80 --restart unless-stopped $container_name:latest"
                fi
            else
                print_warning "No running container found. Build complete but not deployed."
            fi
            ;;
        "npm")
            print_step "Installing dependencies..."
            npm install

            print_step "Building..."
            npm run build

            # Check if it has a Dockerfile too
            if [ -f "Dockerfile" ]; then
                print_step "Rebuilding Docker container..."
                docker build -t "$container_name:latest" .
                docker stop "$container_name" 2>/dev/null || true
                docker rm "$container_name" 2>/dev/null || true
            fi
            ;;
        "static")
            print_success "Static files updated. No build required."
            ;;
    esac

    # Verify
    if docker ps --format '{{.Names}}' | grep -q "^$container_name$"; then
        print_success "Container '$container_name' is running"
        docker ps --filter name="$container_name" --format "  Status: {{.Status}}\n  Ports: {{.Ports}}"
    fi

    echo ""
    print_success "Update complete for $app_name"
    echo ""
}

# Main
if [ -z "$APP_NAME" ]; then
    print_error "Usage: $0 <app-name-or-path>"
    echo ""
    echo "Available apps with git repos:"
    for dir in "$APPS_DIR"/*/; do
        [ -d "$dir/.git" ] && echo "  - $(basename "$dir")"
    done
    [ -d "/var/www/Green-Empire/.git" ] && echo "  - green-empire"
    exit 1
fi

# Check if argument is already a directory path
if [ -d "$APP_NAME/.git" ]; then
    APP_DIR="$APP_NAME"
else
    # Find the app by name
    APP_DIR=$(find_app_dir "$APP_NAME")
fi

if [ -z "$APP_DIR" ]; then
    print_error "Could not find app: $APP_NAME"
    echo ""
    echo "Available apps:"
    for dir in "$APPS_DIR"/*/; do
        [ -d "$dir/.git" ] && echo "  - $(basename "$dir")"
    done
    exit 1
fi

update_app "$APP_DIR"
