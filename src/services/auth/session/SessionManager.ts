import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

export class SessionManager {
  private static readonly SESSION_KEY = 'sb-session';
  private static readonly AUTH_EVENT_LISTENERS: Set<() => void> = new Set();

  static async initialize(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.setSession(session);
      } else {
        this.clearSession();
      }
    } catch (error) {
      console.error('Session initialization error:', error);
      this.clearSession();
    }
  }

  static getSession(): Session | null {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('Error reading session:', error);
      return null;
    }
  }

  static setSession(session: Session | null): void {
    try {
      if (session) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      } else {
        this.clearSession();
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Error setting session:', error);
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      sessionStorage.clear();
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  static isSessionValid(session: Session | null): boolean {
    if (!session?.expires_at) return false;
    return new Date(session.expires_at * 1000) > new Date();
  }

  static addListener(listener: () => void): () => void {
    this.AUTH_EVENT_LISTENERS.add(listener);
    return () => this.AUTH_EVENT_LISTENERS.delete(listener);
  }

  private static notifyListeners(): void {
    this.AUTH_EVENT_LISTENERS.forEach(listener => listener());
  }
}