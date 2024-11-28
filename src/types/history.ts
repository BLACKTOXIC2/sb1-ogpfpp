export interface QuizHistoryEntry {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  questions: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
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