import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuestionQuantityProps {
  quantity: number;
  onChange: (value: number) => void;
}

const QuestionQuantity: React.FC<QuestionQuantityProps> = ({ quantity, onChange }) => {
  const decrementQuestions = () => {
    onChange(Math.max(1, quantity - 1));
  };

  const incrementQuestions = () => {
    onChange(Math.min(10, quantity + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10, Math.max(1, Number(e.target.value)));
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Number of questions
      </label>
      <div className="inline-flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
        <button
          type="button"
          onClick={decrementQuestions}
          disabled={quantity <= 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="relative w-20">
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full py-1 px-2 text-center text-sm font-medium border-0 focus:ring-0"
          />
        </div>

        <button
          type="button"
          onClick={incrementQuestions}
          disabled={quantity >= 10}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="text-xs text-gray-500">Choose between 1-10 questions</div>
    </div>
  );
};

export default QuestionQuantity;