import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { AuthLogger } from '../logging/AuthLogger';

export class AuthCore {
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      AuthLogger.error('Failed to get session', error);
      throw error;
    }
  }

  static async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return session;
    } catch (error) {
      AuthLogger.error('Failed to refresh session', error);
      throw error;
    }
  }

  static async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) throw response.error;
      return response;
    } catch (error) {
      AuthLogger.error('Sign in failed', error);
      throw error;
    }
  }

  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signUp({ email, password });
      if (response.error) throw response.error;
      return response;
    } catch (error) {
      AuthLogger.error('Sign up failed', error);
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      AuthLogger.error('Sign out failed', error);
      throw error;
    }
  }

  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      return await supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
      AuthLogger.error('Password reset failed', error);
      throw error;
    }
  }
}