import { QuizHistoryEntry } from '../../types/storage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../../constants/storage';

export const saveQuizToHistory = (quiz: QuizHistoryEntry): void => {
  try {
    const history = getQuizHistory();
    history.unshift(quiz);
    
    if (history.length > STORAGE_LIMITS.MAX_HISTORY_ITEMS) {
      history.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving quiz to history:', error);
  }
};

export const getQuizHistory = (): QuizHistoryEntry[] => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading quiz history:', error);
    return [];
  }
};

export const clearQuizHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  } catch (error) {
    console.error('Error clearing quiz history:', error);
  }
};