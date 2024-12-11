export const PAYMENT_ERRORS = {
  INITIALIZATION: 'Failed to initialize payment gateway',
  MISSING_CONFIG: 'Payment gateway configuration is missing',
  USER_CANCELLED: 'Payment cancelled by user',
  NETWORK: 'Network error occurred during payment',
  GENERIC: 'An error occurred during payment'
} as const;