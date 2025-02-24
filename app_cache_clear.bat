@echo off
REM Clear and cache routes, config, and views
php artisan route:clear
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan cache:clear
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan config:cache
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan config:clear
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan view:cache
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan view:clear
if %errorlevel% neq 0 exit /b %errorlevel%

php artisan route:cache
if %errorlevel% neq 0 exit /b %errorlevel%

echo All tasks completed!
pause
