# PKM LocalKarya - Docker Environment Setup

This guide explains how to set up and run the PKM LocalKarya application using Docker.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

## Environment Files

Before running any environment, make sure to configure the appropriate environment file:

### Development Environment (.env.dev)
Already configured for local development with default values.

### Hub Production Environment (.env.hub)
Copy `.env.hub` and update the following values:
- `DB_PASSWORD`: Set a secure database password
- `JWT_SECRET`: Set a secure JWT secret
- `NEXTAUTH_SECRET`: Set a secure NextAuth secret
- `NEXTAUTH_URL`: Set your production domain
- `DOCKER_USERNAME`: Your Docker Hub username
- `IMAGE_TAG`: Your desired image tag

### Production Environment (.env.prod)
Copy `.env.prod` and update the following values:
- `DB_PASSWORD`: Set a secure database password
- `JWT_SECRET`: Set a secure JWT secret
- `NEXTAUTH_SECRET`: Set a secure NextAuth secret
- `NEXTAUTH_URL`: Set your production domain

## Available Scripts

### Development Environment

```bash
# Start development environment
./dev.sh up

# Stop development environment
./dev.sh down

# View logs
./dev.sh logs

# View app logs only
./dev.sh logs-app

# View database logs only
./dev.sh logs-db

# Restart services
./dev.sh restart

# Rebuild and restart
./dev.sh rebuild

# Open shell in app container
./dev.sh shell

# Open PostgreSQL shell
./dev.sh db-shell

# Show service status
./dev.sh status

# Clean up (remove containers, volumes, images)
./dev.sh clean
```

### Hub Production Environment (Docker Hub Images)

```bash
# Start from Docker Hub images
./hub.sh up

# Stop services
./hub.sh down

# View logs
./hub.sh logs

# Pull latest images
./hub.sh pull

# Show status
./hub.sh status

# Clean up
./hub.sh clean
```

### Production Environment (Local Build)

```bash
# Start with local build
./prod.sh up build

# Start with Docker Hub images
./prod.sh up hub

# Stop services
./prod.sh down

# View logs
./prod.sh logs

# Show status
./prod.sh status

# Pull latest images (hub mode only)
./prod.sh pull
```

## Service URLs

### Development Environment
- **Application**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@localkarya.com / admin123)
- **Database**: localhost:5432

### Production Environment
- **Application**: http://localhost:3000 (or your configured domain)
- **Database**: localhost:5432

## Volume Mounts (Development)

The development environment mounts source code for hot reload:
- `src/` → `/app/src`
- `public/` → `/app/public`
- `package.json` → `/app/package.json`
- Configuration files for live updates

## Database Initialization

The development environment includes initialization scripts that will:
1. Create the database schema
2. Set up initial admin user (if configured)

## Troubleshooting

### Line Ending Issues (Windows)
If you encounter issues with shell scripts, fix line endings:
```bash
sed -i 's/\r$//' *.sh
chmod +x *.sh
```

### Permission Issues
Ensure scripts are executable:
```bash
chmod +x dev.sh hub.sh prod.sh
```

### Environment File Issues
Make sure your environment files exist and contain all required variables:
- `.env.dev` (for development)
- `.env.hub` (for hub production)
- `.env.prod` (for production)

## Security Notes

- Always change default passwords in production
- Use strong, unique secrets for JWT and NextAuth
- Enable HTTPS in production with proper SSL certificates
- Regularly update Docker images for security patches

## Backup and Maintenance

### Database Backup
```bash
# Create backup
./prod.sh backup

# Backups are stored in the backup/ directory
```

### Log Management
- Logs are automatically rotated in production
- Development logs are displayed in real-time
- Use `./[script].sh logs` to view service logs