export const calculateRatePerKgGridItemRow = (rate, divisionFactor, stockKeepingMethodId) => {
    // Determine the correct division factor and whether it's a multiplier or not
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

    var $ratePerKG;

    if (parseNumber(stockKeepingMethodId) === 1) {
        $ratePerKG = 0;
    } else if (parseNumber(stockKeepingMethodId) === 2 || parseNumber(stockKeepingMethodId) === 3) {
        if (_isMultiplier) {
            $ratePerKG = parseNumber(rate) * _factor;
        } else {
            $ratePerKG = parseNumber(rate) / _factor;
        }
    }
    // Ensure the return value is numeric and handle any potential infinity or NaN
    $ratePerKG = isFinite($ratePerKG) ? $ratePerKG : 0;
    return parseNumber($ratePerKG);
};
