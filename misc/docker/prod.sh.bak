#!/bin/bash

# PKM LocalKarya - Production Docker Management Script
# Usage: ./prod.sh [command]

set -e

DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo -e "${BLUE}PKM LocalKarya - Production Environment${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up          Start all services in background"
    echo "  down        Stop all services"
    echo "  logs        Show logs from all services"
    echo "  logs-app    Show logs from app service only"
    echo "  logs-db     Show logs from database service only"
    echo "  logs-nginx  Show logs from nginx service only"
    echo "  restart     Restart all services"
    echo "  rebuild     Rebuild and restart all services"
    echo "  shell       Open shell in app container"
    echo "  db-shell    Open PostgreSQL shell"
    echo "  backup-db   Create database backup"
    echo "  restore-db  Restore database from backup"
    echo "  status      Show status of all services"
    echo "  health      Check health of all services"
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
        echo -e "${RED}Error: $ENV_FILE file not found!${NC}"
        echo -e "${YELLOW}Please copy .env.prod.example to .env.prod and configure it${NC}"
        exit 1
    fi
}

case "$1" in
    up)
        check_requirements
        echo -e "${GREEN}Starting production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE --env-file $ENV_FILE up -d
        echo -e "${GREEN}Production environment started!${NC}"
        echo -e "${YELLOW}App URL: http://localhost${NC}"
        ;;
    down)
        echo -e "${YELLOW}Stopping production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE down
        echo -e "${GREEN}Production environment stopped!${NC}"
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
    logs-nginx)
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f nginx
        ;;
    restart)
        echo -e "${YELLOW}Restarting production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        echo -e "${GREEN}Production environment restarted!${NC}"
        ;;
    rebuild)
        echo -e "${YELLOW}Rebuilding and restarting production environment...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE down
        docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        echo -e "${GREEN}Production environment rebuilt and started!${NC}"
        ;;
    shell)
        echo -e "${BLUE}Opening shell in app container...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec app sh
        ;;
    db-shell)
        echo -e "${BLUE}Opening PostgreSQL shell...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec postgres psql -U postgres -d Localkarya
        ;;
    backup-db)
        echo -e "${BLUE}Creating database backup...${NC}"
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f $DOCKER_COMPOSE_FILE exec postgres pg_dump -U postgres Localkarya > "./backup/$BACKUP_NAME"
        echo -e "${GREEN}Database backup created: $BACKUP_NAME${NC}"
        ;;
    restore-db)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please provide backup file name${NC}"
            echo "Usage: $0 restore-db <backup_file.sql>"
            exit 1
        fi
        echo -e "${BLUE}Restoring database from backup: $2${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres psql -U postgres -d Localkarya < "./backup/$2"
        echo -e "${GREEN}Database restored successfully!${NC}"
        ;;
    status)
        echo -e "${BLUE}Production environment status:${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    health)
        echo -e "${BLUE}Checking health of all services...${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec app curl -f http://localhost:3000/api/health || echo -e "${RED}App health check failed${NC}"
        docker-compose -f $DOCKER_COMPOSE_FILE exec postgres pg_isready -U postgres || echo -e "${RED}Database health check failed${NC}"
        echo -e "${GREEN}Health check completed${NC}"
        ;;
    *)
        print_usage
        exit 1
        ;;
esac