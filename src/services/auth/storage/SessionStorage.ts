import { Session } from '@supabase/supabase-js';
import { AuthLogger } from '../logging/AuthLogger';

export class SessionStorage {
  private static readonly SESSION_KEY = 'sb-session';
  private static readonly REFRESH_TOKEN_KEY = 'sb-refresh-token';

  static saveSession(session: Session | null): void {
    try {
      if (session) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        if (session.refresh_token) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, session.refresh_token);
        }
      } else {
        this.clearSession();
      }
    } catch (error) {
      AuthLogger.error('Failed to save session', error);
      this.clearSession();
    }
  }

  static getSession(): Session | null {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      AuthLogger.error('Failed to get session from storage', error);
      return null;
    }
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.clear();
    } catch (error) {
      AuthLogger.error('Failed to clear session', error);
    }
  }
}