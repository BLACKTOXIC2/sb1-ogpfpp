import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';
import { PaymentResult } from '../services/payment/types';

export const usePaymentTracking = () => {
  const { trackEvent } = useAnalytics();

  const trackPayment = (result: PaymentResult, planName: string, amount: number) => {
    if (result.success) {
      trackEvent('payment_success', {
        plan: planName,
        amount: amount,
        transaction_id: result.paymentId
      });
    } else {
      trackEvent('payment_failed', {
        plan: planName,
        error: result.error,
        amount: amount
      });
    }
  };

  return { trackPayment };
};