// GlobalConstants.js
const QTY_ROUNDING = parseFloat($('#txtqty_rounding').val()) || 0;
const RATE_ROUNDING = parseFloat($('#txtrate_rounding').val()) || 0;
const WEIGHT_ROUNDING = parseFloat($('#weightRounding').val()) || 0;
const AMOUNT_ROUNDING = parseFloat($('#setting_decimal').val()) || 0;
export { QTY_ROUNDING, RATE_ROUNDING, WEIGHT_ROUNDING, AMOUNT_ROUNDING };