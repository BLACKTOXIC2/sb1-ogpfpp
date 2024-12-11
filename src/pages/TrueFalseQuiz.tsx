import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import QuestionQuantity from '../components/QuestionControl/QuestionQuantity';
import { TrueFalseQuestion } from '../types/trueFalse';
import TrueFalseGame from '../components/TrueFalse/TrueFalseGame';
import TrueFalseForm from '../components/TrueFalse/TrueFalseForm';
import TrueFalseHistory from '../components/TrueFalse/TrueFalseHistory';
import { saveQuizToHistory } from '../utils/storage';
import { TrueFalseHistoryEntry } from '../types/history';

function TrueFalseQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizState, setQuizState] = useState<{
    questions: TrueFalseQuestion[];
    currentQuestion: number;
    score: number;
    isComplete: boolean;
  }>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = (questions: TrueFalseQuestion[]) => {
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
      const historyEntry: TrueFalseHistoryEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        type: 'true-false',
        score: newState.score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions.map((q, i) => ({
          statement: q.statement,
          userAnswer: i === quizState.currentQuestion ? answer : false,
          correctAnswer: q.correctAnswer,
          isCorrect: i === quizState.currentQuestion ? isCorrect : false,
        })),
      };
      saveQuizToHistory(historyEntry);
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
          <h1 className="text-4xl font-bold text-gray-800">True/False Generator</h1>
        </div>
        <p className="text-gray-600">Generate True/False questions from text, images, or videos</p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {quizState.questions.length === 0 ? (
          <>
            <div className="w-full max-w-2xl space-y-6">
              <TrueFalseForm
                onSubmit={handleQuizSubmit}
                isLoading={isLoading}
                numQuestions={numQuestions}
              />
              <QuestionQuantity
                quantity={numQuestions}
                onChange={setNumQuestions}
              />
            </div>
            <div className="w-full max-w-2xl mt-8">
              <TrueFalseHistory />
            </div>
          </>
        ) : (
          <TrueFalseGame
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

export default TrueFalseQuiz;