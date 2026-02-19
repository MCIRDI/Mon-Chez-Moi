# Deployment Guide for Mon Chez Moi

## 🚀 Pre-Deployment Checklist

### 1. Environment Configuration

#### Backend (.env changes)
```env
# Production Environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=your-production-db-host
DB_PORT=3306
DB_DATABASE=mon-chez-moi-production
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password

# Email Configuration (REQUIRED for password reset)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com  # or your email provider
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="Mon Chez Moi"

# Frontend URL for password reset links
FRONTEND_URL=https://your-domain.com

# Security
APP_KEY=base64:your-generated-key-here
```

#### Frontend Environment Variables
Create `.env.production` in client directory:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME="Mon Chez Moi"
```

### 2. Code Changes Required

#### Backend Changes

**1. CORS Configuration**
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'https://your-domain.com',
    'https://www.your-domain.com',
],
```

**2. File Upload Paths**
```php
// Update filesystem configuration for production
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => public_path('storage'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

**3. Security Headers**
```php
// app/Http/Middleware/TrustProxies.php
protected $proxies = '*';
protected $headers = Request::HEADER_X_FORWARDED_ALL;
```

#### Frontend Changes

**1. API Base URL**
```typescript
// client/src/services/api.ts
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

**2. Image URLs**
```typescript
// client/src/Pages/Properties.tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000/storage';
```

### 3. Build & Deployment Steps

#### Backend Deployment

1. **Install Dependencies**
```bash
composer install --no-dev --optimize-autoloader
```

2. **Generate App Key**
```bash
php artisan key:generate --force
```

3. **Run Migrations**
```bash
php artisan migrate --force
```

4. **Cache Configuration**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

5. **Storage Link**
```bash
php artisan storage:link
```

6. **Optimize**
```bash
php artisan optimize
```

#### Frontend Deployment

1. **Install Dependencies**
```bash
npm ci
```

2. **Build for Production**
```bash
npm run build
```

3. **Upload Build Files**
Upload the `dist` folder to your web server

### 4. Server Configuration

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# In public/.htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/mon-chez-moi/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### 5. Security Considerations

#### Laravel Security
```bash
# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Secure .env file
chmod 600 .env
```

#### SSL Certificate
- Install SSL certificate (Let's Encrypt recommended)
- Force HTTPS redirect

#### Database Security
- Use strong database credentials
- Enable database SSL if supported
- Regular backups

### 6. Performance Optimization

#### Backend
- Enable OPcache
- Use Redis for caching
- Configure queue system for emails

#### Frontend
- Enable gzip compression
- Set up CDN for static assets
- Implement browser caching

### 7. Monitoring & Logging

#### Error Tracking
- Set up error monitoring (Sentry, Bugsnag)
- Configure log rotation
- Set up uptime monitoring

#### Analytics
- Google Analytics
- Performance monitoring

### 8. Testing Before Going Live

1. **Functionality Testing**
   - User registration/login
   - Property CRUD operations
   - Password reset functionality
   - Search and filtering

2. **Performance Testing**
   - Load testing
   - Image upload performance

3. **Security Testing**
   - Test authentication
   - Validate file upload security
   - Check for XSS vulnerabilities

### 9. Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrated successfully
- [ ] Storage linked properly
- [ ] SSL certificate active
- [ ] Email functionality tested
- [ ] File uploads working
- [ ] Search functionality working
- [ ] Mobile responsive design
- [ ] Error pages configured
- [ ] Backup system in place

### 10. Common Issues & Solutions

#### Image Upload Issues
```php
// Check php.ini settings
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
```

#### CORS Issues
```php
// Verify CORS configuration
php artisan config:cache
```

#### Email Issues
- Verify SMTP credentials
- Check firewall settings
- Test email queue: `php artisan queue:work`

### 11. Deployment Options

#### Shared Hosting
- Upload files via FTP
- Ensure PHP 8.1+ available
- Check required extensions

#### VPS/Dedicated Server
- Install LEMP/LAMP stack
- Configure firewall
- Set up automated backups

#### Cloud Platforms
- **DigitalOcean App Platform**
- **AWS EC2 + S3**
- **Vultr**
- **Heroku**

#### PaaS Options
- **Laravel Forge**
- **Vapor**
- **Ploi**

### 12. Maintenance

#### Regular Tasks
- Update dependencies
- Clear caches periodically
- Monitor disk space
- Update SSL certificates
- Security patches

#### Backup Strategy
- Daily database backups
- File system backups
- Off-site backup storage

---

## 🎯 Quick Start for Deployment

1. **Update environment variables**
2. **Build frontend: `npm run build`**
3. **Deploy backend files**
4. **Run `composer install --no-dev`**
5. **Run `php artisan migrate --force`**
6. **Set up SSL certificate**
7. **Test all functionality**

Your Mon Chez Moi application will be ready for production!
