import { PAYMENT_CONFIG } from '../../config/payment';
import { loadScript } from '../../utils/script-loader';
import { PaymentOptions, PaymentResponse, PaymentResult } from './types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

class RazorpayService {
  private razorpayInstance: any;
  private isInitialized = false;

  private async initializeRazorpay(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      throw new Error('Failed to initialize payment gateway. Please try again later.');
    }
  }

  async createPayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      if (!PAYMENT_CONFIG.RAZORPAY_KEY) {
        throw new Error('Payment gateway configuration is missing');
      }

      await this.initializeRazorpay();

      return new Promise((resolve) => {
        const paymentOptions = {
          key: PAYMENT_CONFIG.RAZORPAY_KEY,
          amount: options.amount * 100, // Convert to smallest currency unit
          currency: options.currency || PAYMENT_CONFIG.CURRENCY,
          name: PAYMENT_CONFIG.COMPANY_NAME,
          description: `${options.planName} Plan Subscription`,
          handler: (response: PaymentResponse) => {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id
            });
          },
          prefill: {
            email: options.email,
            name: options.name
          },
          theme: {
            color: PAYMENT_CONFIG.THEME_COLOR
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user'
              });
            },
            escape: true,
            animation: true
          }
        };

        try {
          this.razorpayInstance = new window.Razorpay(paymentOptions);
          this.razorpayInstance.open();
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to initialize payment. Please try again.'
          });
        }
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }
}

export const razorpayService = new RazorpayService();