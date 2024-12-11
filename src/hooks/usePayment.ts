import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { razorpayService } from '../services/payment/razorpay';
import { PaymentResult } from '../services/payment/types';
import { useAnalytics } from './useAnalytics';

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
  lastPaymentResult: PaymentResult | null;
}

export const usePayment = () => {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
    lastPaymentResult: null
  });
  
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  const handlePayment = async (planName: string, amount: number) => {
    if (!user) {
      throw new Error('Please sign in to continue');
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const result = await razorpayService.createPayment({
        amount,
        planName,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email || ''
      });

      setState(prev => ({ ...prev, lastPaymentResult: result }));

      if (result.success) {
        trackEvent('payment_success', {
          plan: planName,
          amount: amount
        });
      } else {
        trackEvent('payment_failed', {
          plan: planName,
          error: result.error
        });
        throw new Error(result.error || 'Payment failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return {
    ...state,
    handlePayment
  };
};