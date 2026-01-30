#!/bin/bash

# Fix App Links - Complete Solution
echo "Fixing app link issues..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Phase 1: Verify Current State ===${NC}"
bash scripts/verify-app-links.sh

echo -e "\n${BLUE}=== Phase 2: Restart Docker Containers ===${NC}"
echo -e "${YELLOW}Restarting Docker containers with correct port mappings...${NC}"

cd /var/www/zaylegend
docker-compose down
sleep 5
docker-compose up -d

echo -e "${YELLOW}Waiting for containers to start...${NC}"
sleep 30

echo -e "\n${BLUE}=== Phase 3: Update Nginx Configuration ===${NC}"
echo -e "${YELLOW}Applying nginx configuration with correct port mappings...${NC}"
bash scripts/update-nginx-docker.sh

echo -e "\n${BLUE}=== Phase 4: Final Verification ===${NC}"
echo -e "${YELLOW}Testing all app links...${NC}"
sleep 10

bash scripts/verify-app-links.sh

echo -e "\n${GREEN}=== Fix Complete! ===${NC}"
echo -e "${YELLOW}App links should now work correctly:${NC}"
echo "• FineLine: https://zaylegend.com/fineline (port 3004)"
echo "• DJ Visualizer: https://zaylegend.com/dj-visualizer (port 3003)"
echo "• Chord Genesis: https://zaylegend.com/chord-genesis (port 3001)" 
echo "• Sprite Gen: https://zaylegend.com/spritegen (port 3002)"
echo "• Game Hub: https://zaylegend.com/game-hub (port 3005)"

echo -e "\n${BLUE}If issues persist:${NC}"
echo "1. Check Docker logs: docker logs [container-name]"
echo "2. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "3. Verify containers are healthy: docker ps"