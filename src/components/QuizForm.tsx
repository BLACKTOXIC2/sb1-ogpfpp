import React, { useState } from 'react';
import { Brain, Minus, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface QuizFormProps {
  onSubmit: (text: string, numQuestions: number) => void;
  isLoading: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      alert('Please enter at least 50 characters of text to generate meaningful questions.');
      return;
    }
    onSubmit(text, numQuestions);
  };

  const decrementQuestions = () => {
    setNumQuestions((prev) => Math.max(1, prev - 1));
  };

  const incrementQuestions = () => {
    setNumQuestions((prev) => Math.min(10, prev + 1));
  };

  const handleTextExtracted = (extractedText: string) => {
    setText(extractedText);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text (minimum 50 characters)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your text here (at least 50 characters)..."
            required
            minLength={50}
          />
          <div className="mt-1 text-sm text-gray-500">
            {text.length}/50 characters minimum
          </div>
        </div>

        <ImageUpload onTextExtracted={handleTextExtracted} />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of questions
        </label>
        <div className="inline-flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
          <button
            type="button"
            onClick={decrementQuestions}
            disabled={numQuestions <= 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="relative w-20">
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))}
              min="1"
              max="10"
              className="w-full py-1 px-2 text-center text-sm font-medium border-0 focus:ring-0"
            />
          </div>

          <button
            type="button"
            onClick={incrementQuestions}
            disabled={numQuestions >= 10}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500">Choose between 1-10 questions</div>
      </div>

      <button
        type="submit"
        disabled={isLoading || text.length < 50}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Brain className="animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            <Brain />
            Generate Quiz
          </>
        )}
      </button>
    </form>
  );
};

export default QuizForm;