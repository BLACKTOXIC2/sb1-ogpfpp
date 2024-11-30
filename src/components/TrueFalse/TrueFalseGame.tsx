import React, { useState, useEffect } from 'react';
import { TrueFalseQuestion } from '../../types/trueFalse';
import Confetti from 'react-confetti';
import { Download, Share2, ArrowRight, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import TrueFalseResults from './TrueFalseResults';

interface TrueFalseGameProps {
  questions: TrueFalseQuestion[];
  currentQuestion: number;
  score: number;
  onAnswer: (answer: boolean) => void;
  isComplete: boolean;
  onReset: () => void;
}

const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  questions,
  currentQuestion,
  score,
  onAnswer,
  isComplete,
  onReset,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  
  const { toPDF } = usePDF({
    targetRef: resultsRef,
    filename: 'true-false-results.pdf',
    options: {
      format: 'a4',
      margin: 20
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

  const handleAnswerClick = (answer: boolean) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedAnswer!);
    setShowNextButton(false);
  };

  const generateShareText = () => {
    return `🎯 True/False Quiz Results: ${score} points!\n\n${questions.map((q, index) => 
      `Q${index + 1}: ${q.statement}\n` +
      `✍️ Your answer: ${selectedAnswer ? 'True' : 'False'}\n` +
      `${selectedAnswer === q.isTrue ? '✅ Correct!' : `❌ Correct answer: ${q.isTrue ? 'True' : 'False'}`}\n` +
      `📝 ${q.explanation}\n`
    ).join('\n')}`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My True/False Quiz Results',
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
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardErr) {
        console.error('Failed to copy to clipboard:', clipboardErr);
        alert('Unable to share or copy results. Please try again.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await toPDF();
    } catch (error) {
      console.error('PDF generation error:', error);
      setPdfError(true);
      setTimeout(() => setPdfError(false), 3000);
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
        
        <TrueFalseResults
          ref={resultsRef}
          score={score}
          questions={questions}
          answers={questions.map(q => q.isTrue)}
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
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl space-y-6">
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">{question.statement}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswerClick(true)}
            disabled={showFeedback}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
              showFeedback
                ? selectedAnswer === true
                  ? question.isTrue
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : 'border-gray-300 text-gray-500'
                : selectedAnswer === true
                ? 'bg-blue-50 border-blue-500'
                : 'border-gray-300 hover:bg-blue-50 hover:border-blue-500'
            }`}
          >
            <ThumbsUp className="w-6 h-6" />
            <span className="font-medium">True</span>
          </button>
          
          <button
            onClick={() => handleAnswerClick(false)}
            disabled={showFeedback}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
              showFeedback
                ? selectedAnswer === false
                  ? !question.isTrue
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : 'border-gray-300 text-gray-500'
                : selectedAnswer === false
                ? 'bg-blue-50 border-blue-500'
                : 'border-gray-300 hover:bg-blue-50 hover:border-blue-500'
            }`}
          >
            <ThumbsDown className="w-6 h-6" />
            <span className="font-medium">False</span>
          </button>
        </div>

        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            selectedAnswer === question.isTrue
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium">{question.explanation}</p>
          </div>
        )}

        {showNextButton && (
          <button
            onClick={handleNextQuestion}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Next Question
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrueFalseGame;