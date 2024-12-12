import { supabase } from '../../../lib/supabase';
import { AuthError } from '../../../types/auth';
import { AuthLogger } from '../logging/AuthLogger';

export class GoogleAuthProvider {
  static async signIn() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      AuthLogger.error('Google sign in failed', error);
      throw error;
    }
  }

  static async handleRedirect(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session) {
        throw new Error('No session found after OAuth redirect');
      }
    } catch (error) {
      AuthLogger.error('Failed to handle OAuth redirect', error);
      throw error;
    }
  }
}