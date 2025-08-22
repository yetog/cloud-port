#!/bin/bash

# Build and Deploy Docker Apps
echo "Building and deploying Docker apps..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Change to project directory
cd /var/www/zaylegend

echo -e "${GREEN}Building Docker containers...${NC}"

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

# Build and start containers
echo -e "${YELLOW}Building and starting new containers...${NC}"
docker-compose up -d --build

# Wait for containers to be ready
echo -e "${YELLOW}Waiting for containers to start...${NC}"
sleep 30

# Health check for each container
apps=("chord-genesis" "spritegen" "dj-visualizer" "fineline" "game-hub")
ports=(3001 3002 3003 3004 3005)

echo -e "${GREEN}Performing health checks...${NC}"

for i in "${!apps[@]}"; do
    app="${apps[$i]}"
    port="${ports[$i]}"
    
    echo -e "${YELLOW}Checking $app on port $port...${NC}"
    
    # Check if container is running
    if docker ps | grep -q "$app"; then
        echo -e "${GREEN}✓ $app container is running${NC}"
        
        # Check if app responds
        if curl -f -s "http://localhost:$port" > /dev/null; then
            echo -e "${GREEN}✓ $app is responding on port $port${NC}"
        else
            echo -e "${RED}✗ $app is not responding on port $port${NC}"
        fi
    else
        echo -e "${RED}✗ $app container is not running${NC}"
    fi
done

# Show container status
echo -e "\n${GREEN}Container Status:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Show logs for any failed containers
echo -e "\n${YELLOW}Checking for any container errors...${NC}"
for app in "${apps[@]}"; do
    if ! docker ps | grep -q "$app"; then
        echo -e "${RED}Logs for failed container $app:${NC}"
        docker logs "$app" --tail 20
    fi
done

echo -e "\n${GREEN}Docker deployment complete!${NC}"
echo -e "${YELLOW}Apps are available at:${NC}"
echo "- Chord Genesis: http://localhost:3001"
echo "- Sprite Gen: http://localhost:3002"
echo "- DJ Visualizer: http://localhost:3003"
echo "- FineLine: http://localhost:3004"
echo "- Game Hub: http://localhost:3005"