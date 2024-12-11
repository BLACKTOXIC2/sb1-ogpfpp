import { useState, useEffect } from 'react';
import { ChatSession } from '../types/storage';
import { chatSessionStorage } from '../utils/storage/chatSessions';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      setLoading(true);
      const data = chatSessionStorage.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = (session: ChatSession) => {
    chatSessionStorage.save(session);
    loadSessions();
  };

  const clearSessions = () => {
    chatSessionStorage.clear();
    loadSessions();
  };

  return {
    sessions,
    loading,
    saveSession,
    clearSessions,
    refresh: loadSessions
  };
}