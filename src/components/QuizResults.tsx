import React, { forwardRef } from 'react';
import { AnswerHistory } from '../types';

interface QuizResultsProps {
  score: number;
  answerHistory: AnswerHistory[];
}

const QuizResults = forwardRef<HTMLDivElement, QuizResultsProps>(
  ({ score, answerHistory }, ref) => {
    return (
      <div ref={ref} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">MCQ Complete! 🎉</h2>
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
    );
  }
);

QuizResults.displayName = 'QuizResults';

export default QuizResults;