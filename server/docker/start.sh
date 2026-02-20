#!/bin/sh

# Create required directories
mkdir -p /var/log/php-fpm
mkdir -p /var/lib/php/sessions
mkdir -p /var/log/supervisor
mkdir -p /var/run/php-fpm

# Debug: Show all environment variables
echo "=== DEBUG: Environment Variables ==="
echo "DB_CONNECTION: ${DB_CONNECTION:-NOT_SET}"
echo "DB_HOST: ${DB_HOST:-NOT_SET}"
echo "DB_PORT: ${DB_PORT:-NOT_SET}"
echo "DB_DATABASE: ${DB_DATABASE:-NOT_SET}"
echo "DB_USERNAME: ${DB_USERNAME:-NOT_SET}"
echo "DB_PASSWORD: ${DB_PASSWORD:+SET}"
echo "REDIS_HOST: ${REDIS_HOST:-NOT_SET}"
echo "REDIS_PORT: ${REDIS_PORT:-NOT_SET}"
echo "=================================="

# Set up environment variables for Laravel
cat > /var/www/html/.env << EOF
APP_NAME=${APP_NAME:-Laravel}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL}
FRONTEND_URL=${FRONTEND_URL}
DB_CONNECTION=${DB_CONNECTION:-pgsql}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
CACHE_DRIVER=${CACHE_DRIVER:-redis}
SESSION_DRIVER=${SESSION_DRIVER:-redis}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-database}
EOF

# Debug: Show generated .env file
echo "=== DEBUG: Generated .env file ==="
cat /var/www/html/.env
echo "================================="

# Clear all Laravel caches to ensure fresh environment loading
echo "=== Clearing Laravel caches ==="
echo "Before cache clear:"
ls -la bootstrap/cache/ 2>/dev/null || echo "Cache directory does not exist"
rm -rf bootstrap/cache/*
rm -rf storage/framework/cache/*
rm -rf storage/framework/views/*
rm -rf storage/framework/sessions/
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
php artisan config:cache
echo "After cache clear:"
ls -la bootstrap/cache/ 2>/dev/null || echo "Cache directory does not exist"
echo "INFO  Configuration cache cleared successfully."
echo "INFO  Application cache cleared successfully."
echo "INFO  Route cache cleared successfully."
echo "INFO  Compiled views cleared successfully."
echo "INFO  Configuration cached successfully."
echo "=== Laravel caches cleared ==="

# Replace port in nginx config with Render's PORT
sed -i "s/listen 8080;/listen ${PORT:-8080};/g" /etc/nginx/nginx.conf

# Skip migrations - users table already exists and database is working
echo "=== Skipping migrations - users table already exists ==="
echo "=== Database ready for registration ==="

# Test PHP-FPM configuration
php-fpm -t

# Start php-fpm in background with explicit config
php-fpm -y /usr/local/etc/php-fpm.d/www.conf &

# Wait a moment for PHP-FPM to start and create socket
sleep 3

# Test if PHP-FPM is running
if pgrep php-fpm > /dev/null; then
    echo "PHP-FPM is running"
else
    echo "PHP-FPM failed to start"
    exit 1
fi

# Check if socket file exists
if [ -S /var/run/php-fpm.sock ]; then
    echo "PHP-FPM socket exists at /var/run/php-fpm.sock"
else
    echo "PHP-FPM socket not found, listing /var/run/:"
    ls -la /var/run/
    echo "Listing /var/run/php-fpm/:"
    ls -la /var/run/php-fpm/ || echo "Directory /var/run/php-fpm/ does not exist"
fi

# Start nginx in foreground (this will keep the container running)
exec nginx -g "daemon off;"
