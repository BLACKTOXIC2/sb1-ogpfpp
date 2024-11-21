import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import Confetti from 'react-confetti';

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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [currentQuestion]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setTimeout(() => {
      onAnswer(answer);
    }, 1500);
  };

  if (isComplete) {
    return (
      <div className="text-center space-y-6">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
        <h2 className="text-3xl font-bold text-gray-800">Quiz Complete! 🎉</h2>
        <p className="text-xl">Final Score: {score}</p>
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Start New Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl space-y-6 px-4 sm:px-0">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors ";
            
            if (showFeedback) {
              if (option === question.correctAnswer) {
                buttonClass += "bg-green-100 border-green-500 text-green-800";
              } else if (option === selectedAnswer && option !== question.correctAnswer) {
                buttonClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                buttonClass += "border-gray-300 text-gray-500";
              }
            } else if (option === selectedAnswer) {
              buttonClass += "bg-blue-50 border-blue-500";
            } else {
              buttonClass += "border-gray-300 hover:bg-blue-50 hover:border-blue-500 active:bg-blue-100";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;