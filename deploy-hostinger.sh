#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/server"

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate --force --no-interaction
  echo "Created server/.env from .env.example."
  echo "Set DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD in server/.env, then rerun."
  exit 1
fi

DB_HOST_VALUE="$(grep -E '^DB_HOST=' .env | tail -n1 | cut -d'=' -f2- || true)"
DB_DATABASE_VALUE="$(grep -E '^DB_DATABASE=' .env | tail -n1 | cut -d'=' -f2- || true)"
DB_USERNAME_VALUE="$(grep -E '^DB_USERNAME=' .env | tail -n1 | cut -d'=' -f2- || true)"
DB_PASSWORD_VALUE="$(grep -E '^DB_PASSWORD=' .env | tail -n1 | cut -d'=' -f2- || true)"

if [ -z "${DB_HOST_VALUE}" ] || [ -z "${DB_DATABASE_VALUE}" ] || [ -z "${DB_USERNAME_VALUE}" ]; then
  echo "Missing DB settings in server/.env."
  echo "Set DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, then rerun."
  exit 1
fi

if [ "${DB_USERNAME_VALUE}" = "root" ] || [ -z "${DB_PASSWORD_VALUE}" ] || [ "${DB_DATABASE_VALUE}" = "rent-and-rest" ]; then
  echo "Default local DB values detected in server/.env."
  echo "Use your Hostinger MySQL credentials and rerun."
  exit 1
fi

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
