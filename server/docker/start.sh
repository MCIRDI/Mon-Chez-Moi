#!/bin/sh

# Replace port in nginx config with Render's PORT
sed -i "s/listen 8080;/listen ${PORT:-8080};/g" /etc/nginx/nginx.conf

# Start nginx and php-fpm
nginx -g "daemon off;" &
php-fpm

# Wait for processes
wait
