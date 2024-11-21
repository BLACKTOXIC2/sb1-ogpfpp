import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import QuizForm from './components/QuizForm';
import QuizGame from './components/QuizGame';
import { generateQuestions } from './services/api';
import { Question, QuizState } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = async (text: string, numQuestions: number) => {
    setError(null);
    try {
      setIsLoading(true);
      const questions = await generateQuestions(text, numQuestions);
      setQuizState({
        questions,
        currentQuestion: 0,
        score: 0,
        isComplete: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate quiz';
      setError(message);
      console.error('Quiz generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const scoreChange = isCorrect ? 4 : -1;

    setQuizState((prev) => ({
      ...prev,
      score: prev.score + scoreChange,
      currentQuestion: prev.currentQuestion + 1,
      isComplete: prev.currentQuestion + 1 >= prev.questions.length,
    }));
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Quiz Generator</h1>
          </div>
          <p className="text-gray-600">Generate custom quizzes from any text using AI</p>
        </header>

        <main className="flex flex-col items-center justify-center">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {quizState.questions.length === 0 ? (
            <QuizForm onSubmit={handleQuizSubmit} isLoading={isLoading} />
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
    </div>
  );
}

export default App;