import React from 'react';
import { Award, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import Confetti from 'react-confetti';

interface TrueFalseResultsProps {
  score: number;
  totalQuestions: number;
  answerHistory: {
    statement: string;
    userAnswer: boolean;
    correctAnswer: boolean;
    isCorrect: boolean;
  }[];
  onReset: () => void;
}

const TrueFalseResults: React.FC<TrueFalseResultsProps> = ({
  score,
  totalQuestions,
  answerHistory,
  onReset,
}) => {
  const maxScore = totalQuestions * 2;
  const percentage = (score / maxScore) * 100;

  return (
    <div className="w-full max-w-2xl">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
      />
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">
            You scored {score} out of {maxScore} points
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600">{Math.round(percentage)}% Correct</p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Question Review</h3>
          {answerHistory.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                answer.isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {answer.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                )}
                <div>
                  <p className="text-gray-800 font-medium mb-2">
                    {index + 1}. {answer.statement}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      Your answer: {answer.userAnswer ? 'True' : 'False'}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {answer.correctAnswer ? 'True' : 'False'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Try Another Quiz
        </button>
      </div>
    </div>
  );
};

export default TrueFalseResults;