#!/bin/bash

# PKM LocalKarya - Hub Production Docker Management Script
# Usage: ./hub.sh [command]

set -e

DOCKER_COMPOSE_FILE="docker-compose.hub.yml"
ENV_FILE=".env.hub"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo -e "${BLUE}PKM LocalKarya - Hub Production Environment${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up          Start all services in background"
    echo "  down        Stop all services"
    echo "  logs        Show logs from all services"
    echo "  logs-app    Show logs from app service only"
    echo "  logs-db     Show logs from database service only"
    echo "  restart     Restart all services"
    echo "  pull        Pull latest images"
    echo "  status      Show status of all services"
    echo "  clean       Remove all containers and volumes"
    echo ""
}

check_requirements() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed${NC}"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed${NC}"
        exit 1
    fi

    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}Error: Environment file $ENV_FILE not found${NC}"
        echo -e "${YELLOW}Please create $ENV_FILE with required environment variables${NC}"
        exit 1
    fi
}

check_requirements

case "$1" in
    up)
        echo -e "${GREEN}Starting hub production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE up -d
        echo -e "${GREEN}Hub production environment started!${NC}"
        ;;
    down)
        echo -e "${YELLOW}Stopping hub production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE down
        echo -e "${GREEN}Hub production environment stopped!${NC}"
        ;;
    logs)
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
        ;;
    logs-app)
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f app
        ;;
    logs-db)
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f postgres
        ;;
    restart)
        echo -e "${YELLOW}Restarting hub production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        echo -e "${GREEN}Hub production environment restarted!${NC}"
        ;;
    pull)
        echo -e "${BLUE}Pulling latest images...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE pull
        echo -e "${GREEN}Images updated!${NC}"
        ;;
    status)
        echo -e "${BLUE}Hub production environment status:${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    clean)
        echo -e "${RED}Warning: This will remove all containers and volumes!${NC}"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f $DOCKER_COMPOSE_FILE down -v
            echo -e "${GREEN}Hub production environment cleaned!${NC}"
        else
            echo -e "${YELLOW}Operation cancelled.${NC}"
        fi
        ;;
    *)
        print_usage
        exit 1
        ;;
esac