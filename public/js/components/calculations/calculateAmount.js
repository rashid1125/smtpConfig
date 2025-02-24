import AlertComponent from "../AlertComponent.js";

export const calculateAmount = (amount, percentage, elementId) => {
    if (! isValidAmount(amount)) {
        AlertComponent.getAlertMessage({
            title   : "Warning!",
            message : "Amount is required to calculate the amount",
            type    : "warning"
        });
        return 0;
    }
    if (checkPercentAge(percentage, elementId)) {
        return parseNumber((amount * percentage) / 100);
    } else {
        return 0;
    }
};
/**
 * Function checkPercentAge
 * @param percentage
 * @param elementId
 * @returns {boolean}
 */
const checkPercentAge        = (percentage, elementId) => {
    let parsedPercentage = parseNumber(percentage);
    if (parsedPercentage < 0 || parsedPercentage > 100) {
        $(elementId).val(0);
        AlertComponent.getAlertMessage({
            title   : "Information!",
            message : "Percentage must be between 0 and 100",
            type    : "info"
        });
        return false;
    }
    return true;
};

const isValidAmount = (amount) => {
    return ! isNaN(parseFloat(amount)) && isFinite(amount);
};
