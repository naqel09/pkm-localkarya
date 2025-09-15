#!/bin/bash

# PKM LocalKarya - Build & Push to Docker Hub
# Usage: ./build-and-push.sh [tag]

set -e

# Configuration
DOCKER_USERNAME="esafauzi"
IMAGE_NAME="pkm-localkarya"
TAG=${1:-production-v6}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 PKM LocalKarya - Build & Push${NC}"
echo "=================================="

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${BLUE}📁 Project root: $(pwd)${NC}"
echo -e "${BLUE}🏷️  Building: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"

# Build the image
echo -e "\n${YELLOW}🔨 Building Docker image...${NC}"
docker build \
    -f misc/docker/Dockerfile \
    -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} \
    .

echo -e "${GREEN}✅ Build completed!${NC}"

# Check if logged in to Docker Hub
echo -e "\n${YELLOW}📤 Pushing to Docker Hub...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}⚠️  Login to Docker Hub first${NC}"
    docker login
fi

# Push to Docker Hub
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}

echo -e "${GREEN}✅ Push completed!${NC}"
echo -e "\n${GREEN}🚀 Image ready: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"
echo -e "${BLUE}💡 Deploy: cd misc/docker && ./prod.sh up hub${NC}"
