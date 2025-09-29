# PKM LocalKarya - VPS Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. **VPS with Docker & Docker Compose installed**
2. **SSH access configured** (key-based authentication recommended)
3. **Domain name** (optional but recommended)

### 1. Prepare Your Local Environment
```bash
# Make deployment script executable
chmod +x scripts/deploy-vps.sh

# Build and deploy in one command
./scripts/deploy-vps.sh YOUR_VPS_IP root production-v6
```

### 2. Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# 1. Build and push image
./scripts/build-and-push.sh production-v6

# 2. SSH to your VPS
ssh root@YOUR_VPS_IP

# 3. Create project directory
mkdir -p /opt/pkm-localkarya/docker
cd /opt/pkm-localkarya

# 4. Download deployment files
wget https://raw.githubusercontent.com/your-repo/docker-compose.hub.yml
wget https://raw.githubusercontent.com/your-repo/hub.sh
chmod +x hub.sh

# 5. Create environment file
nano docker/.env.hub
```

### 3. Environment Configuration

Edit `/opt/pkm-localkarya/docker/.env.hub` with your values:

```env
# Required - Update these values
DB_PASSWORD=your_secure_password_123!
JWT_SECRET=your_jwt_secret_minimum_32_chars_long_secure_key
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_chars_long
NEXTAUTH_URL=https://yourdomain.com  # or http://YOUR_VPS_IP:3000

# Optional - Update if needed
DOCKER_USERNAME=esafauzi
IMAGE_TAG=production-v6
DB_NAME=localkarya_prod
```

### 4. Deploy Services

```bash
cd /opt/pkm-localkarya/docker

# Pull latest images
./hub.sh pull

# Start all services
./hub.sh up

# Check status
./hub.sh status

# View logs
./hub.sh logs
```

## 🛠️ Management Commands

### Service Management
```bash
cd /opt/pkm-localkarya/docker

# Start services
./hub.sh up

# Stop services
./hub.sh down

# Restart services
./hub.sh restart

# Check status
./hub.sh status
```

### Monitoring
```bash
# View all logs
./hub.sh logs

# View app logs only
./hub.sh logs-app

# View database logs only
./hub.sh logs-db

# Real-time monitoring
docker stats
```

### Updates
```bash
# Pull latest image
./hub.sh pull

# Restart with new image
./hub.sh restart
```

## 🔧 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Check what's using port 3000
   sudo netstat -tlnp | grep :3000
   
   # Kill process if needed
   sudo kill -9 PROCESS_ID
   ```

2. **Database connection issues**
   ```bash
   # Check PostgreSQL container
   docker logs pkm-localkarya-db-hub
   
   # Connect to database
   docker exec -it pkm-localkarya-db-hub psql -U postgres -d localkarya_prod
   ```

3. **Image pull issues**
   ```bash
   # Login to Docker Hub
   docker login
   
   # Manually pull image
   docker pull esafauzi/pkm-localkarya:production-v6
   ```

4. **Permission issues**
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER /opt/pkm-localkarya
   
   # Fix Docker socket permissions
   sudo usermod -aG docker $USER
   ```

### Health Checks
```bash
# Check if app is responding
curl http://localhost:3000/api/health

# Check database connectivity
docker exec pkm-localkarya-app-hub node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'postgres',
  port: 5432,
  database: 'localkarya_prod',
  user: 'postgres',
  password: process.env.DB_PASSWORD
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB Connected:', res.rows[0]);
  pool.end();
});
"
```

## 🔐 Security Recommendations

1. **Use strong passwords** for database and Redis
2. **Configure firewall** to only allow necessary ports
3. **Use SSL/TLS** with proper certificates
4. **Regular backups** of database and uploads
5. **Keep Docker images updated**

## 📋 Nginx Configuration (Optional)

If you want to use Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📞 Support

If you encounter issues:
1. Check logs: `./hub.sh logs`
2. Verify environment variables
3. Ensure all required ports are open
4. Check Docker and Docker Compose versions