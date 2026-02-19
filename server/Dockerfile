# Use the official PHP 8.2 FPM image as base
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

RUN docker-php-ext-install -j$(nproc) \
        zip \
        pdo_mysql \
        pdo_pgsql \
        bcmath \
        xml \
        ctype \
        opcache \
        dom \
        filter \
        hash \
        mbstring \
        session \
        simplexml \
        tokenizer \
        xmlwriter

# Install intl extension separately (requires ICU)
RUN docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) intl

# Enable iconv (built-in on Alpine)
RUN docker-php-ext-enable iconv

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

# Copy application files
COPY . /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Install Composer dependencies (production only)
RUN composer install --no-dev --optimize-autoloader --no-interaction

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

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy PHP-FPM configuration
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80

# Start supervisor to run both nginx and php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
