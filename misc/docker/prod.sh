#!/bin/bash

# PKM LocalKarya - Production Management
# Usage: ./prod.sh [command] [mode]

set -e

MODE=${2:-hub}
ENV_FILE=".env.prod"

case $MODE in
    "hub")
        COMPOSE_FILE="docker-compose.hub.yml"
        echo "🐳 Using DOCKER HUB mode"
        ;;
    "build")
        COMPOSE_FILE="docker-compose.prod.yml"
        echo "🏭 Using LOCAL BUILD mode"
        ;;
    *)
        echo "❌ Mode: hub|build"
        exit 1
        ;;
esac

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_help() {
    echo -e "${BLUE}PKM LocalKarya - Production${NC}"
    echo ""
    echo "Usage: $0 [command] [mode]"
    echo ""
    echo "Commands:"
    echo "  up [hub|build]     Start services"
    echo "  down [hub|build]   Stop services"
    echo "  logs [hub|build]   Show logs"
    echo "  status [hub|build] Show status"
    echo "  pull [hub]         Pull latest images"
    echo ""
}

case $1 in
    "up")
        echo -e "${GREEN}Starting services ($MODE)...${NC}"
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
        echo -e "${GREEN}✅ Services started${NC}"
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE ps
        ;;
    "down")
        echo -e "${YELLOW}Stopping services ($MODE)...${NC}"
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE down
        ;;
    "logs")
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE logs -f
        ;;
    "status")
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE ps
        ;;
    "pull")
        if [ "$MODE" = "hub" ]; then
            docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE pull
        else
            echo "Pull only for hub mode"
        fi
        ;;
    *)
        print_help
        ;;
esac
