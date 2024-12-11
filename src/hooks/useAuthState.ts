import { useState, useCallback } from 'react';
import { AuthState, AuthError } from '../types/auth';
import { supabase } from '../lib/supabase';

export function useAuthState(initialState: AuthState) {
  const [state, setState] = useState<AuthState>(initialState);

  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'An error occurred';
    setState(prev => ({ ...prev, error: message, loading: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateSession = useCallback((session: AuthState['session']) => {
    setState(prev => ({
      ...prev,
      session,
      user: session?.user ?? null,
      loading: false
    }));
  }, []);

  return {
    state,
    handleError,
    setLoading,
    clearError,
    updateSession
  };
}