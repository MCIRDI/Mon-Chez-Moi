#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/server"

echo "Installing backend dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Running Laravel post-deploy tasks..."
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true
php artisan optimize

echo "Hostinger backend deployment complete."
