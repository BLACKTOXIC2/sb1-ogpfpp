export class AuthLogger {
  static error(message: string, error: unknown): void {
    console.error(`Auth Error - ${message}:`, error);
    
    // You could add additional logging here, like sending to a logging service
    if (process.env.NODE_ENV === 'development') {
      console.trace('Auth Error Stack:');
    }
  }

  static warn(message: string, details?: unknown): void {
    console.warn(`Auth Warning - ${message}`, details);
  }

  static info(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(`Auth Info - ${message}`);
    }
  }
}