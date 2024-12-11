import React from 'react';
import { VideoSummary as VideoSummaryType } from '../../types/video';
import { Youtube, Users, Target, Book, Code, Lightbulb, Link, List } from 'lucide-react';

interface VideoSummaryProps {
  summary: VideoSummaryType;
}

const VideoSummary: React.FC<VideoSummaryProps> = ({ summary }) => {
  const sections = summary.summary.split(/\d+\.\s+/).filter(Boolean);

  const icons = {
    'Title and Context': <Youtube className="w-5 h-5 text-red-500" />,
    'Introduction': <Users className="w-5 h-5 text-blue-500" />,
    'Main Content Analysis': <Target className="w-5 h-5 text-green-500" />,
    'Technical Details': <Code className="w-5 h-5 text-purple-500" />,
    'Practical Applications': <Book className="w-5 h-5 text-orange-500" />,
    'Key Takeaways': <Lightbulb className="w-5 h-5 text-yellow-500" />,
    'Additional Resources': <Link className="w-5 h-5 text-gray-500" />
  };

  const sectionTitles = [
    'Title and Context',
    'Introduction',
    'Main Content Analysis',
    'Technical Details',
    'Practical Applications',
    'Key Takeaways',
    'Additional Resources'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Video Summary</h2>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-blue-50 rounded-lg">
          <img
            src={summary.videoDetails.thumbnailUrl}
            alt={summary.videoDetails.title}
            className="w-full sm:w-48 rounded-lg shadow-sm"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {summary.videoDetails.title}
            </h3>
            <p className="text-gray-600 mt-1">
              Channel: {summary.videoDetails.channelTitle}
            </p>
            <p className="text-gray-600">
              Duration: {summary.videoDetails.duration}
            </p>
            <p className="text-gray-600">
              Published: {summary.videoDetails.publishedAt}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const title = sectionTitles[index];
            const icon = icons[title as keyof typeof icons];

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {icon}
                  <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="pl-7">
                  {section.split('\n').map((line, i) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    if (trimmedLine.startsWith('-')) {
                      return (
                        <div key={i} className="flex items-start gap-2 mt-1">
                          <List className="w-4 h-4 text-gray-400 mt-1" />
                          <p className="text-gray-700">{trimmedLine.substring(1).trim()}</p>
                        </div>
                      );
                    }

                    return (
                      <p key={i} className="text-gray-700 mt-2">
                        {trimmedLine}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoSummary;