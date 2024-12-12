import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState } from '../types/auth';
import { AuthService } from '../services/auth/AuthService';
import { AuthErrorHandler } from '../services/auth/errors/AuthErrorHandler';
import { useSession } from '../hooks/auth/useSession';
import { AuthLogger } from '../services/auth/logging/AuthLogger';
import { SessionStorage } from '../services/auth/storage/SessionStorage';

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const session = useSession();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session in storage first
        const storedSession = SessionStorage.getSession();
        if (storedSession) {
          setState(prev => ({
            ...prev,
            session: storedSession,
            user: storedSession.user
          }));
        }

        // Then try to refresh the session
        await AuthService.refreshSession();
      } catch (error) {
        if (mounted) {
          const errorDetails = AuthErrorHandler.handleError(error);
          setState(prev => ({
            ...prev,
            error: errorDetails.message,
            user: null,
            session: null
          }));
          
          if (errorDetails.shouldRedirect) {
            SessionStorage.clearSession();
          }
        }
      } finally {
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (session) {
      setState(prev => ({
        ...prev,
        session,
        user: session.user,
        error: null
      }));
      SessionStorage.saveSession(session);
    }
  }, [session]);

  const handleError = (error: unknown) => {
    const errorDetails = AuthErrorHandler.handleError(error);
    setState(prev => ({
      ...prev,
      error: errorDetails.message,
      loading: false
    }));

    if (errorDetails.shouldRedirect) {
      setState(prev => ({
        ...prev,
        user: null,
        session: null
      }));
      SessionStorage.clearSession();
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    signIn: async (email, password) => {
      try {
        clearError();
        setState(prev => ({ ...prev, loading: true }));
        const response = await AuthService.signIn(email, password);
        
        if (response.data.session) {
          setState(prev => ({
            ...prev,
            user: response.data.session?.user ?? null,
            session: response.data.session,
            error: null
          }));
        }
      } catch (error) {
        handleError(error);
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    signUp: async (email, password) => {
      try {
        clearError();
        setState(prev => ({ ...prev, loading: true }));
        await AuthService.signUp(email, password);
      } catch (error) {
        handleError(error);
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    signOut: async () => {
      try {
        clearError();
        setState(prev => ({ ...prev, loading: true }));
        await AuthService.signOut();
        setState({
          ...initialState,
          loading: false
        });
      } catch (error) {
        handleError(error);
      }
    },
    resetPassword: async (email) => {
      try {
        clearError();
        setState(prev => ({ ...prev, loading: true }));
        await AuthService.resetPassword(email);
      } catch (error) {
        handleError(error);
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