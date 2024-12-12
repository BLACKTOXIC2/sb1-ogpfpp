import { AuthResponse } from '@supabase/supabase-js';
import { AuthCore } from './core/AuthCore';
import { SessionStorage } from './storage/SessionStorage';
import { SessionValidator } from './core/SessionValidator';
import { AuthErrorHandler } from './errors/AuthErrorHandler';
import { AuthLogger } from './logging/AuthLogger';

export class AuthService {
  static async refreshSession(): Promise<void> {
    try {
      const currentSession = await AuthCore.getSession();
      
      if (!currentSession || !SessionValidator.isValid(currentSession)) {
        AuthLogger.info('Session invalid or expired');
        await this.signOut();
        return;
      }

      if (SessionValidator.shouldRefresh(currentSession)) {
        AuthLogger.info('Refreshing session');
        const newSession = await AuthCore.refreshSession();
        if (newSession) {
          SessionStorage.saveSession(newSession);
        }
      }
    } catch (error) {
      const errorDetails = AuthErrorHandler.handleError(error);
      if (errorDetails.shouldRedirect) {
        await this.signOut();
      }
      throw error;
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await AuthCore.signInWithPassword(email, password);
      if (response.data.session) {
        SessionStorage.saveSession(response.data.session);
      }
      return response;
    } catch (error) {
      throw AuthErrorHandler.handleError(error);
    }
  }

  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      return await AuthCore.signUp(email, password);
    } catch (error) {
      throw AuthErrorHandler.handleError(error);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await AuthCore.signOut();
    } finally {
      // Always clear local session data, even if API call fails
      SessionStorage.clearSession();
    }
  }

  static async resetPassword(email: string) {
    try {
      return await AuthCore.resetPassword(email);
    } catch (error) {
      throw AuthErrorHandler.handleError(error);
    }
  }
}