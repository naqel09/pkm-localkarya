#!/bin/bash
set -e

echo "Waiting for Next.js application to be ready..."

# Wait for Next.js app to be ready
while ! curl -s http://pkm-localkarya-app-hub:3000/api/health >/dev/null 2>&1; do
    echo "Waiting for Next.js app..."
    sleep 5
done

echo "Next.js app is ready. Creating admin user..."

# Create admin user via API
curl -X POST http://pkm-localkarya-app-hub:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }' || echo "Admin user might already exist"

echo "Admin user creation process completed!"
