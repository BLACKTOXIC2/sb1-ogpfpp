import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import TextQuiz from '../pages/TextQuiz';
import VideoQuiz from '../pages/VideoQuiz';
import TrueFalseQuiz from '../pages/TrueFalseQuiz';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AuthCallback from '../pages/auth/AuthCallback';
import Profile from '../pages/Profile';
import Pricing from '../pages/Pricing';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth/signin',
    element: <SignIn />
  },
  {
    path: '/auth/signup',
    element: <SignUp />
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  },
  {
    path: '/pricing',
    element: <Pricing />
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/text-quiz',
    element: <ProtectedRoute><TextQuiz /></ProtectedRoute>
  },
  {
    path: '/video',
    element: <ProtectedRoute><VideoQuiz /></ProtectedRoute>
  },
  {
    path: '/true-false',
    element: <ProtectedRoute><TrueFalseQuiz /></ProtectedRoute>
  }
];