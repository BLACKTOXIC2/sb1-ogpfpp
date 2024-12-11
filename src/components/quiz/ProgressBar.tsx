import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, score }) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-600">
          Question {current + 1} of {total}
        </span>
        <span className="font-medium text-gray-600">Score: {score}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;