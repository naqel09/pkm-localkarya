#!/bin/bash

# PKM LocalKarya - Build Local (No Push)
# Usage: ./build-local.sh [tag]

set -e

# Configuration
DOCKER_USERNAME="esafauzi"
IMAGE_NAME="pkm-localkarya"
TAG=${1:-local-v15}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 PKM LocalKarya - Build Local${NC}"
echo "=================================="

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${BLUE}📁 Project root: $(pwd)${NC}"
echo -e "${BLUE}🏷️  Building: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"

# Build the image
echo -e "\n${YELLOW}🔨 Building Docker image locally...${NC}"
docker build \
    -f misc/docker/Dockerfile \
    -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} \
    .

echo -e "${GREEN}✅ Local build completed!${NC}"
echo -e "\n${GREEN}🏠 Image ready locally: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"
echo -e "${BLUE}💡 Test locally: Update IMAGE_TAG in .env.hub to '${TAG}' then run misc/docker docker-compose.hub.yml${NC}"
echo -e "${YELLOW}📝 Note: This image is only available locally and not pushed to Docker Hub${NC}"