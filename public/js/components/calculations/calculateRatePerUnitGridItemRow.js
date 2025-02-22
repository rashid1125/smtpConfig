export const calculateRatePerUnitGridItemRow = (rate, discountPerUnit, divisionFactor, stockKeepingMethodId) => {
    let _factor = 1;
    let _isMultiplier = false;

    if (typeof divisionFactor === 'object' && divisionFactor !== null) {
        _factor = parseNumber(divisionFactor.factor);
        _isMultiplier = divisionFactor.is_multiplier === true || divisionFactor.is_multiplier === 1;
    } else {
        _factor = parseNumber(divisionFactor);
    }

    return _isMultiplier ? parseNumber((parseNumber(rate) - parseNumber(discountPerUnit)) * parseNumber(_factor)) : parseNumber((parseNumber(rate) - parseNumber(discountPerUnit)) / parseNumber(_factor));
};
