import AlertComponent from "./AlertComponent.js";

const handleAjaxError = (error) => {
    // Check if the error object contains validation errors
    if (error.errors) {
        let errorMessage = "Validation Error(s): ";
        for (const [field, messages] of Object.entries(error.errors)) {
            errorMessage += `${field}: ${messages.join(', ')}; `;
        }
        // Display the validation errors using AlertComponent
        AlertComponent.getAlertMessage({ title: 'Operation failed!', message: errorMessage, type: 'danger' });
    } else {
        if (error && error.message) {
            AlertComponent.getAlertMessage({ title: 'Operation failed!', message: error.message || "An error occurred. Please try again.", type: error.level ?? 'danger' });
        } else {
            if (error && error.exception) {
                AlertComponent.getAlertMessage({ title: 'Operation failed!', message: error.exception, type: 'danger' });
            } else {
                AlertComponent.getAlertMessage({ title: 'Operation failed!', message: error, type: 'danger' });
            }
        }
    }
};
/**
 * Performs an AJAX request and returns a promise.
 *
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {string} url - The URL to send the request to.
 * @param {Object} data - The data to send with the request.
 * @param {string} dataType - The type of data expected from the server ('json', 'xml', etc.).
 * @param {Object} additionalOptions
 * @param {boolean} [additionalOptions.processData=false] - The title of the alert message.
 * @param {boolean} [additionalOptions.contentType=false] - The title of the alert message.
 * @param {boolean} [additionalOptions.async=false] - The title of the alert message.
 * @returns {Promise} - A promise that resolves with the response or rejects with an error.
 */
const makeAjaxRequest = async (method, url, data = {}, dataType = 'json', additionalOptions = {}) => {
    try {
        return await new Promise((resolve, reject) => {
            $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: dataType,
                ...additionalOptions,
                cache: false,
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr) {
                    let error;
                    try {
                        // Try to parse the error message
                        error = JSON.parse(xhr.responseText);
                    } catch (e) {
                        // Construct a more informative error message
                        error = {
                            message: `Unexpected response format: ${e.message}. Status: ${xhr.status} ${xhr.statusText}`,
                            detail: xhr.responseText ? xhr.responseText.slice(0, 100) : 'No response text available' // Provide a snippet of the response to help diagnose the issue
                        };
                    }
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error(error);
        return handleAjaxError(error);
    } // Automatically handle errors for all AJAX requests
};
export {
    makeAjaxRequest,
    handleAjaxError
}
