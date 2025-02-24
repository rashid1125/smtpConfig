#!/bin/bash
set -e  # Exit immediately if any command fails

# Check if backup restore flag is passed
RESTORE=true
if [ -n "$1" ] && [ "$1" == "false" ]; then
    echo "Skipping backup restoration as RESTORE=false is passed."
    RESTORE=false
fi

# Define directories and account
DIR="/home/sktest.digitalm.cloud/DigitalManager_ERP_3"
DOMAIN_NAME="sktest.digitalm.cloud"

# Git username and token will be passed as environment variables
export GIT_USERNAME="rashiddigitals"
export GIT_TOKEN="8dEZ1jaVDkM76xTjxr6mv0WHskP6OIHB9IrMSOT9EJsd7zRFD9hCJQQJ99ALACAAAAAAAAAAAAASAZDO6JU7"

# Check if the Personal Access Token (PAT) is provided
if [ -z "$GIT_TOKEN" ]; then
    echo "ERROR: Personal Access Token (PAT) is not set. Exiting."
    exit 1
fi

# Ensure the project directory exists
if [ ! -d "$DIR" ]; then
    echo "ERROR: Project directory $DIR does not exist."
    exit 1
fi

# Perform the git pull and database backup commands as the specified user
sudo su - ${DOMAIN_NAME} -c "
    set -e  # Exit immediately if any command fails
    source /opt/remi/php74/enable
    cd ${DIR}

     echo 'Pulling latest code from the repository...'
        if git pull https://${GIT_USERNAME}:${GIT_TOKEN}@digitalsoftspvtltd.visualstudio.com/DigitalManager_ERP/_git/DigitalManager_ERP_3;
        then
            echo 'Git pull successful.'
        else
            echo 'ERROR: Git pull failed.'
            exit 1
        fi

    # Backup database only if RESTORE=true
    if [ \"$RESTORE\" = true ]; then
        echo 'Starting database backup...'
        if php artisan db:backup --enc=0; then
            echo 'Database backup completed successfully.'
        else
            echo 'ERROR: Database backup failed.'
            exit 1
        fi
    else
        echo 'Skipping database backup as RESTORE=false.'
    fi

    # Remove temporary credentials
    echo 'Removing temporary Git credentials...'
    rm -f ~/.git-credentials

    echo 'All tasks completed successfully.'
"
