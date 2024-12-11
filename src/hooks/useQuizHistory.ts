import { useState, useEffect } from 'react';
import { QuizHistoryEntry } from '../types/storage';
import { quizHistoryStorage } from '../utils/storage/quizHistory';

export function useQuizHistory(type?: QuizHistoryEntry['type']) {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [type]);

  const loadHistory = () => {
    try {
      setLoading(true);
      const data = type 
        ? quizHistoryStorage.getByType(type)
        : quizHistoryStorage.getAll();
      setHistory(data);
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuiz = (quiz: QuizHistoryEntry) => {
    quizHistoryStorage.save(quiz);
    loadHistory();
  };

  const clearHistory = () => {
    quizHistoryStorage.clear();
    loadHistory();
  };

  const removeQuiz = (id: string) => {
    quizHistoryStorage.removeById(id);
    loadHistory();
  };

  return {
    history,
    loading,
    saveQuiz,
    clearHistory,
    removeQuiz,
    refresh: loadHistory
  };
}