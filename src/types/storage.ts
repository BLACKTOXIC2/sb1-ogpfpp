import { Question } from './quiz';
import { VideoDetails } from './video';

export interface QuizHistoryEntry {
  id: string;
  date: string;
  type: 'text' | 'video' | 'true-false';
  score: number;
  totalQuestions: number;
  videoDetails?: VideoDetails;
  questions: QuestionAttempt[];
}

export interface QuestionAttempt {
  question?: string;
  statement?: string;
  userAnswer: string | boolean;
  correctAnswer: string | boolean;
  isCorrect: boolean;
}

export interface StorageKeys {
  QUIZ_HISTORY: 'mcqgen_quiz_history';
  CHAT_SESSIONS: 'mcqgen_chat_sessions';
  USER_PREFERENCES: 'mcqgen_user_preferences';
}