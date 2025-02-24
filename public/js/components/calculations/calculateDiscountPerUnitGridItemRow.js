export const calculateDiscountPerUnitGridItemRow = (discountPercentage, rate) => {
  return parseNumber(rate) * parseNumber(discountPercentage) / parseNumber(100);
};