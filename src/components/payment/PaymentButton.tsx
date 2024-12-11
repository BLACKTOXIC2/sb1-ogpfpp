import React from 'react';
import { usePayment } from '../../hooks/usePayment';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  planName: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  planName,
  amount,
  onSuccess,
  onError,
  className = '',
  children
}) => {
  const { handlePayment, isProcessing } = usePayment();

  const handleClick = async () => {
    try {
      const result = await handlePayment(planName, amount);
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || 'Payment failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`flex items-center justify-center gap-2 ${className} ${
        isProcessing ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default PaymentButton;