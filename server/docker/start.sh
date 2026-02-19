#!/bin/sh

# Replace port in nginx config with Render's PORT
sed -i "s/listen 8080;/listen ${PORT:-8080};/g" /etc/nginx/nginx.conf

# Create required directories
mkdir -p /var/log/php-fpm
mkdir -p /var/lib/php/sessions

# Start php-fpm in background
php-fpm &

# Start nginx in foreground (this will keep the container running)
exec nginx -g "daemon off;"
