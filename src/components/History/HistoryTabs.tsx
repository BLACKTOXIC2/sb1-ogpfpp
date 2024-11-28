import React, { useState } from 'react';
import QuizHistoryList from './QuizHistoryList';
import ChatInterface from '../Chat/ChatInterface';

const HistoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'chat'>('quiz');

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'quiz'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quiz History
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Chat
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'quiz' ? <QuizHistoryList /> : <ChatInterface />}
      </div>
    </div>
  );
};

export default HistoryTabs;