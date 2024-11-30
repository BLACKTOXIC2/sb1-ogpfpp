import React, { useState } from 'react';
import { Youtube, Loader2 } from 'lucide-react';
import { summarizeVideo } from '../../services/api';
import { extractVideoId } from '../../services/youtube.service';
import { VideoSummary } from '../../types/video';

interface VideoSummarizerProps {
  onSummaryGenerated: (summary: VideoSummary) => void;
  isLoading: boolean;
}

const VideoSummarizer: React.FC<VideoSummarizerProps> = ({
  onSummaryGenerated,
  isLoading
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Please enter a valid YouTube video URL or ID');
      }

      const summary = await summarizeVideo(videoId);
      onSummaryGenerated(summary);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to summarize video');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          YouTube Video URL or ID
        </label>
        <div className="relative">
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or video ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
            required
          />
          <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          You can paste a full YouTube URL or just the video ID
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || isProcessing || !videoUrl}
        className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all ${
          isLoading || isProcessing || !videoUrl ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading || isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing Video Content...</span>
          </>
        ) : (
          <>
            <Youtube className="w-5 h-5" />
            <span>Analyze Video</span>
          </>
        )}
      </button>
    </form>
  );
};

export default VideoSummarizer;