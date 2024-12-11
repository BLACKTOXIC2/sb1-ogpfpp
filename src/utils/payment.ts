import { PaymentResult } from '../services/payment/types';

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 10,000 INR
};

export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const handlePaymentError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('cancelled')) {
      return 'Payment was cancelled.';
    }
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const createPaymentSuccessMessage = (result: PaymentResult): string => {
  if (!result.success) return '';
  return `Payment successful! Transaction ID: ${result.paymentId}`;
};