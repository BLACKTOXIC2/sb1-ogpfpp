import { useState } from 'react';
import { Question, QuizState } from '../types';
import { saveQuizToHistory } from '../utils/storage';
import { useAnalytics } from './useAnalytics';

export function useQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = (questions: Question[]) => {
    trackEvent('QUIZ_START', { type: 'text', questionCount: questions.length });
    setQuizState({
      questions,
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const scoreChange = isCorrect ? 4 : -1;

    const newState = {
      ...quizState,
      score: quizState.score + scoreChange,
      currentQuestion: quizState.currentQuestion + 1,
      isComplete: quizState.currentQuestion + 1 >= quizState.questions.length,
    };

    setQuizState(newState);

    if (newState.isComplete) {
      trackEvent('QUIZ_COMPLETE', {
        type: 'text',
        score: newState.score,
        totalQuestions: quizState.questions.length
      });
      
      saveQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'text',
        score: newState.score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions.map((q, i) => ({
          question: q.question,
          userAnswer: i === quizState.currentQuestion ? answer : '',
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