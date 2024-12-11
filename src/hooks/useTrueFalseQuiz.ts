import { useState } from 'react';
import { TrueFalseQuestion } from '../types/trueFalse';
import { saveQuizToHistory } from '../utils/storage';
import { useAnalytics } from './useAnalytics';

interface TrueFalseQuizState {
  questions: TrueFalseQuestion[];
  currentQuestion: number;
  score: number;
  isComplete: boolean;
}

export function useTrueFalseQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();
  const [quizState, setQuizState] = useState<TrueFalseQuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = (questions: TrueFalseQuestion[]) => {
    trackEvent('QUIZ_START', { type: 'true-false', questionCount: questions.length });
    setQuizState({
      questions,
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
  };

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const scoreChange = isCorrect ? 2 : -1;

    const newState = {
      ...quizState,
      score: quizState.score + scoreChange,
      currentQuestion: quizState.currentQuestion + 1,
      isComplete: quizState.currentQuestion + 1 >= quizState.questions.length,
    };

    setQuizState(newState);

    if (newState.isComplete) {
      trackEvent('QUIZ_COMPLETE', {
        type: 'true-false',
        score: newState.score,
        totalQuestions: quizState.questions.length
      });
      
      saveQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'true-false',
        score: newState.score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions.map((q, i) => ({
          statement: q.statement,
          userAnswer: i === quizState.currentQuestion ? answer : false,
          correctAnswer: q.correctAnswer,
          isCorrect: i === quizState.currentQuestion ? isCorrect : false
        }))
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
    setError(null);
  };

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    quizState,
    handleQuizSubmit,
    handleAnswer,
    resetQuiz
  };
}