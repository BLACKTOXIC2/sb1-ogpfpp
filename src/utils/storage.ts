import { QuizHistoryEntry, ChatSession } from '../types/history';

const QUIZ_HISTORY_KEY = 'quiz_history';
const CHAT_SESSIONS_KEY = 'chat_sessions';

export const saveQuizToHistory = (quiz: QuizHistoryEntry): void => {
  const history = getQuizHistory();
  history.unshift(quiz);
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
};

export const getQuizHistory = (): QuizHistoryEntry[] => {
  const history = localStorage.getItem(QUIZ_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
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
  }
  
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
};

export const getChatSessions = (): ChatSession[] => {
  const sessions = localStorage.getItem(CHAT_SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const clearChatSessions = (): void => {
  localStorage.removeItem(CHAT_SESSIONS_KEY);
};