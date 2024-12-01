import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TextQuiz from './pages/TextQuiz';
import VideoQuiz from './pages/VideoQuiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TextQuiz />} />
            <Route path="/video" element={<VideoQuiz />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;