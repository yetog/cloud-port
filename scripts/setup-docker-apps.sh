#!/bin/bash

# Setup Docker Apps - Clone repositories and prepare for containerization
echo "Setting up Docker apps for portfolio..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Define app repositories
declare -A apps=(
    ["chord-genesis"]="https://github.com/yetog/chord-genesis.git"
    ["spritegen"]="https://github.com/yetog/spritegen.git"
    ["dj-visualizer"]="https://github.com/yetog/apr.git"
    ["fineline"]="https://github.com/yetog/fineline.git"
    ["game-hub"]="https://github.com/yetog/playful-space-arcade.git"
)

# Create apps directory
APPS_DIR="/var/www/zaylegend/docker-apps"
mkdir -p "$APPS_DIR"
cd "$APPS_DIR"

echo -e "${GREEN}Cloning repositories...${NC}"

# Clone each repository
for app in "${!apps[@]}"; do
    echo -e "${YELLOW}Setting up $app...${NC}"
    
    if [ -d "$app" ]; then
        echo "Directory $app exists, pulling latest changes..."
        cd "$app"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "Could not pull, continuing..."
        cd ..
    else
        echo "Cloning $app..."
        git clone "${apps[$app]}" "$app"
    fi
    
    # Create Dockerfile for each app
    cat > "$app/Dockerfile" << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
EOF

    echo -e "${GREEN}Created Dockerfile for $app${NC}"
done

echo -e "${GREEN}All repositories cloned and Dockerfiles created!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run docker-compose up to build and start containers"
echo "2. Update Nginx configuration for reverse proxy"
echo "3. Update DNS/subdomain settings"