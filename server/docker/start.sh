#!/bin/sh

# Create required directories
mkdir -p /var/log/php-fpm
mkdir -p /var/lib/php/sessions
mkdir -p /var/log/supervisor
mkdir -p /var/run/php-fpm

# Replace port in nginx config with Render's PORT
sed -i "s/listen 8080;/listen ${PORT:-8080};/g" /etc/nginx/nginx.conf

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
