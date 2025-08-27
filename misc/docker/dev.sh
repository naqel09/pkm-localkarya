#!/bin/bash

# PKM LocalKarya - Development Docker Management Script
# Usage: ./dev.sh [command]

set -e

DOCKER_COMPOSE_FILE="docker-compose.dev.yml"
ENV_FILE=".env.dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo -e "${BLUE}PKM LocalKarya - Development Environment${NC}"
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
    echo "  rebuild     Rebuild and restart all services"
    echo "  shell       Open shell in app container"
    echo "  db-shell    Open PostgreSQL shell"
    echo "  clean       Remove all containers, volumes, and images"
    echo "  status      Show status of all services"
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
}

case "$1" in
    up)
        echo -e "${GREEN}Starting development environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE up -d
        echo -e "${GREEN}Development environment started!${NC}"
        echo -e "${YELLOW}App URL: http://localhost:3000${NC}"
        echo -e "${YELLOW}pgAdmin URL: http://localhost:5050${NC}"
        echo -e "${YELLOW}Database: localhost:5432${NC}"
        ;;
    down)
        echo -e "${YELLOW}Stopping development environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE down
        echo -e "${GREEN}Development environment stopped!${NC}"
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
        echo -e "${YELLOW}Restarting development environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        echo -e "${GREEN}Development environment restarted!${NC}"
        ;;
    rebuild)
        echo -e "${YELLOW}Rebuilding and restarting development environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE down
        docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        echo -e "${GREEN}Development environment rebuilt and started!${NC}"
        ;;
    shell)
        echo -e "${BLUE}Opening shell in app container...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec app sh
        ;;
    db-shell)
        echo -e "${BLUE}Opening PostgreSQL shell...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec postgres psql -U postgres -d Localkarya
        ;;
    clean)
        echo -e "${RED}Warning: This will remove all containers, volumes, and images!${NC}"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f $DOCKER_COMPOSE_FILE down -v --rmi all
            echo -e "${GREEN}Development environment cleaned!${NC}"
        else
            echo -e "${YELLOW}Operation cancelled.${NC}"
        fi
        ;;
    status)
        echo -e "${BLUE}Development environment status:${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    *)
        print_usage
        exit 1
        ;;
esac