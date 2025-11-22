#!/bin/bash

# Auto-deployment script for portfolio
# Run this on your server to deploy latest changes

echo "🚀 Starting portfolio deployment..."

# Navigate to portfolio directory
cd /var/www/zaylegend/portfolio

# Backup current version
echo "📦 Creating backup..."
sudo cp -r dist dist-backup-$(date +%Y%m%d-%H%M%S)

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📋 Installing dependencies..."
npm ci

# Build portfolio
echo "🔨 Building portfolio..."
npm run build

# Set proper ownership
echo "🔐 Setting file permissions..."
sudo chown -R www-data:www-data dist/

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

# Health check
echo "🏥 Running health check..."
if curl -f http://localhost:8080 >/dev/null 2>&1; then
    echo "✅ Deployment successful! Portfolio is running at https://zaylegend.com"
else
    echo "❌ Warning: Portfolio may not be responding properly"
fi

echo "🎉 Deployment complete!"