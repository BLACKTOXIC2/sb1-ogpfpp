import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from '../../services/auth/providers/GoogleAuthProvider';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    async function handleAuthRedirect() {
      try {
        await GoogleAuthProvider.handleRedirect();
        navigate('/');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => navigate('/auth/signin'), 3000);
      }
    }

    handleAuthRedirect();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <div className="text-gray-600">Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}