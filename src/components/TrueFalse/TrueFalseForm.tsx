import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import ImageUpload from '../ImageUpload/ImageUpload';
import VideoSummarizer from '../Video/VideoSummarizer';
import { generateTrueFalseQuestions } from '../../services/trueFalseApi';
import { TrueFalseQuestion } from '../../types/trueFalse';
import { VideoSummary } from '../../types/video';

interface TrueFalseFormProps {
  onSubmit: (questions: TrueFalseQuestion[]) => void;
  isLoading: boolean;
  numQuestions: number;
}

const TrueFalseForm: React.FC<TrueFalseFormProps> = ({
  onSubmit,
  isLoading,
  numQuestions,
}) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'image' | 'video'>('text');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 50) {
      alert('Please enter at least 50 characters of text to generate meaningful questions.');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateTrueFalseQuestions(text, numQuestions);
      onSubmit(questions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate quiz';
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextExtracted = (extractedText: string) => {
    setText(prev => prev + (prev ? '\n\n' : '') + extractedText);
  };

  const handleVideoSummary = (summary: VideoSummary) => {
    setText(summary.summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
        {(['text', 'image', 'video'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setInputType(type)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              inputType === type
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inputType === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text (minimum 50 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your text here..."
              required
              minLength={50}
            />
          </div>
        )}

        {inputType === 'image' && (
          <ImageUpload
            onTextExtracted={handleTextExtracted}
            numQuestions={numQuestions}
            onQuizGenerated={() => {}}
            isGenerating={isGenerating}
          />
        )}

        {inputType === 'video' && (
          <VideoSummarizer
            onSummaryGenerated={handleVideoSummary}
            isLoading={isLoading}
          />
        )}

        <button
          type="submit"
          disabled={isLoading || text.length < 50 || isGenerating}
          className={`w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all ${
            isLoading || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Brain className="w-6 h-6" />
          <span>Generate True/False Questions</span>
        </button>
      </form>
    </div>
  );
};

export default TrueFalseForm;