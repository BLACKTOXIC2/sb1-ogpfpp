export const STORAGE_KEYS = {
  QUIZ_HISTORY: 'mcqgen_quiz_history',
  CHAT_SESSIONS: 'mcqgen_chat_sessions',
  USER_PREFERENCES: 'mcqgen_user_preferences'
} as const;

export const STORAGE_LIMITS = {
  MAX_HISTORY_ITEMS: 50,
  MAX_CHAT_SESSIONS: 20
} as const;