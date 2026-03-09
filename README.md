# Mon Chez Moi - API Server

This is the backend API server for Mon Chez Moi, deployed on Hostinger.

## Deployment Structure
- `composer.json` - Root level for Hostinger deployment detection
- `server/composer.lock` - Locked backend dependency versions
- `.htaccess` - Redirects traffic to `server/public/`
- `server/` - Laravel application directory

## API Endpoints
The API is accessible at: `/api/*`

## Environment
- PHP 8.2+
- Laravel 11
- MySQL Database

## Hostinger SSH Deploy
Run this from the project root on the Hostinger server:
```bash
bash deploy-hostinger.sh
```
