import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import TrueFalseQuizForm from '../components/trueFalse/TrueFalseQuizForm';
import TrueFalseGame from '../components/TrueFalse/TrueFalseGame';
import TrueFalseHistory from '../components/TrueFalse/TrueFalseHistory';
import { useTrueFalseQuiz } from '../hooks/useTrueFalseQuiz';

function TrueFalseQuiz() {
  const {
    isLoading,
    error,
    quizState,
    handleQuizSubmit,
    handleAnswer,
    resetQuiz
  } = useTrueFalseQuiz();
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckSquare className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            True/False Generator
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Generate True/False questions from text, images, or videos
        </p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {error && (
          <div className="w-full max-w-2xl mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {quizState.questions.length === 0 ? (
          <div className="w-full max-w-2xl space-y-8">
            <TrueFalseQuizForm
              onSubmit={handleQuizSubmit}
              isLoading={isLoading}
              numQuestions={numQuestions}
              onNumQuestionsChange={setNumQuestions}
            />
            <div className="mt-8 sm:mt-12">
              <TrueFalseHistory />
            </div>
          </div>
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