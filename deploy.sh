#!/bin/bash

# Mon Chez Moi Deployment Script
echo "🚀 Starting Mon Chez Moi Deployment..."

# Backend Deployment
echo "📦 Setting up backend..."
cd server

# Install production dependencies
composer install --no-dev --optimize-autoloader

# Generate app key if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Cache configuration for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
php artisan storage:link

# Optimize application
php artisan optimize

# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

echo "✅ Backend setup complete!"

# Frontend Deployment
echo "🎨 Building frontend..."
cd ../client

# Install dependencies
npm ci

# Build for production
npm run build:prod

echo "✅ Frontend build complete!"

echo "🎉 Deployment ready!"
echo ""
echo "Next steps:"
echo "1. Upload server/ directory to your server"
echo "2. Upload client/dist/ directory to your web root"
echo "3. Update .env file with production values"
echo "4. Configure your web server (Apache/Nginx)"
echo "5. Set up SSL certificate"
echo "6. Test all functionality"
