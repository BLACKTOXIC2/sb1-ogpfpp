import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { TrueFalseQuestion } from '../../types/trueFalse';
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
  const [answerHistory, setAnswerHistory] = useState<{
    statement: string;
    userAnswer: boolean;
    correctAnswer: boolean;
    isCorrect: boolean;
  }[]>([]);

  if (isComplete) {
    return (
      <TrueFalseResults
        score={score}
        totalQuestions={questions.length}
        answerHistory={answerHistory}
        onReset={onReset}
      />
    );
  }

  const handleAnswer = (answer: boolean) => {
    if (showFeedback) return;
    
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    setAnswerHistory(prev => [...prev, {
      statement: currentQ.statement,
      userAnswer: answer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect
    }]);

    // Show feedback for 2 seconds before moving to next question
    setTimeout(() => {
      onAnswer(answer);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 2000);
  };

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
          {[true, false].map((answer) => {
            let buttonClass = "relative p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 font-semibold ";
            let iconClass = "w-5 h-5 transition-transform duration-300 ";
            
            if (showFeedback) {
              if (answer === question.correctAnswer) {
                buttonClass += "bg-green-50 border-green-500 text-green-700 scale-105 transform";
                iconClass += "text-green-500 animate-bounce";
              } else if (answer === selectedAnswer && answer !== question.correctAnswer) {
                buttonClass += "bg-red-50 border-red-500 text-red-700 scale-95 transform";
                iconClass += "text-red-500 animate-shake";
              } else {
                buttonClass += "border-gray-200 text-gray-400 opacity-50";
              }
            } else if (answer === selectedAnswer) {
              buttonClass += "bg-blue-50 border-blue-500 text-blue-700";
            } else {
              buttonClass += "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700";
            }

            return (
              <button
                key={answer.toString()}
                onClick={() => handleAnswer(answer)}
                disabled={showFeedback}
                className={buttonClass}
              >
                {answer ? (
                  <CheckCircle className={iconClass} />
                ) : (
                  <XCircle className={iconClass} />
                )}
                {answer ? "True" : "False"}
                
                {showFeedback && answer === question.correctAnswer && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`mt-4 p-4 rounded-lg transform transition-all duration-300 ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-50 border border-green-200 scale-105'
              : 'bg-red-50 border border-red-200 scale-100'
          }`}>
            <div className="flex items-center gap-2">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <p className={`font-medium ${
                selectedAnswer === question.correctAnswer
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {selectedAnswer === question.correctAnswer
                  ? 'Correct! Well done!'
                  : `Incorrect. The correct answer is ${question.correctAnswer ? 'True' : 'False'}`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrueFalseGame;