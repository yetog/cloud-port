#!/bin/bash

# Verify App Links and Port Mappings
echo "Verifying app links and port mappings..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Docker Container Status ===${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(fineline|dj-visualizer|chord-genesis|spritegen|game-hub)"

echo -e "\n${BLUE}=== Expected Port Mappings ===${NC}"
echo "fineline: should be on port 3004"
echo "dj-visualizer: should be on port 3003"
echo "chord-genesis: should be on port 3001"
echo "spritegen: should be on port 3002"
echo "game-hub: should be on port 3005"

echo -e "\n${BLUE}=== Testing Local Ports ===${NC}"
ports=(3001 3002 3003 3004 3005)
apps=("chord-genesis" "spritegen" "dj-visualizer" "fineline" "game-hub")

for i in "${!ports[@]}"; do
    port="${ports[$i]}"
    app="${apps[$i]}"
    echo -e "${YELLOW}Testing port $port ($app)...${NC}"
    
    if curl -f -s "http://localhost:$port" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Port $port is responding ($app)${NC}"
    else
        echo -e "${RED}✗ Port $port is not responding ($app)${NC}"
    fi
done

echo -e "\n${BLUE}=== Testing Public URLs ===${NC}"
public_urls=(
    "https://zaylegend.com/chord-genesis"
    "https://zaylegend.com/spritegen" 
    "https://zaylegend.com/dj-visualizer"
    "https://zaylegend.com/fineline"
    "https://zaylegend.com/game-hub"
)

for url in "${public_urls[@]}"; do
    echo -e "${YELLOW}Testing $url...${NC}"
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $url is accessible${NC}"
    else
        echo -e "${RED}✗ $url is not accessible${NC}"
    fi
done

echo -e "\n${BLUE}=== Nginx Configuration Check ===${NC}"
echo "Checking if nginx config has correct port mappings..."

if grep -q "location /fineline" /etc/nginx/sites-available/zaylegend.com; then
    fineline_port=$(grep -A1 "location /fineline" /etc/nginx/sites-available/zaylegend.com | grep proxy_pass | sed 's/.*localhost:\([0-9]*\).*/\1/')
    echo "FineLine nginx mapping: port $fineline_port"
    
    if [ "$fineline_port" = "3004" ]; then
        echo -e "${GREEN}✓ FineLine nginx mapping is correct${NC}"
    else
        echo -e "${RED}✗ FineLine nginx mapping is wrong (should be 3004)${NC}"
    fi
fi

if grep -q "location /dj-visualizer" /etc/nginx/sites-available/zaylegend.com; then
    dj_port=$(grep -A1 "location /dj-visualizer" /etc/nginx/sites-available/zaylegend.com | grep proxy_pass | sed 's/.*localhost:\([0-9]*\).*/\1/')
    echo "DJ Visualizer nginx mapping: port $dj_port"
    
    if [ "$dj_port" = "3003" ]; then
        echo -e "${GREEN}✓ DJ Visualizer nginx mapping is correct${NC}"
    else
        echo -e "${RED}✗ DJ Visualizer nginx mapping is wrong (should be 3003)${NC}"
    fi
fi

echo -e "\n${BLUE}=== Summary ===${NC}"
echo "If any apps are not responding:"
echo "1. Check if Docker containers are running: docker ps"
echo "2. Restart containers if needed: docker-compose up -d"
echo "3. Apply nginx config: sudo bash scripts/update-nginx-docker.sh"
echo "4. Check nginx status: sudo systemctl status nginx"