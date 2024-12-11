import { useState } from 'react';
import { Question, QuizState } from '../types';
import { saveQuizToHistory } from '../utils/storage';
import { useAnalytics } from './useAnalytics';
import { VideoSummary } from '../types/video';

export function useVideoQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = (questions: Question[]) => {
    if (!videoSummary) return;
    
    trackEvent('QUIZ_START', { 
      type: 'video', 
      questionCount: questions.length,
      videoTitle: videoSummary.videoDetails.title
    });

    setQuizState({
      questions,
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
  };

  const handleAnswer = (answer: string) => {
    if (!videoSummary) return;

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
        type: 'video',
        score: newState.score,
        totalQuestions: quizState.questions.length,
        videoTitle: videoSummary.videoDetails.title
      });
      
      saveQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'video',
        score: newState.score,
        totalQuestions: quizState.questions.length,
        videoTitle: videoSummary.videoDetails.title,
        videoDetails: videoSummary.videoDetails,
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
    setVideoSummary(null);
    setError(null);
  };

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    quizState,
    videoSummary,
    setVideoSummary,
    handleQuizSubmit,
    handleAnswer,
    resetQuiz
  };
}