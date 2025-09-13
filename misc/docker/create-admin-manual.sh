#!/bin/bash

echo "🔧 Creating admin user..."

# Wait for app to be ready
echo "Waiting for application to be ready..."
while ! curl -s http://localhost:3000/api/health >/dev/null 2>&1; do
    echo "Waiting for app..."
    sleep 2
done

echo "Application is ready. Creating admin user..."

# Create admin user
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }')

echo "Response: $RESPONSE"

# Test login
echo "Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login-production \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

echo "✅ Admin user creation process completed!"
