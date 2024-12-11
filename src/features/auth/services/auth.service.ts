import { supabase } from '../../../lib/supabase';
import { AuthError } from '../../../types/auth';

export const authService = {
  // ... existing methods ...

  async clearSession() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage items
      localStorage.removeItem('quiz_history');
      localStorage.removeItem('chat_sessions');
      
      // Clear any other app-specific storage
      sessionStorage.clear();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to clear session');
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }
};