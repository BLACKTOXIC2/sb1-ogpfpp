import { Session } from '@supabase/supabase-js';

export class SessionValidator {
  static isValid(session: Session | null): boolean {
    if (!session?.expires_at) return false;
    
    // Add 5-minute buffer to prevent edge cases
    const expirationTime = new Date(session.expires_at * 1000);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    
    return expirationTime.getTime() - now.getTime() > fiveMinutes;
  }

  static shouldRefresh(session: Session | null): boolean {
    if (!session?.expires_at) return false;
    
    const expirationTime = new Date(session.expires_at * 1000);
    const now = new Date();
    const thirtyMinutes = 30 * 60 * 1000;
    
    return expirationTime.getTime() - now.getTime() < thirtyMinutes;
  }
}