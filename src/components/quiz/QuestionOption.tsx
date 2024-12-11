import React from 'react';

interface QuestionOptionProps {
  option: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  showFeedback: boolean;
  onClick: () => void;
  disabled: boolean;
}

const QuestionOption: React.FC<QuestionOptionProps> = ({
  option,
  isSelected,
  isCorrect,
  showFeedback,
  onClick,
  disabled
}) => {
  const getButtonClass = () => {
    if (showFeedback) {
      if (isCorrect === true) {
        return 'bg-green-100 border-green-500 text-green-800';
      }
      if (isSelected && isCorrect === false) {
        return 'bg-red-100 border-red-500 text-red-800';
      }
      return 'border-gray-300 text-gray-500';
    }
    
    if (isSelected) {
      return 'bg-blue-50 border-blue-500';
    }
    
    return 'border-gray-300 hover:bg-blue-50 hover:border-blue-500';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${getButtonClass()}`}
    >
      {option}
    </button>
  );
};

export default QuestionOption;