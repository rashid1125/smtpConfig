export const calculateDiscountPercentageGridItemRow = (discountPerUnit, rate) => {
  return (discountPerUnit / rate) * 100;
};