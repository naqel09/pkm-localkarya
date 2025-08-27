#!/bin/bash

# PKM-Localkarya Docker Rebuild Script
# This script rebuilds the Docker containers after configuration changes

echo "🔄 Stopping existing containers..."
cd misc/docker
docker-compose -f docker-compose.dev.yml down

echo "🗑️ Removing old volumes (optional - keeps data but clears cache)..."
read -p "Do you want to remove the .next cache volume? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume rm pkm-localkarya_next_dev_cache 2>/dev/null || echo "Volume doesn't exist yet"
fi

echo "🏗️ Rebuilding containers..."
docker-compose -f docker-compose.dev.yml build --no-cache app

echo "🚀 Starting containers..."
docker-compose -f docker-compose.dev.yml up -d

echo "📊 Checking container status..."
docker-compose -f docker-compose.dev.yml ps

echo "📋 To view logs:"
echo "docker-compose -f misc/docker/docker-compose.dev.yml logs -f app"

echo "✅ Done! Your application should be running at http://localhost:3000"