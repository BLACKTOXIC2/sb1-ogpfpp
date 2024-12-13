import { supabase } from '../../../lib/supabase';
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
          redirectTo: `${window.location.origin}/text-quiz`
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      AuthLogger.error('Google sign in failed', error);
      throw error;
    }
  }

  static async handleCallback(): Promise<void> {
    try {
      // Get the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken) {
        throw new Error('No access token found in URL');
      }

      // Set the session using the tokens
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      });

      if (error) throw error;
      if (!session) throw new Error('No session established');

      // Store any necessary session data
      localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    } catch (error) {
      AuthLogger.error('Failed to handle auth callback', error);
      throw error;
    }
  }
}