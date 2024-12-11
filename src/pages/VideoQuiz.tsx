import React, { useState } from 'react';
import { Youtube } from 'lucide-react';
import VideoQuizForm from '../components/video/VideoQuizForm';
import QuizGame from '../components/quiz/QuizGame';
import { useVideoQuiz } from '../hooks/useVideoQuiz';
import VideoQuizHistory from '../components/History/VideoQuizHistory';

function VideoQuiz() {
  const {
    isLoading,
    error,
    quizState,
    videoSummary,
    handleQuizSubmit,
    handleAnswer,
    resetQuiz
  } = useVideoQuiz();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Youtube className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Video MCQ Generator
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Generate MCQs from YouTube video content
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
            <VideoQuizForm 
              onSubmit={handleQuizSubmit}
              isLoading={isLoading}
            />
            <div className="mt-8 sm:mt-12">
              <VideoQuizHistory onSelectQuiz={() => {}} />
            </div>
          </div>
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

export default VideoQuiz;