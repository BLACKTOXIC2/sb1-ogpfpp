export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  planName: string;
  email: string;
  name: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentId?: string;
}