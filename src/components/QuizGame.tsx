import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import Confetti from 'react-confetti';
import { Download, Share2, ArrowRight, Copy, Check } from 'lucide-react';
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
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { toPDF } = usePDF({
    targetRef: resultsRef,
    filename: 'quiz-results.pdf',
    options: {
      format: 'a4',
      margin: 20
    },
    onError: (error) => {
      console.error('PDF generation error:', error);
      setPdfError(true);
      alert('Failed to generate PDF. Please try again.');
    }
  });
  
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

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (pdfError) {
      const timer = setTimeout(() => setPdfError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pdfError]);

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

  const generateShareText = () => {
    return `🎯 MCQ Results: ${score} points!\n\n${answerHistory.map((answer, index) => 
      `Q${index + 1}: ${answer.question}\n` +
      `✍️ Your answer: ${answer.userAnswer}\n` +
      `${answer.isCorrect ? '✅ Correct!' : `❌ Correct answer: ${answer.correctAnswer}`}\n`
    ).join('\n')}`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My MCQ Results',
          text: shareText,
          url: window.location.href
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
      } catch (clipboardErr) {
        console.error('Failed to copy to clipboard:', clipboardErr);
        alert('Unable to share or copy results. Please try again.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) {
      console.error('Results ref not available');
      return;
    }

    try {
      await toPDF();
    } catch (error) {
      console.error('PDF generation error:', error);
      setPdfError(true);
      alert('Failed to generate PDF. Please try again.');
    }
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
        
        <QuizResults
          ref={resultsRef}
          score={score}
          answerHistory={answerHistory}
        />

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                {navigator.share ? <Share2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {navigator.share ? 'Share Results' : 'Copy Results'}
              </>
            )}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={pdfError}
            className={`flex items-center gap-2 ${
              pdfError 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
          >
            <Download className="w-4 h-4" />
            {pdfError ? 'Try again in a moment' : 'Download PDF'}
          </button>
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start New MCQ
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