import { Session } from '@supabase/supabase-js';

export const sessionManager = {
  getStoredSession(): Session | null {
    try {
      const session = localStorage.getItem('supabase.auth.token');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error reading stored session:', error);
      return null;
    }
  },

  clearStoredSession(): void {
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing stored session:', error);
    }
  },

  isSessionValid(session: Session | null): boolean {
    if (!session) return false;
    const expiresAt = session.expires_at;
    if (!expiresAt) return false;
    return new Date(expiresAt * 1000) > new Date();
  }
};