export const calculateAmountInclTaxGridItemRow = (amountExclTax, taxAmount) => {
  return parseNumber(amountExclTax) + parseNumber(taxAmount);
};