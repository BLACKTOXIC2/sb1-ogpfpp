import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState } from '../types/auth';
import { AuthService } from '../services/auth/AuthService';
import { AuthErrorHandler } from '../services/auth/errors/AuthErrorHandler';
import { useSession } from '../hooks/auth/useSession';
import { AuthLogger } from '../services/auth/logging/AuthLogger';
import { SessionStorage } from '../services/auth/storage/SessionStorage';
import { supabase } from '../lib/supabase';

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setState(prev => ({
          ...prev,
          user: session.user,
          session: session,
          loading: false,
          error: null
        }));
        SessionStorage.saveSession(session);
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          loading: false
        }));
        SessionStorage.clearSession();
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        AuthLogger.error('Failed to get initial session', error);
        setState(prev => ({ ...prev, loading: false, error: error.message }));
      } else {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session,
          loading: false
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn: async (email, password) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await AuthService.signIn(email, password);
        if (response.error) throw response.error;
      } catch (error) {
        const errorDetails = AuthErrorHandler.handleError(error);
        setState(prev => ({ ...prev, error: errorDetails.message }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    signUp: async (email, password) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await AuthService.signUp(email, password);
        if (response.error) throw response.error;
      } catch (error) {
        const errorDetails = AuthErrorHandler.handleError(error);
        setState(prev => ({ ...prev, error: errorDetails.message }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    signOut: async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await AuthService.signOut();
        setState({
          ...initialState,
          loading: false
        });
      } catch (error) {
        const errorDetails = AuthErrorHandler.handleError(error);
        setState(prev => ({ ...prev, error: errorDetails.message }));
      }
    },
    resetPassword: async (email) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await AuthService.resetPassword(email);
      } catch (error) {
        const errorDetails = AuthErrorHandler.handleError(error);
        setState(prev => ({ ...prev, error: errorDetails.message }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}