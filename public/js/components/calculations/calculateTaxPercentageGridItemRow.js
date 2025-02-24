export const calculateTaxPercentageGridItemRow = (amountExclTax, taxAmount) => {
  return (taxAmount / amountExclTax) * 100;
};