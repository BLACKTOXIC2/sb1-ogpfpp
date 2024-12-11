import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import ImageUpload from '../ImageUpload/ImageUpload';
import QuestionQuantity from '../QuestionControl/QuestionQuantity';
import { generateTrueFalseQuestions } from '../../services/trueFalseApi';
import { TrueFalseQuestion } from '../../types/trueFalse';

interface TrueFalseQuizFormProps {
  onSubmit: (questions: TrueFalseQuestion[]) => void;
  isLoading: boolean;
  numQuestions: number;
  onNumQuestionsChange: (num: number) => void;
}

const TrueFalseQuizForm: React.FC<TrueFalseQuizFormProps> = ({
  onSubmit,
  isLoading,
  numQuestions,
  onNumQuestionsChange
}) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters of text to generate meaningful questions.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const questions = await generateTrueFalseQuestions(text, numQuestions);
      onSubmit(questions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextExtracted = (extractedText: string) => {
    setText(prev => prev + (prev ? '\n\n' : '') + extractedText);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text (minimum 50 characters)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
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
          onQuizGenerated={() => {}}
          isGenerating={isGenerating}
        />

        <QuestionQuantity
          quantity={numQuestions}
          onChange={onNumQuestionsChange}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || text.length < 50 || isGenerating}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Brain className="w-5 h-5" />
        <span>
          {isLoading || isGenerating ? 'Generating Questions...' : 'Generate True/False Questions'}
        </span>
      </button>
    </form>
  );
};

export default TrueFalseQuizForm;