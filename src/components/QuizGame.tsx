import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import Confetti from 'react-confetti';
import { Download, Share2, ArrowRight } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

interface QuizGameProps {
  questions: Question[];
  currentQuestion: number;
  score: number;
  onAnswer: (answer: string) => void;
  isComplete: boolean;
  onReset: () => void;
}

interface AnswerHistory {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
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
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF();
  
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
    setShowNextButton(false);
  }, [currentQuestion]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setShowNextButton(true);
    
    setAnswerHistory(prev => [...prev, {
      question: currentQ.question,
      userAnswer: answer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedAnswer!);
    setShowNextButton(false);
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'My Quiz Results',
        text: `I scored ${score} points in the AI-generated quiz! \n\nTest your knowledge too!`,
        url: window.location.href
      };
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownloadPDF = () => {
    toPDF(resultsRef, {
      filename: 'quiz-results.pdf',
      page: {
        margin: 20,
        format: 'A4'
      }
    });
  };

  if (isComplete) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
        
        <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Quiz Complete! 🎉</h2>
            <p className="text-xl">Final Score: {score}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Question Review:</h3>
            {answerHistory.map((answer, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-800 mb-2">
                  Q{index + 1}: {answer.question}
                </p>
                <p className={`text-sm ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: {answer.userAnswer}
                </p>
                {!answer.isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct answer: {answer.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start New Quiz
          </button>
        </div>
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

        {showNextButton && (
          <button
            onClick={handleNextQuestion}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;