export const AUTH_ERROR_CODES = {
  REFRESH_TOKEN_NOT_FOUND: 'refresh_token_not_found',
  INVALID_REFRESH_TOKEN: 'invalid_refresh_token',
  EXPIRED_SESSION: 'expired_session',
  NETWORK_ERROR: 'network_error',
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_NOT_FOUND: 'user_not_found',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];

export interface AuthErrorDetails {
  code: AuthErrorCode;
  message: string;
  shouldRedirect: boolean;
}