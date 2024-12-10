import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TextQuiz from './pages/TextQuiz';
import VideoQuiz from './pages/VideoQuiz';
import TrueFalseQuiz from './pages/TrueFalseQuiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<TextQuiz />} />
              <Route path="/video" element={<VideoQuiz />} />
              <Route path="/true-false" element={<TrueFalseQuiz />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;