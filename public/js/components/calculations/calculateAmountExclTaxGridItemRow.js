export const calculateAmountExclTaxGridItemRow = (rate, qty, weight, divisionFactor, stockKeepingMethodId, discountPerUnit) => {

    let _factor = 1;
    let _isMultiplier = false;

    if (typeof divisionFactor === 'object' && divisionFactor !== null) {
        _factor = parseNumber(divisionFactor.factor);
        _isMultiplier = divisionFactor.is_multiplier === true || divisionFactor.is_multiplier === 1;
    } else {
        _factor = parseNumber(divisionFactor);
    }

    if (parseNumber(stockKeepingMethodId) === 1) {
        return _isMultiplier ? (parseNumber(qty) * parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit)) : (parseNumber(qty) / parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
    } else if (parseNumber(stockKeepingMethodId) === 2) {
        return _isMultiplier ? (parseNumber(weight) * parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit)) : (parseNumber(weight) / parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
    } else if (parseNumber(stockKeepingMethodId) === 3) {
        return _isMultiplier ? (parseNumber(weight) * parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit)) : (parseNumber(weight) / parseNumber(_factor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
    } else {
        return 0;
    }
};
