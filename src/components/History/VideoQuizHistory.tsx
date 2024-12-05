import React from 'react';
import { Award, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { QuizHistoryEntry } from '../../types/history';
import { getQuizHistory } from '../../utils/storage';

interface VideoQuizHistoryProps {
  onSelectQuiz: (quiz: QuizHistoryEntry) => void;
}

const VideoQuizHistory: React.FC<VideoQuizHistoryProps> = ({ onSelectQuiz }) => {
  const history = getQuizHistory().filter(entry => entry.type === 'video');

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No video quiz history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Video Quiz History</h2>
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => onSelectQuiz(entry)}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()} at{' '}
                    {new Date(entry.date).toLocaleTimeString()}
                  </div>
                  <div className="font-medium text-gray-800">
                    {entry.videoTitle}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">
                      Score: {entry.score} / {entry.totalQuestions * 4}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Question Summary:</h3>
              <div className="space-y-2">
                {entry.questions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {q.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <p className="text-gray-700 font-medium">Q{idx + 1}: {q.question}</p>
                      <p className={`${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {q.userAnswer || '(No answer)'}
                      </p>
                      {!q.isCorrect && (
                        <p className="text-green-600">
                          Correct answer: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoQuizHistory;