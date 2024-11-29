import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import QuizForm from '../components/QuizForm';
import QuizGame from '../components/QuizGame';
import HistoryTabs from '../components/History/HistoryTabs';
import { Question, QuizState } from '../types';
import { saveQuizToHistory } from '../utils/storage';

function TextQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = async (questions: Question[]) => {
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
      saveQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">AI MCQ Generator</h1>
        </div>
        <p className="text-gray-600">Generate custom MCQ from text or images using AI</p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {quizState.questions.length === 0 ? (
          <>
            <QuizForm onSubmit={handleQuizSubmit} isLoading={isLoading} />
            <HistoryTabs />
          </>
        ) : (
          <QuizGame
            questions={quizState.questions}
            currentQuestion={quizState.currentQuestion}
            score={quizState.score}
            onAnswer={handleAnswer}
            isComplete={quizState.isComplete}
            onReset={resetQuiz}
          />
        )}
      </main>
    </div>
  );
}

export default TextQuiz;