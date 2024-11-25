import React, { useState } from 'react';
import { Brain, Minus, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { generateQuestionsFromText } from '../services/api';

interface QuizFormProps {
  onSubmit: (questions: any[]) => void;
  isLoading: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      alert('Please enter at least 50 characters of text to generate meaningful questions.');
      return;
    }
    try {
      const questions = await generateQuestionsFromText(text, numQuestions);
      onSubmit(questions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate quiz';
      alert(message);
    }
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

  const handleQuizGenerated = (questions: any[]) => {
    onSubmit(questions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }

          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .progress-ring {
            position: absolute;
            inset: -8px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .brain-icon {
            animation: wave 2s ease-in-out infinite;
          }

          .brain-container {
            position: relative;
            width: 24px;
            height: 24px;
          }

          .brain-pulse {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>

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

        <ImageUpload 
          onTextExtracted={handleTextExtracted} 
          numQuestions={numQuestions}
          onQuizGenerated={handleQuizGenerated}
        />
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
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <div className="brain-container">
          {isLoading ? (
            <>
              <div className="brain-pulse" />
              <div className="progress-ring" />
              <Brain className="brain-icon relative z-10 w-6 h-6" />
            </>
          ) : (
            <Brain className="w-6 h-6" />
          )}
        </div>
        <span className="min-w-[120px] text-center">
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
        </span>
      </button>
    </form>
  );
};

export default QuizForm;