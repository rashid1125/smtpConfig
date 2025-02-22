class AlertComponent {
    /**
     * Displays a notification message on the page.
     * This function is deprecated and will be removed in future releases.
     * Use getAlertMessage(options={}) instead.
     *
     * @param {string} title The title of the alert message. Default is "Success".
     * @param {string} message The content of the alert message. Default is an empty string.
     * @param {string} type The type of alert. Valid types are "success", "info", "warning", "danger". Default is "danger".
     * @param {number} duration How long the alert should be displayed in milliseconds. Default is 3000ms.
     * @deprecated Use getAlertMessage(options={}) as a replacement.
     */
    static _getAlertMessage( title = 'Success', message = '', type = 'danger', duration = 5000, options = {} ) {
        const defaults   = {
            title: 'Success',
            message: options.message,
            type: 'success',
            duration: 5000,
        };
        // Merge the default options with the user-provided options
        const settings   = Object.assign( {}, defaults, options );
        // Define an array of valid alert types.
        const validTypes = [ 'success', 'info', 'warning', 'danger' ];
        // Check if the provided type is valid, throw an error if not.
        if ( !validTypes.includes( type ) ) {
            throw new Error( `Invalid alert type: "${ type }". Valid types are ${ validTypes.join( ', ' ) }.` );
        }
        // Define a mapping from alert types to glyphicon classes
        const iconMap = {
            success: 'fa fa-check-circle',
            info: 'fa fa-info-circle',
            warning: 'fa fa-exclamation-circle',
            danger: 'fa fa-times-circle',
        };

        const iconClass = iconMap[settings.type] || 'fa fa-exclamation-circle'; // Default to warning if not found

        // Use jQuery notify for displaying the alert message.
        $.notify( {
            // Notification content configuration.
            title: `<strong>${ title }</strong>`,
            message: `<br>${ message }`,
            icon: iconClass, // Changed to a more generic icon for all types
        }, {
            // Notification display settings.
            element: 'body',
            type: type,
            // eslint-disable-next-line camelcase
            allow_dismiss: true,
            placement: {
                from: 'top',
                align: 'center',
            },
            offset: 20,
            spacing: 10,
            // eslint-disable-next-line camelcase
            z_index: 999999,
            delay: duration, // Use the duration parameter directly.
            timer: 1000, // Changed to a fixed value for consistency.
            // eslint-disable-next-line camelcase
            url_target: '_blank',
            // eslint-disable-next-line camelcase
            icon_type: 'class',
        } );
    }

    /**
     * Displays a notification message with customizable options using the Notify.js library.
     *
     * @param {Object} options - The configuration options for the alert message.
     * @param {string} [options.title="Success"] - The title of the alert message.
     * @param {string} [options.message="Operation completed successfully."] - The content of the alert message.
     * @param {string} [options.type="success"] - The type of alert. Valid types are "success", "info", "warning", "danger".
     * @param {number} [options.duration=3000] - Duration the alert should be displayed in milliseconds.
     * @param {Object} [options.placement] - Placement configuration for the alert.
     * @param {string} [options.placement.from="top"] - The vertical alignment of the alert ("top" or "bottom").
     * @param {string} [options.placement.align="center"] - The horizontal alignment of the alert ("left", "center", or "right").
     * @return {string} The jQuery notify object for the alert message.
     */
    static getAlertMessage( {
        title = 'Success',
        message = 'Operation completed successfully.',
        type = 'success',
        duration = 5000,
        placement = { from: 'top', align: 'center' },
    } = {} ) {
        // Validate the alert type
        const validTypes = [ 'success', 'info', 'warning', 'danger' ];
        if ( !validTypes.includes( type ) ) {
            throw new Error( `Invalid alert type: "${ type }". Valid types are ${ validTypes.join( ', ' ) }.` );
        }

        // Define a mapping from alert types to glyphic classes
        const iconMap = {
            success: 'fa fa-check-circle',
            info: 'fa fa-info-circle',
            warning: 'fa fa-exclamation-circle',
            danger: 'fa fa-times-circle',
        };

        // Determine the correct icon class based on the alert type
        const iconClass = iconMap[type];

        // Display the alert message using jQuery notify
        $.notify( {
            // Notification content configuration
            title: `<strong>${ title }</strong>`,
            message: `<br>${ message }`,
            icon: iconClass,
        }, {
            // Notification display settings
            element: 'body',
            type: type,
            allow_dismiss: true,
            placement: placement,
            offset: 20,
            spacing: 10,
            z_index: 999999,
            delay: duration,
            timer: 1000, // Consider customizing the timer based on specific use cases
            url_target: '_blank',
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp',
            },
            icon_type: 'class',
        } );
    }


    static async _getConfirmMessage( title, message, type = 'warning', callback ) {
        if ( typeof callback !== 'function' ) {
            console.error( 'Callback must be a function' );
            return;
        }

        // Implementation using Swal.fire
        const result = await Swal.fire( {
            title: title,
            text: message,
            icon: type,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        } );
        callback( result.isConfirmed );
    }

    static _getConfirmPromise( title, message, type = 'warning' ) {
        return new Promise( ( resolve ) => {
            Swal.fire( {
                title: title,
                text: message,
                icon: type,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
            } ).then( ( result ) => {
                resolve( result.isConfirmed );
            } );
        } );
    }
}

export default AlertComponent;
