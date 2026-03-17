#!/bin/bash

# Update Nginx configuration for Docker apps
echo "Updating Nginx configuration for Docker apps..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Backup existing nginx config
cp /etc/nginx/sites-available/zaylegend.com /etc/nginx/sites-available/zaylegend.com.backup

# Create new nginx configuration with Docker app routes
cat > /etc/nginx/sites-available/zaylegend.com << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name zaylegend.com www.zaylegend.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name zaylegend.com www.zaylegend.com;

    # SSL configuration (existing certificates)
    ssl_certificate /etc/letsencrypt/live/zaylegend.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zaylegend.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Main portfolio site
    location / {
        root /var/www/zaylegend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Docker app routes
    location /chord-genesis {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /spritegen {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /dj-visualizer {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /fineline {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /game-hub {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Existing app routes (keep these)
    location /questful-living-adventure {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /questful-living-adventure/index.html;
    }

    location /media-magic-streamer {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /media-magic-streamer/index.html;
    }

    location /script-scribe-ai-editor {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /script-scribe-ai-editor/index.html;
    }

    location /playful-space-arcade {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /playful-space-arcade/index.html;
    }

    location /pdf-saga-summarize {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /pdf-saga-summarize/index.html;
    }

    location /serene-chord-scapes {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /serene-chord-scapes/index.html;
    }

    location /zen-reset {
        root /var/www/zaylegend/public;
        index index.html;
        try_files $uri $uri/ /zen-reset/index.html;
    }

    location /knowledge-base {
        root /var/www/zaylegend/apps;
        index index.html;
        try_files $uri $uri/ /knowledge-base/index.html;
    }
}
EOF

echo -e "${GREEN}Nginx configuration updated!${NC}"

# Test nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
    
    # Reload nginx
    echo -e "${YELLOW}Reloading Nginx...${NC}"
    systemctl reload nginx
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx reloaded successfully${NC}"
    else
        echo -e "${RED}✗ Nginx failed to reload${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Nginx configuration test failed${NC}"
    echo "Restoring backup configuration..."
    cp /etc/nginx/sites-available/zaylegend.com.backup /etc/nginx/sites-available/zaylegend.com
    exit 1
fi

echo -e "\n${GREEN}Nginx update complete!${NC}"
echo -e "${YELLOW}Docker apps will be available at:${NC}"
echo "- https://zaylegend.com/chord-genesis"
echo "- https://zaylegend.com/spritegen"
echo "- https://zaylegend.com/dj-visualizer"
echo "- https://zaylegend.com/fineline"
echo "- https://zaylegend.com/game-hub"