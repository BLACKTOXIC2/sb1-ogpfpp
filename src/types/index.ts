export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestion: number;
  score: number;
  isComplete: boolean;
}

export interface AnswerHistory {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}