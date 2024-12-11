import { ChatSession } from '../../types/storage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../../constants/storage';

export const chatSessionStorage = {
  save(session: ChatSession): void {
    try {
      const sessions = this.getAll();
      const existingIndex = sessions.findIndex(s => s.id === session.id);

      if (existingIndex !== -1) {
        sessions[existingIndex] = session;
      } else {
        sessions.unshift(session);
        if (sessions.length > STORAGE_LIMITS.MAX_CHAT_SESSIONS) {
          sessions.pop();
        }
      }

      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  },

  getAll(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error reading chat sessions:', error);
      return [];
    }
  },

  getById(id: string): ChatSession | undefined {
    return this.getAll().find(session => session.id === id);
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
    } catch (error) {
      console.error('Error clearing chat sessions:', error);
    }
  }
};