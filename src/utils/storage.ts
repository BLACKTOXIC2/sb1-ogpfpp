import { QuizHistoryEntry, ChatSession } from '../types/history';

const QUIZ_HISTORY_KEY = 'quiz_history';
const CHAT_SESSIONS_KEY = 'chat_sessions';
const MAX_HISTORY_ITEMS = 50;

export const saveQuizToHistory = (quiz: QuizHistoryEntry): void => {
  const history = getQuizHistory();
  
  // Add new quiz to the beginning of the array
  history.unshift(quiz);
  
  // Limit the history size
  if (history.length > MAX_HISTORY_ITEMS) {
    history.pop();
  }
  
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
};

export const getQuizHistory = (): QuizHistoryEntry[] => {
  try {
    const history = localStorage.getItem(QUIZ_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading quiz history:', error);
    return [];
  }
};

export const clearQuizHistory = (): void => {
  localStorage.removeItem(QUIZ_HISTORY_KEY);
};

export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex !== -1) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
    
    // Limit the number of stored sessions
    if (sessions.length > MAX_HISTORY_ITEMS) {
      sessions.pop();
    }
  }
  
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
};

export const getChatSessions = (): ChatSession[] => {
  try {
    const sessions = localStorage.getItem(CHAT_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error reading chat sessions:', error);
    return [];
  }
};

export const clearChatSessions = (): void => {
  localStorage.removeItem(CHAT_SESSIONS_KEY);
};