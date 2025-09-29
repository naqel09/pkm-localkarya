# 🐳 Docker Quick Start - PKM LocalKarya

This guide will help you quickly set up and run the PKM LocalKarya application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Git (for cloning the repository)

## 🚀 Development Setup (Recommended for Development)

### 1. Navigate to Docker directory
```bash
cd misc/docker
```

### 2. Start development environment
```bash
# Make script executable (Linux/macOS/WSL)
chmod +x dev.sh

# If you're having trouble because wsl and windows, use this	
sed -i 's/\r$//' dev.sh && chmod +x dev.sh

# Start all services
./dev.sh up
```

### 3. Access the application
- **Application**: http://localhost:3000
- **Database Admin (pgAdmin)**: http://localhost:5050
  - Email: `admin@localkarya.com`
  - Password: `admin123`
- **Database Direct**: `localhost:5432`
  - User: `postgres`
  - Password: `Zeronime09`
  - Database: `Localkarya`

### 4. Development Commands
```bash
# View logs
./dev.sh logs

# View app logs only
./dev.sh logs-app

# Restart services
./dev.sh restart

# Rebuild containers (after dependency changes)
./dev.sh rebuild

# Open shell in app container
./dev.sh shell

# Open database shell
./dev.sh db-shell

# Stop all services
./dev.sh down
```

## 🏭 Production Setup

### 1. Configure environment
```bash
cd misc/docker
cp .env.prod.example .env.prod
# Edit .env.prod with your production values
```

### 2. Start production environment
```bash
chmod +x prod.sh
./prod.sh up
```

### 3. Production Commands
```bash
# Create database backup
./prod.sh backup-db

# View status
./prod.sh status

# Check health
./prod.sh health

# View logs
./prod.sh logs
```

## 🔧 Manual Docker Commands

If you prefer using Docker Compose directly:

### Development
```bash
cd misc/docker
docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d
```

### Production
```bash
cd misc/docker
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 📊 What's Included

### Development Environment
- ✅ Next.js app with hot reload
- ✅ PostgreSQL database
- ✅ pgAdmin for database management
- ✅ Volume mounts for instant code changes
- ✅ Development-optimized configuration

### Production Environment
- ✅ Optimized Next.js production build
- ✅ PostgreSQL with health checks
- ✅ Nginx reverse proxy
- ✅ Redis for caching
- ✅ SSL/TLS ready configuration
- ✅ Automated backups
- ✅ Health monitoring

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000
# Kill the process or change ports in docker-compose files
```

### Permission Issues (Linux/macOS)
```bash
chmod +x misc/docker/dev.sh misc/docker/prod.sh
```

### Database Connection Issues
```bash
# Check database logs
./dev.sh logs-db

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```

### Reset Everything
```bash
# Stop and remove all containers, volumes, and images
./dev.sh clean
```

## 📁 File Structure
```
misc/docker/
├── docker-compose.dev.yml     # Development configuration
├── docker-compose.prod.yml    # Production configuration
├── Dockerfile                 # Production build
├── Dockerfile.dev            # Development build
├── dev.sh                    # Development management script
├── prod.sh                   # Production management script
├── .env.dev                  # Development environment
├── .env.prod.example         # Production template
└── README.md                 # Detailed documentation
```

## 📚 Next Steps

1. **For Development**: Start with `./dev.sh up` and begin coding
2. **For Production**: Configure `.env.prod` and run `./prod.sh up`
3. **Read Full Documentation**: Check `misc/docker/README.md` for detailed information
4. **Set Up CI/CD**: Use the Dockerfiles for automated deployments

## 🆘 Getting Help

- Check the detailed documentation: `misc/docker/README.md`
- View container logs: `./dev.sh logs` or `./prod.sh logs`
- Open an issue in the project repository
- Check Docker and Docker Compose installation
