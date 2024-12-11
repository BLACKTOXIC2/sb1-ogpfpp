export const PAYMENT_CONFIG = {
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY_ID,
  CURRENCY: 'INR',
  THEME_COLOR: '#2563EB',
  COMPANY_NAME: 'MCQGEN',
} as const;

// Validation with detailed error message
if (!PAYMENT_CONFIG.RAZORPAY_KEY) {
  throw new Error(
    'Razorpay key is not configured. Please add VITE_RAZORPAY_KEY_ID to your environment variables. ' +
    'You can get your key from the Razorpay Dashboard.'
  );
}

// Currency validation
const SUPPORTED_CURRENCIES = ['INR', 'USD'] as const;
if (!SUPPORTED_CURRENCIES.includes(PAYMENT_CONFIG.CURRENCY as any)) {
  throw new Error(
    `Invalid currency. Supported currencies are: ${SUPPORTED_CURRENCIES.join(', ')}`
  );
}

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];