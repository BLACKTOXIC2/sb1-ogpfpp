import React, { forwardRef } from 'react';
import { Award, RotateCcw, Download } from 'lucide-react';
import { Question } from '../../types';

interface QuizResultsProps {
  score: number;
  questions: Question[];
  onReset: () => void;
  onDownloadPDF: () => void;
}

const QuizResults = forwardRef<HTMLDivElement, QuizResultsProps>(
  ({ score, questions, onReset, onDownloadPDF }, ref) => {
    const maxScore = questions.length * 4;
    const percentage = (score / maxScore) * 100;

    return (
      <div ref={ref} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">
            You scored {score} out of {maxScore} points
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-2 text-gray-600">{Math.round(percentage)}% Correct</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Question Review</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 space-y-2"
            >
              <p className="font-medium text-gray-800">
                {index + 1}. {question.question}
              </p>
              <p className="text-green-600">
                Correct Answer: {question.correctAnswer}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }
);

QuizResults.displayName = 'QuizResults';

export default QuizResults;