import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import Confetti from 'react-confetti';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import QuizResults from './QuizResults';

interface QuizGameProps {
  questions: Question[];
  currentQuestion: number;
  score: number;
  onAnswer: (answer: string) => void;
  isComplete: boolean;
  onReset: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({
  questions,
  currentQuestion,
  score,
  onAnswer,
  isComplete,
  onReset,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: 'quiz-results.pdf' });

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowNextButton(false);
  }, [currentQuestion]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedAnswer!);
    setShowNextButton(false);
  };

  if (isComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
        
        <QuizResults
          ref={targetRef}
          score={score}
          questions={questions}
          onReset={onReset}
          onDownloadPDF={toPDF}
        />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-medium text-gray-600">Score: {score}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={showFeedback}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  showFeedback
                    ? option === question.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : option === selectedAnswer
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'border-gray-300 text-gray-500'
                    : option === selectedAnswer
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-300 hover:bg-blue-50 hover:border-blue-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showNextButton && (
            <button
              onClick={handleNextQuestion}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Next Question
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;