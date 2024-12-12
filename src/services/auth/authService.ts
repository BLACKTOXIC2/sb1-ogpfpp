import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export const authService = {
  async refreshSession(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session) {
        // Clear any stale auth state
        await this.signOut();
        return;
      }

      // Attempt to refresh the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
    } catch (error) {
      console.error('Session refresh error:', error);
      // Clear auth state on refresh failure
      await this.signOut();
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string): Promise<AuthResponse> {
    return await supabase.auth.signUp({ email, password });
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
  },

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    return await supabase.auth.resetPasswordForEmail(email);
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};