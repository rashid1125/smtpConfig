export const calculateTaxAmountGridItemRow = (amountExclTax, taxPercentage) => {
  return (parseNumber(taxPercentage) / parseNumber(100)) * parseNumber(amountExclTax);
};