export interface TrueFalseQuestion {
  id: number;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface TrueFalseQuizState {
  questions: TrueFalseQuestion[];
  currentQuestion: number;
  score: number;
  isComplete: boolean;
}

export interface TrueFalseHistoryEntry {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  questions: {
    statement: string;
    userAnswer: boolean;
    correctAnswer: boolean;
    explanation: string;
    isCorrect: boolean;
  }[];
}