import React from 'react';
import { Award, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getQuizHistory } from '../../utils/storage';

const TrueFalseHistory: React.FC = () => {
  const history = getQuizHistory().filter(entry => entry.type === 'true-false');

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No True/False quiz history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Quiz History</h2>
      <div className="space-y-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  {new Date(entry.date).toLocaleDateString()} at{' '}
                  {new Date(entry.date).toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">
                    Score: {entry.score} / {entry.totalQuestions * 2}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {entry.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {q.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-gray-800">{q.statement}</p>
                      <div className="text-sm mt-1">
                        <p className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          Your answer: {q.userAnswer ? 'True' : 'False'}
                        </p>
                        {!q.isCorrect && (
                          <p className="text-green-600">
                            Correct answer: {q.correctAnswer ? 'True' : 'False'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrueFalseHistory;