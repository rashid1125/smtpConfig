export const calculateDiscountAmountGridItemRow = (amount, discountPercentage) => {
  return (parseNumber(discountPercentage) / parseNumber(100)) * parseNumber(amount);
};