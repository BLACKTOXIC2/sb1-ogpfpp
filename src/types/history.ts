import { VideoDetails } from './video';

export interface QuizHistoryEntry {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  type: 'text' | 'video' | 'true-false';
  videoTitle?: string;
  videoDetails?: VideoDetails;
  questions: {
    question?: string;
    statement?: string;
    userAnswer: string | boolean;
    correctAnswer: string | boolean;
    isCorrect: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  timestamp: string;
  content: string;
  type: 'user' | 'system';
}

export interface ChatSession {
  id: string;
  date: string;
  messages: ChatMessage[];
}

export interface TrueFalseHistoryEntry extends QuizHistoryEntry {
  type: 'true-false';
  questions: {
    statement: string;
    userAnswer: boolean;
    correctAnswer: boolean;
    isCorrect: boolean;
  }[];
}