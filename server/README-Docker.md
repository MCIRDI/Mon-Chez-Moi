# Docker Setup for Mon Chez Moi Server

This Docker setup provides a complete containerized environment for the Laravel backend with MySQL, Redis, and MailHog for email testing.

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Running the Application

1. **Build and start all services:**
```bash
docker-compose up -d --build
```

2. **Run Laravel migrations:**
```bash
docker-compose exec app php artisan migrate --force
```

3. **Generate application key (if not already set):**
```bash
docker-compose exec app php artisan key:generate --force
```

4. **Create storage link:**
```bash
docker-compose exec app php artisan storage:link
```

5. **Cache configuration:**
```bash
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache
```

### Access Points

- **Laravel Application**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api
- **phpMyAdmin**: http://localhost:8080
  - Username: `laravel`
  - Password: `laravel_password`
- **MailHog (Email Testing)**: http://localhost:8025
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 📁 Project Structure

```
server/
├── Dockerfile                 # Main application container
├── docker-compose.yml         # All services configuration
├── .dockerignore             # Files to exclude from Docker build
├── docker/
│   ├── nginx.conf            # Nginx web server configuration
│   ├── php-fpm.conf          # PHP-FPM configuration
│   ├── supervisord.conf      # Process supervisor configuration
│   └── mysql/
│       └── my.cnf           # MySQL configuration
└── README-Docker.md         # This file
```

## ⚙️ Configuration

### Environment Variables

The application uses these environment variables (configured in docker-compose.yml):

```yaml
environment:
  - APP_ENV=production
  - APP_DEBUG=false
  - APP_URL=http://localhost:8000
  - DB_HOST=mysql
  - DB_DATABASE=mon_chez_moi
  - DB_USERNAME=laravel
  - DB_PASSWORD=laravel_password
  - CACHE_DRIVER=redis
  - REDIS_HOST=redis
  - MAIL_MAILER=smtp
  - MAIL_HOST=mailhog
  - MAIL_PORT=1025
```

### Database Configuration

- **Database**: `mon_chez_moi`
- **Username**: `laravel`
- **Password**: `laravel_password`
- **Root Password**: `root_password`

### Services Overview

| Service | Container Name | Port | Purpose |
|---------|----------------|------|---------|
| Laravel App | `mon-chez-moi-app` | 8000 | Main application |
| MySQL | `mon-chez-moi-mysql` | 3306 | Database |
| Redis | `mon-chez-moi-redis` | 6379 | Caching |
| MailHog | `mon-chez-moi-mail` | 1025/8025 | Email testing |
| phpMyAdmin | `mon-chez-moi-phpmyadmin` | 8080 | Database management |

## 🛠️ Development Commands

### Laravel Artisan Commands

```bash
# Run migrations
docker-compose exec app php artisan migrate

# Create new migration
docker-compose exec app php artisan make:migration create_table

# Run database seeds
docker-compose exec app php artisan db:seed

# Clear caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear

# Queue operations
docker-compose exec app php artisan queue:work
docker-compose exec app php artisan queue:failed

# Storage operations
docker-compose exec app php artisan storage:link
```

### Container Management

```bash
# View logs
docker-compose logs app
docker-compose logs mysql
docker-compose logs -f  # Follow logs

# Access container shell
docker-compose exec app sh
docker-compose exec mysql bash

# Restart services
docker-compose restart app
docker-compose restart mysql

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📦 Production Deployment

### Environment Variables for Production

Update the environment variables in `docker-compose.yml`:

```yaml
environment:
  - APP_ENV=production
  - APP_DEBUG=false
  - APP_URL=https://your-domain.com
  - FRONTEND_URL=https://your-frontend.com
  - DB_HOST=mysql
  - DB_DATABASE=your_production_db
  - DB_USERNAME=your_db_user
  - DB_PASSWORD=your_secure_password
  - MAIL_MAILER=smtp
  - MAIL_HOST=your-smtp-server
  - MAIL_PORT=587
  - MAIL_USERNAME=your-email@domain.com
  - MAIL_PASSWORD=your-app-password
  - MAIL_ENCRYPTION=tls
```

### Security Considerations

1. **Change default passwords** in docker-compose.yml
2. **Use environment file** for sensitive data
3. **Enable HTTPS** with reverse proxy (nginx/traefik)
4. **Limit exposed ports** in production
5. **Regular updates** of Docker images

### Performance Optimization

1. **Enable Redis** for caching and sessions
2. **Configure PHP OPcache** (already enabled)
3. **Use Nginx** as reverse proxy
4. **Enable Gzip compression** (already enabled)
5. **Configure database indexing**

## 🔧 Troubleshooting

### Common Issues

1. **Permission errors:**
   ```bash
   docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
   ```

2. **Migration fails:**
   ```bash
   docker-compose exec app php artisan migrate:fresh --seed
   ```

3. **Cache issues:**
   ```bash
   docker-compose exec app php artisan config:clear
   docker-compose exec app php artisan route:clear
   ```

4. **Database connection:**
   ```bash
   docker-compose restart mysql
   docker-compose logs mysql
   ```

### Logs Location

- **Application logs**: `storage/logs/laravel.log`
- **Nginx logs**: `/var/log/nginx/`
- **PHP-FPM logs**: `/var/log/php-fpm/`
- **MySQL logs**: `/var/log/mysql/`
- **Supervisor logs**: `/var/log/supervisor/`

### Performance Monitoring

```bash
# View container resource usage
docker stats

# View application performance
docker-compose exec app php artisan tinker
# Then run: cache('test', 'value', 60);
```

## 🚀 Build and Deploy

### Building for Production

```bash
# Build production image
docker build -t mon-chez-moi-server:latest .

# Tag and push to registry
docker tag mon-chez-moi-server:latest your-registry/mon-chez-moi-server:latest
docker push your-registry/mon-chez-moi-server:latest
```

### Scaling

```bash
# Scale application
docker-compose up -d --scale app=3

# Use with load balancer for high availability
```

## 📚 Additional Resources

- [Laravel Docker Documentation](https://laravel.com/docs/sail)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimizer-configuration.html)

---

**Note**: This setup is optimized for both development and production. Adjust configurations based on your specific requirements.
