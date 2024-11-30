import React, { forwardRef } from 'react';
import { TrueFalseQuestion } from '../../types/trueFalse';
import { CheckCircle, XCircle } from 'lucide-react';

interface TrueFalseResultsProps {
  score: number;
  questions: TrueFalseQuestion[];
  answers: boolean[];
}

const TrueFalseResults = forwardRef<HTMLDivElement, TrueFalseResultsProps>(
  ({ score, questions, answers }, ref) => {
    return (
      <div ref={ref} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">Quiz Complete! 🎉</h2>
          <p className="text-xl">Final Score: {score}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Question Review:</h3>
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.isTrue;
            return (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-2">
                      {index + 1}. {question.statement}
                    </p>
                    <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {answers[index] ? 'True' : 'False'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">
                        Correct answer: {question.isTrue ? 'True' : 'False'}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      {question.explanation}
                    </p>
                  </div>
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TrueFalseResults.displayName = 'TrueFalseResults';

export default TrueFalseResults;