import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initializeGA } from './utils/analytics/gtag';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import TextQuiz from './pages/TextQuiz';
import VideoQuiz from './pages/VideoQuiz';
import TrueFalseQuiz from './pages/TrueFalseQuiz';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  useEffect(() => {
    initializeGA();
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/signin" element={<SignIn />} />
                  <Route path="/auth/signup" element={<SignUp />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/text-quiz" element={
                    <ProtectedRoute>
                      <TextQuiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/video" element={
                    <ProtectedRoute>
                      <VideoQuiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/true-false" element={
                    <ProtectedRoute>
                      <TrueFalseQuiz />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;