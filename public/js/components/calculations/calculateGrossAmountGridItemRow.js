export const calculateGrossAmountGridItemRow = (rate, qty, weight, divisionFactor, stockKeepingMethodId) => {
    let _factor = 1;
    let _isMultiplier = false;

    if (typeof divisionFactor === 'object' && divisionFactor !== null) {
        _factor = parseNumber(divisionFactor.factor);
        _isMultiplier = divisionFactor.is_multiplier === true || divisionFactor.is_multiplier === 1;
    } else {
        _factor = parseNumber(divisionFactor);
    }

    if ((_factor === 0 || !_factor) && parseNumber(stockKeepingMethodId) > 1) {
        return _getAlertMessage('Error!', "Factor can't be zero when required to divide", 'danger');
    }

    var $grossAmount = 0;
    if (parseNumber(stockKeepingMethodId) === 1) {
        $grossAmount = _isMultiplier ? (parseNumber(qty) * parseNumber(_factor)) * parseNumber(rate) : (parseNumber(qty) / parseNumber(_factor)) * parseNumber(rate);
    } else if (parseNumber(stockKeepingMethodId) === 2) {
        $grossAmount = _isMultiplier ? (parseNumber(weight) * parseNumber(_factor)) * parseNumber(rate) : (parseNumber(weight) / parseNumber(_factor)) * parseNumber(rate);
    } else if (parseNumber(stockKeepingMethodId) === 3) {
        $grossAmount = _isMultiplier ? (parseNumber(weight) * parseNumber(_factor)) * parseNumber(rate) : (parseNumber(weight) / parseNumber(_factor)) * parseNumber(rate);
    }
    return parseNumber($grossAmount);
};
