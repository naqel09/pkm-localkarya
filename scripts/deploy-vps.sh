#!/bin/bash

# PKM LocalKarya - VPS Deployment Script
# This script automates the deployment process to your VPS

set -e

# Configuration
VPS_HOST="${1:-your-vps-ip}"
VPS_USER="${2:-root}"
PROJECT_DIR="/opt/pkm-localkarya"
DOCKER_USERNAME="esafauzi"
IMAGE_NAME="pkm-localkarya"
TAG="${3:-production-v6}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 PKM LocalKarya - VPS Deployment${NC}"
echo "===================================="

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [VPS_IP] [VPS_USER] [IMAGE_TAG]"
    echo ""
    echo "Examples:"
    echo "  $0 192.168.1.100 root production-v6"
    echo "  $0 your-domain.com ubuntu latest"
    echo ""
    echo "Prerequisites:"
    echo "  1. VPS with Docker and Docker Compose installed"
    echo "  2. SSH access to VPS configured"
    echo "  3. Image already built and pushed to Docker Hub"
    echo ""
    exit 0
fi

if [ "$VPS_HOST" = "your-vps-ip" ]; then
    echo -e "${RED}❌ Please provide VPS IP address${NC}"
    echo "Usage: $0 [VPS_IP] [VPS_USER] [IMAGE_TAG]"
    exit 1
fi

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "  VPS Host: $VPS_HOST"
echo "  VPS User: $VPS_USER"
echo "  Image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
echo "  Project Dir: $PROJECT_DIR"
echo ""

# Step 1: Check if image exists in Docker Hub (optional - you can skip this)
echo -e "${YELLOW}🔍 Step 1: Verifying image availability...${NC}"
echo "Using existing image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
echo "If you need to build & push, run: ./scripts/build-and-push.sh $TAG"
echo ""

# Step 2: Prepare deployment files
# Step 2: Prepare deployment files
echo -e "${YELLOW}📦 Step 2: Preparing deployment files...${NC}"
TEMP_DIR=$(mktemp -d)
mkdir -p $TEMP_DIR/docker

# Copy necessary files
cp misc/docker/docker-compose.hub.yml $TEMP_DIR/docker/
cp misc/docker/hub.sh $TEMP_DIR/docker/
cp misc/docker/.env.hub $TEMP_DIR/docker/.env.hub.template

# Create deployment script for VPS
cat > $TEMP_DIR/deploy-on-vps.sh << 'EOF'
#!/bin/bash
set -e

PROJECT_DIR="/opt/pkm-localkarya"
DOCKER_DIR="$PROJECT_DIR/docker"

echo "🔧 Setting up project directory..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

echo "📁 Creating directory structure..."
mkdir -p $DOCKER_DIR
mkdir -p $PROJECT_DIR/backups
mkdir -p $PROJECT_DIR/uploads

echo "🔑 Setting up environment file..."
if [ ! -f "$DOCKER_DIR/.env.hub" ]; then
    cp $DOCKER_DIR/.env.hub.template $DOCKER_DIR/.env.hub
    echo "⚠️  IMPORTANT: Please edit $DOCKER_DIR/.env.hub with your actual values!"
    echo "   Required changes:"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
    echo "   - REDIS_PASSWORD (if using Redis)"
fi

echo "🐳 Making scripts executable..."
chmod +x $DOCKER_DIR/hub.sh

echo "🚀 Starting services..."
cd $DOCKER_DIR
./hub.sh pull
./hub.sh up

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit environment file: nano $DOCKER_DIR/.env.hub"
echo "2. Restart services: cd $DOCKER_DIR && ./hub.sh restart"
echo "3. Check logs: cd $DOCKER_DIR && ./hub.sh logs"
echo "4. Access app: http://$(curl -s ifconfig.me):3000"
EOF

chmod +x $TEMP_DIR/deploy-on-vps.sh

# Step 3: Transfer files to VPS
echo -e "${YELLOW}📤 Step 3: Transferring files to VPS...${NC}"
echo "Uploading files to $VPS_USER@$VPS_HOST..."

# Create remote directory
ssh $VPS_USER@$VPS_HOST "mkdir -p /tmp/pkm-deploy"

# Upload files
scp -r $TEMP_DIR/* $VPS_USER@$VPS_HOST:/tmp/pkm-deploy/

# Step 4: Execute deployment on VPS
echo -e "${YELLOW}🔧 Step 4: Executing deployment on VPS...${NC}"
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /tmp/pkm-deploy
chmod +x deploy-on-vps.sh
./deploy-on-vps.sh
ENDSSH

# Cleanup
rm -rf $TEMP_DIR

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Post-deployment steps:${NC}"
echo "1. SSH to your VPS: ssh $VPS_USER@$VPS_HOST"
echo "2. Edit environment: nano /opt/pkm-localkarya/docker/.env.hub"
echo "3. Restart services: cd /opt/pkm-localkarya/docker && ./hub.sh restart"
echo "4. Check status: cd /opt/pkm-localkarya/docker && ./hub.sh status"
echo "5. View logs: cd /opt/pkm-localkarya/docker && ./hub.sh logs"
echo ""
echo -e "${GREEN}🌐 Your app should be available at: http://$VPS_HOST:3000${NC}"