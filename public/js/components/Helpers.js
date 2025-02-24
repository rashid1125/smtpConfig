import AlertComponent from "./AlertComponent.js";

export const validPercentage = (percentage, target) => {
    let parsedPercentage = parseNumber(percentage);

    // Define a function to get the element based on target type
    const getElement = target => {
        if (typeof target === 'string') {
            // If target is a string, assume it's an element ID
            return document.getElementById(target);
        } else if (target instanceof Element) {
            // If target is a DOM element, use it directly
            return target;
        } else {
            // Handle other types or errors appropriately
            console.error('Invalid target type');
            return null;
        }
    };

    const element = getElement(target);

    if (!element) {
        return false; // Exit if no valid element is found
    }

    if (parsedPercentage < 0 || parsedPercentage > 100) {
        element.value = 0; // Update the value of the element
        AlertComponent._getAlertMessage('Information!', "Percentage must be between 0 and 100", 'info');
        return parseNumber(element.value);
    }

    return parsedPercentage;
};
