import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    if (!showModal) {
      setShowModal(true);
    }
    return (
      <>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
        <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />
      </>
    );
  }

  return <>{children}</>;
};