import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType, AuthState } from '../types/auth';
import { supabase } from '../lib/supabase';
import { useAuthState } from '../hooks/useAuthState';

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, handleError, setLoading, clearError, updateSession } = useAuthState(initialState);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });

    return () => subscription.unsubscribe();
  }, [updateSession]);

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  const signOut = async () => {
    try {
      clearError();
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword
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