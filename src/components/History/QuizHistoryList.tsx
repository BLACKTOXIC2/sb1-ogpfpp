import React, { useState } from 'react';
import { getQuizHistory, clearQuizHistory } from '../../utils/storage';
import { Trash2, ChevronRight, Award, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { QuizHistoryEntry } from '../../types/history';

const QuizHistoryList: React.FC = () => {
  const [history, setHistory] = React.useState(getQuizHistory());
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistoryEntry | null>(null);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all quiz history?')) {
      clearQuizHistory();
      setHistory([]);
      setSelectedQuiz(null);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No quiz history available
      </div>
    );
  }

  if (selectedQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to History
          </button>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">
              Final Score: {selectedQuiz.score} / {selectedQuiz.totalQuestions * 4}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Quiz from {new Date(selectedQuiz.date).toLocaleDateString()} at{' '}
            {new Date(selectedQuiz.date).toLocaleTimeString()}
          </h3>

          <div className="space-y-6">
            {selectedQuiz.questions.map((q, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-3">
                      Question {index + 1}: {q.question}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 min-w-[100px]">Your answer:</span>
                        <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {q.userAnswer || '(No answer provided)'}
                        </span>
                      </div>
                      {!q.isCorrect && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-600 min-w-[100px]">Correct answer:</span>
                          <span className="text-green-600">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    {q.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Quiz History</h2>
        <button
          onClick={handleClearHistory}
          className="text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedQuiz(entry)}
            className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all hover:border-blue-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()} at{' '}
                  {new Date(entry.date).toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">
                    Score: {entry.score} / {entry.totalQuestions * 4}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizHistoryList;