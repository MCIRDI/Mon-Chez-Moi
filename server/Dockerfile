# Use the official PHP 8.2 FPM image as base
# Build: Force cache invalidation - enable migrations - 2025-02-21-01:44
FROM php:8.2-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    wget \
    git \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    icu-dev \
    icu-data-full \
    postgresql-dev \
    mysql-client \
    g++ \
    make \
    autoconf \
    linux-headers

# Install PHP extensions in separate steps for better error handling
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd

# Install extensions one by one to isolate issues
RUN docker-php-ext-install -j$(nproc) zip
RUN docker-php-ext-install -j$(nproc) pdo_mysql
RUN docker-php-ext-install -j$(nproc) pdo_pgsql
RUN docker-php-ext-install -j$(nproc) bcmath
RUN docker-php-ext-install -j$(nproc) ctype
RUN docker-php-ext-install -j$(nproc) opcache
RUN docker-php-ext-install -j$(nproc) filter
RUN docker-php-ext-install -j$(nproc) mbstring
RUN docker-php-ext-install -j$(nproc) session
RUN docker-php-ext-install -j$(nproc) simplexml
RUN docker-php-ext-install -j$(nproc) xmlwriter
RUN docker-php-ext-install -j$(nproc) xml

# Install intl extension separately (requires ICU)
# REMOVED: intl extension to reduce build time and avoid timeout
# RUN docker-php-ext-configure intl \
#     && docker-php-ext-install -j$(nproc) intl

# iconv is already built-in to PHP on Alpine

# Install and configure Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set PHP configuration
RUN echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/docker-php-memory-limit.ini \
    && echo "upload_max_filesize=10M" >> /usr/local/etc/php/conf.d/docker-php-upload.ini \
    && echo "post_max_size=10M" >> /usr/local/etc/php/conf.d/docker-php-upload.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/docker-php-execution-time.ini

# Configure opcache for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Install Composer dependencies (production only)
# Copy composer files first for better cache utilization
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# Copy application files
COPY . /var/www/html

# Set proper permissions and create required directories
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && mkdir -p /var/log/supervisor

# Run composer scripts after copying all files
RUN composer dump-autoload --optimize

# Copy environment file
RUN cp .env.example .env

# Generate application key
RUN php artisan key:generate --force

# Create storage link
RUN php artisan storage:link

# Cache configuration for production
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Optimize application
RUN php artisan optimize

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Copy nginx configuration for Render
COPY docker/render-nginx.conf /etc/nginx/nginx.conf

# Copy PHP-FPM configuration
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports (Render will set PORT env var)
EXPOSE 10000

# Use startup script to handle port binding
CMD ["/start.sh"]
