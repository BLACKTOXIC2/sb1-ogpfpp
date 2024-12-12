import { AuthError } from '@supabase/supabase-js';
import { AUTH_ERROR_CODES, AuthErrorDetails } from './AuthErrorTypes';
import { AuthLogger } from '../logging/AuthLogger';

export class AuthErrorHandler {
  private static readonly ERROR_MESSAGES: Record<string, AuthErrorDetails> = {
    [AUTH_ERROR_CODES.REFRESH_TOKEN_NOT_FOUND]: {
      code: AUTH_ERROR_CODES.REFRESH_TOKEN_NOT_FOUND,
      message: 'Your session has expired. Please sign in again.',
      shouldRedirect: true
    },
    [AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN]: {
      code: AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN,
      message: 'Your session is no longer valid. Please sign in again.',
      shouldRedirect: true
    },
    [AUTH_ERROR_CODES.EXPIRED_SESSION]: {
      code: AUTH_ERROR_CODES.EXPIRED_SESSION,
      message: 'Your session has expired. Please sign in again.',
      shouldRedirect: true
    },
    [AUTH_ERROR_CODES.NETWORK_ERROR]: {
      code: AUTH_ERROR_CODES.NETWORK_ERROR,
      message: 'Network error occurred. Please check your connection.',
      shouldRedirect: false
    },
    [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: {
      code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Invalid email or password.',
      shouldRedirect: false
    },
    [AUTH_ERROR_CODES.USER_NOT_FOUND]: {
      code: AUTH_ERROR_CODES.USER_NOT_FOUND,
      message: 'User not found.',
      shouldRedirect: false
    },
    [AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED]: {
      code: AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
      message: 'Please confirm your email address before signing in.',
      shouldRedirect: false
    }
  };

  static isAuthError(error: unknown): error is AuthError {
    return (
      typeof error === 'object' &&
      error !== null &&
      '__isAuthError' in error &&
      error.__isAuthError === true
    );
  }

  static handleError(error: unknown): AuthErrorDetails {
    if (!error) {
      return {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: 'An unknown error occurred',
        shouldRedirect: false
      };
    }

    if (this.isAuthError(error)) {
      const errorDetails = this.ERROR_MESSAGES[error.code || ''] || {
        code: error.code as AuthErrorCode,
        message: error.message,
        shouldRedirect: false
      };

      AuthLogger.error(errorDetails.message, error);
      return errorDetails;
    }

    const genericError = {
      code: AUTH_ERROR_CODES.NETWORK_ERROR,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      shouldRedirect: false
    };

    AuthLogger.error(genericError.message, error);
    return genericError;
  }

  static shouldRedirectToLogin(error: unknown): boolean {
    return this.handleError(error).shouldRedirect;
  }
}