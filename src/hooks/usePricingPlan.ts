import { useState } from 'react';
import { calculateYearlyPrice } from '../utils/pricing';

export const usePricingPlan = () => {
  const [isYearly, setIsYearly] = useState(false);

  const calculatePrice = (monthlyPrice: number): number => {
    return isYearly ? calculateYearlyPrice(monthlyPrice) : monthlyPrice;
  };

  const getBillingPeriod = () => isYearly ? 'year' : 'month';

  return {
    isYearly,
    setIsYearly,
    calculatePrice,
    getBillingPeriod
  };
};