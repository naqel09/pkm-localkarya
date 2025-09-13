#!/bin/bash

# PKM-Localkarya Image Fix Script
# This script copies images from subdirectories to the public root where the code expects them

echo "🖼️ Fixing image paths for PKM-Localkarya..."

cd /home/esa_fauzi/Utama-Project/pkm-localkarya/public

echo "📁 Copying images from /images/ subdirectory to public root..."

# Copy commonly referenced images to root of public directory
cp images/mountaincarousel1.jpg . 2>/dev/null || echo "mountaincarousel1.jpg already exists or not found"
cp images/bgImage.jpg . 2>/dev/null || echo "bgImage.jpg already exists or not found"
cp images/cultural.jpg . 2>/dev/null || echo "cultural.jpg already exists or not found"
cp images/river.jpg . 2>/dev/null || echo "river.jpg already exists or not found"
cp images/testimonials.jpg . 2>/dev/null || echo "testimonials.jpg already exists or not found"
cp images/mountain2.jpg . 2>/dev/null || echo "mountain2.jpg already exists or not found"
cp images/mountain3.jpg . 2>/dev/null || echo "mountain3.jpg already exists or not found"

# Copy bedroom image
cp images/bedrooms/bedroom.jpg . 2>/dev/null || echo "bedroom.jpg already exists or not found"

# Copy hotel images that are referenced directly in root
cp images/hotels/hotel1.jpg hotel1.jpg 2>/dev/null || echo "hotel1.jpg already exists or not found"
cp images/hotels/hotel2.jpg hotel2.jpg 2>/dev/null || echo "hotel2.jpg already exists or not found"
cp images/hotels/hotel3.jpg hotel3.jpg 2>/dev/null || echo "hotel3.jpg already exists or not found"
cp images/hotels/hotel4.jpg hotel4.jpg 2>/dev/null || echo "hotel4.jpg already exists or not found"

echo "📋 Current images in public root:"
ls -la *.jpg 2>/dev/null || echo "No .jpg files found in public root"

echo "✅ Image fix completed!"
echo "🔄 Remember to restart your Docker container if needed:"
echo "   cd misc/docker && docker-compose -f docker-compose.dev.yml restart app"