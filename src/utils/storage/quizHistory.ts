import { QuizHistoryEntry } from '../../types/storage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../../constants/storage';

export const quizHistoryStorage = {
  save(quiz: QuizHistoryEntry): void {
    try {
      const history = this.getAll();
      history.unshift(quiz);

      if (history.length > STORAGE_LIMITS.MAX_HISTORY_ITEMS) {
        history.pop();
      }

      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  },

  getAll(): QuizHistoryEntry[] {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading quiz history:', error);
      return [];
    }
  },

  getByType(type: QuizHistoryEntry['type']): QuizHistoryEntry[] {
    return this.getAll().filter(entry => entry.type === type);
  },

  getById(id: string): QuizHistoryEntry | undefined {
    return this.getAll().find(entry => entry.id === id);
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
    } catch (error) {
      console.error('Error clearing quiz history:', error);
    }
  },

  removeById(id: string): void {
    try {
      const history = this.getAll().filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error removing quiz entry:', error);
    }
  }
};