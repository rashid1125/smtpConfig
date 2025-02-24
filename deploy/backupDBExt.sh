#!/bin/bash
set -e  # Exit immediately if any command fails

# Enable PHP environment
source /opt/remi/php74/enable

# Define the project directory
PROJECT_DIR="/home/sktest.digitalm.cloud/DigitalManager_ERP_3"
BACKUP_STORAGE_PATH="$PROJECT_DIR/storage/app/db_backups"
LARAVEL_BACKUP_FOLDER="$PROJECT_DIR/backup_folder"

# Ensure the script is running in the correct directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory $PROJECT_DIR does not exist."
    exit 1
fi

# Navigate to the project directory
cd "$PROJECT_DIR"
echo "Running in $PROJECT_DIR"

# Run Laravel artisan command for database backup
if ! php artisan db:backup; then
    echo "Error: Failed to execute Laravel artisan db:backup."
    exit 1
fi

echo "Database backup completed."

# Navigate to the database backup storage directory
if [ ! -d "$BACKUP_STORAGE_PATH" ]; then
    echo "Error: Backup storage path $BACKUP_STORAGE_PATH does not exist."
    exit 1
fi

cd "$BACKUP_STORAGE_PATH"

# Get the latest backup file
LATEST_BACKUP=$(ls -dtr *.enc 2>/dev/null | tail -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "Error: No backup files found in $BACKUP_STORAGE_PATH."
    exit 1
fi

echo "Latest dbBackup file: $LATEST_BACKUP"

# Create Laravel backup folder if it doesn't exist
mkdir -p "$LARAVEL_BACKUP_FOLDER"

# Copy the latest backup file to the Laravel backup folder
cp "$LATEST_BACKUP" "$LARAVEL_BACKUP_FOLDER/"
echo "Copied $LATEST_BACKUP to $LARAVEL_BACKUP_FOLDER"

# Copy the .env file to the Laravel backup folder
if [ -f "$PROJECT_DIR/.env" ]; then
    cp "$PROJECT_DIR/.env" "$LARAVEL_BACKUP_FOLDER/"
    echo "Copied .env file to $LARAVEL_BACKUP_FOLDER"
else
    echo "Warning: .env file not found in $PROJECT_DIR"
fi

# Final message
echo "Backup preparation complete. Files are ready in $LARAVEL_BACKUP_FOLDER for the pipeline to upload."

exit 0
