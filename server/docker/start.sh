#!/bin/sh

# Create required directories
mkdir -p /var/log/php-fpm
mkdir -p /var/lib/php/sessions
mkdir -p /var/log/supervisor

# Replace port in nginx config with Render's PORT
sed -i "s/listen 8080;/listen ${PORT:-8080};/g" /etc/nginx/nginx.conf

# Test PHP-FPM configuration
php-fpm -t

# Start php-fpm in background with explicit config
php-fpm -y /usr/local/etc/php-fpm.conf &

# Wait a moment for PHP-FPM to start
sleep 2

# Test if PHP-FPM is running
if pgrep php-fpm > /dev/null; then
    echo "PHP-FPM is running"
else
    echo "PHP-FPM failed to start"
    exit 1
fi

# Start nginx in foreground (this will keep the container running)
exec nginx -g "daemon off;"
