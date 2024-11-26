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
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-6px) rotate(-5deg); }
            75% { transform: translateY(6px) rotate(5deg); }
          }

          @keyframes pulse-ring {
            0% { transform: scale(0.7); opacity: 0.3; }
            50% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(0.7); opacity: 0.3; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .brain-container {
            position: relative;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .brain-icon {
            position: relative;
            z-index: 10;
          }

          .brain-icon.loading {
            animation: float 3s ease-in-out infinite;
          }

          .pulse-ring {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
          }

          .spin-ring {
            position: absolute;
            inset: -12px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .loading-button {
            position: relative;
            overflow: hidden;
          }

          .loading-button::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
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
        className={`w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed relative ${
          isLoading ? 'loading-button bg-blue-500' : 'disabled:bg-blue-400'
        }`}
      >
        <div className="brain-container">
          {isLoading && (
            <>
              <div className="pulse-ring"></div>
              <div className="spin-ring"></div>
            </>
          )}
          <Brain className={`brain-icon w-6 h-6 ${isLoading ? 'loading' : ''}`} />
        </div>
        <span className="min-w-[120px] text-center relative z-10">
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
        </span>
      </button>
    </form>
  );
};

export default QuizForm;