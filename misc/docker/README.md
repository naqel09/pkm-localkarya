# PKM LocalKarya - Docker Setup

This directory contains Docker configurations for both development and production environments of the PKM LocalKarya application.

## 📁 Directory Structure

```
misc/docker/
├── docker-compose.dev.yml    # Development environment
├── docker-compose.prod.yml   # Production environment
├── Dockerfile                # Production Dockerfile
├── Dockerfile.dev           # Development Dockerfile
├── .env.dev                 # Development environment variables
├── .env.prod.example        # Production environment template
├── dev.sh                   # Development management script
├── prod.sh                  # Production management script
├── init-scripts/            # Database initialization scripts
│   └── 01-init-db.sh
├── nginx/                   # Nginx configuration
│   └── nginx.conf
└── README.md               # This file
```

## 🚀 Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   cd misc/docker
   chmod +x dev.sh
   ./dev.sh up
   ```

2. **Access the application:**
   - Application: http://localhost:3000
   - pgAdmin: http://localhost:5050 (admin@localkarya.com / admin123)
   - Database: localhost:5432

3. **View logs:**
   ```bash
   ./dev.sh logs
   ```

4. **Stop the environment:**
   ```bash
   ./dev.sh down
   ```

### Production Environment

1. **Configure environment variables:**
   ```bash
   cp .env.prod.example .env.prod
   # Edit .env.prod with your production values
   ```

2. **Start the production environment:**
   ```bash
   chmod +x prod.sh
   ./prod.sh up
   ```

3. **Access the application:**
   - Application: http://localhost (or your domain)

## 🛠 Development Features

### Hot Reload Support
The development setup includes:
- Volume mounting for source code hot reload
- Next.js development server with Turbopack
- File watching enabled for instant updates
- Node modules excluded from volume mounting for performance

### Development Services
- **app**: Next.js application with hot reload
- **postgres**: PostgreSQL database with persistent storage
- **pgadmin**: Database administration interface

### Volume Mounts
The following directories are mounted for hot reload:
- `src/` - Source code
- `public/` - Public assets
- Configuration files (package.json, tsconfig.json, etc.)

## 🏭 Production Features

### Optimizations
- Multi-stage Docker build for minimal image size
- Nginx reverse proxy with caching and security headers
- Health checks for all services
- Rate limiting and security headers
- Redis for caching (optional)

### Production Services
- **app**: Next.js application (production build)
- **postgres**: PostgreSQL database with health checks
- **redis**: Redis for caching and sessions
- **nginx**: Reverse proxy with SSL support

## 📋 Management Commands

### Development Commands (`./dev.sh`)
- `up` - Start all services
- `down` - Stop all services
- `logs` - Show all logs
- `logs-app` - Show app logs only
- `logs-db` - Show database logs only
- `restart` - Restart all services
- `rebuild` - Rebuild and restart
- `shell` - Open app container shell
- `db-shell` - Open PostgreSQL shell
- `clean` - Remove all containers and volumes
- `status` - Show service status

### Production Commands (`./prod.sh`)
- `up` - Start all services
- `down` - Stop all services
- `logs` - Show all logs
- `restart` - Restart all services
- `rebuild` - Rebuild and restart
- `backup-db` - Create database backup
- `restore-db <file>` - Restore from backup
- `health` - Check service health
- `status` - Show service status

## 🔧 Configuration

### Environment Variables

#### Development (.env.dev)
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Zeronime09
DB_NAME=Localkarya
NODE_ENV=development
```

#### Production (.env.prod)
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=Localkarya
NODE_ENV=production
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://yourdomain.com
```

### Database Configuration
The application uses PostgreSQL with the following default settings:
- Database: `Localkarya`
- User: `postgres`
- Port: `5432`
- Synchronize: `true` (development only)

## 🔒 Security Considerations

### Development
- Uses default passwords (should not be used in production)
- Database port exposed for local development
- Debug logging enabled

### Production
- Strong passwords required
- SSL/TLS configuration available
- Rate limiting enabled
- Security headers configured
- Health checks implemented

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Stop conflicting services or change ports in docker-compose files
   ```

2. **Database connection issues:**
   ```bash
   # Check database logs
   ./dev.sh logs-db
   # Restart database service
   docker-compose -f docker-compose.dev.yml restart postgres
   ```

3. **Permission issues:**
   ```bash
   # Make scripts executable
   chmod +x dev.sh prod.sh
   ```

4. **Volume mount issues (Windows):**
   - Ensure Docker Desktop has access to the project directory
   - Use WSL2 backend for better performance

### Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# Remove all stopped containers
docker container prune

# Remove all unused volumes
docker volume prune

# View logs for specific container
docker logs pkm-localkarya-app-dev

# Execute command in container
docker exec -it pkm-localkarya-app-dev sh
```

## 📊 Monitoring

### Health Checks
Production environment includes health checks for:
- Application server (HTTP endpoint)
- PostgreSQL database (pg_isready)
- Redis (ping command)

### Logs
Access logs using management scripts:
```bash
# Development
./dev.sh logs

# Production
./prod.sh logs
```

## 🚢 Deployment

### Local Development
1. Clone repository
2. Run `./dev.sh up`
3. Access http://localhost:3000

### Production Deployment
1. Configure `.env.prod`
2. Set up SSL certificates (if using HTTPS)
3. Run `./prod.sh up`
4. Configure domain and firewall rules

### CI/CD Integration
The Docker setup is ready for CI/CD pipelines:
- Use production Dockerfile for building
- Environment variables via secrets
- Health checks for deployment verification

## 🔄 Updates

### Updating Dependencies
```bash
# Rebuild containers after package.json changes
./dev.sh rebuild
```

### Database Migrations
TypeORM handles migrations automatically when `synchronize: true` is set.

For production:
1. Set `synchronize: false`
2. Use TypeORM migration commands
3. Run migrations in production

## 📝 Notes

- Development environment uses volume mounts for hot reload
- Production environment uses optimized multi-stage builds
- Database data persists in Docker volumes
- Nginx configuration includes security best practices
- Scripts are compatible with Linux, macOS, and Windows (WSL)

## 🆘 Support

For issues related to:
- Docker setup: Check this README and troubleshooting section
- Application code: Refer to main project documentation
- Database: Check PostgreSQL logs and connection settings