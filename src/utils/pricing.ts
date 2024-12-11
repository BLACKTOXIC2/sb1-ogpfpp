export const calculateYearlyPrice = (monthlyPrice: number): number => {
  const yearlyPrice = monthlyPrice * 12;
  const discount = yearlyPrice * 0.2; // 20% discount
  return Math.round(yearlyPrice - discount);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};