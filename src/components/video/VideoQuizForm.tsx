import React, { useState } from 'react';
import { Youtube, Brain } from 'lucide-react';
import VideoSummarizer from './VideoSummarizer';
import QuestionQuantity from '../QuestionControl/QuestionQuantity';
import { VideoSummary } from '../../types/video';
import { generateQuestionsFromText } from '../../services/api';

interface VideoQuizFormProps {
  onSubmit: (questions: any[]) => void;
  isLoading: boolean;
}

const VideoQuizForm: React.FC<VideoQuizFormProps> = ({ onSubmit, isLoading }) => {
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummaryGenerated = (summary: VideoSummary) => {
    setVideoSummary(summary);
    setError(null);
  };

  const handleGenerateQuiz = async () => {
    if (!videoSummary) {
      setError('Please generate a video summary first');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateQuestionsFromText(videoSummary.summary, numQuestions);
      onSubmit(questions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <VideoSummarizer 
        onSummaryGenerated={handleSummaryGenerated}
        isLoading={isLoading}
      />

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {videoSummary && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {videoSummary.videoDetails.title}
            </h3>
            <p className="text-gray-600 text-sm">
              Channel: {videoSummary.videoDetails.channelTitle}
            </p>
          </div>

          <QuestionQuantity 
            quantity={numQuestions} 
            onChange={setNumQuestions} 
          />

          <button
            onClick={handleGenerateQuiz}
            disabled={isLoading || isGenerating}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-5 h-5" />
            <span>
              {isLoading || isGenerating ? 'Generating MCQ...' : 'Generate MCQ from Summary'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoQuizForm;