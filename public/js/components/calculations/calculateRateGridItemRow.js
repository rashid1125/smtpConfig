export const calculateRateGridItemRow = (ratePerKG, divisionFactor, stockKeepingMethodId) => {
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

    var $rate = parseNumber(ratePerKG);

    if (parseNumber(stockKeepingMethodId) === 2 || parseNumber(stockKeepingMethodId) === 3) {
        if (_isMultiplier) {
            $rate = parseNumber(ratePerKG) / parseNumber(_factor);
        } else {
            $rate = parseNumber(ratePerKG) * parseNumber(_factor);
        }
    }

    return parseNumber($rate);
};
