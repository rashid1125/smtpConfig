composer install --optimize-autoloader --no-dev
php artisan route:clear
php artisan cache:clear
php artisan config:cache
php artisan config:clear
php artisan view:cache
php artisan view:clear
php artisan route:cache || true