import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { SessionStorage } from '../../services/auth/storage/SessionStorage';
import { AuthLogger } from '../../services/auth/logging/AuthLogger';

export function useSession() {
  const [session, setSession] = useState<Session | null>(SessionStorage.getSession());

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        SessionStorage.saveSession(session);
      } else {
        setSession(null);
        SessionStorage.clearSession();
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
}