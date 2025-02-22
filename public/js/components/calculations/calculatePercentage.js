import AlertComponent from "../AlertComponent.js";

export const calculatePercentage = (amount, totalAmount, elementId) => {
    if (! isValidAmount(totalAmount)) {
        // Updated warning message for total amount validation
        AlertComponent._getAlertMessage("Warning!", "Total amount is required for percentage calculation.", "warning");
        if (elementId) {
            $(elementId).val(0);
        }
        return 0;
    }

    if (amount > totalAmount) {
        // Updated information message for amount exceeding total amount
        AlertComponent._getAlertMessage("Information!", "Specified amount exceeds the total amount. Please enter a valid amount.", "info");
        if (elementId) {
            $(elementId).val(0);
        }
        return 0;
    }

    const percentage = (amount / totalAmount) * 100;
    // Ensure percentage does not exceed 100%
    return Math.min(percentage, 100);
};

const isValidAmount = (amount) => {
    return amount && ! isNaN(parseFloat(amount)) && isFinite(amount);
};
