import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken) {
        try {
          // Send tokens to your backend for secure storage and session management
          const response = await fetch('https://mcqgen.xyz/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Failed to process authentication');
          }

          // Redirect to home on success
          window.location.replace('https://mcqgen.xyz/');
        } catch (error) {
          console.error('Auth callback error:', error);
          setError(error instanceof Error ? error.message : 'Authentication failed');
          // Redirect to sign in after error
          setTimeout(() => {
            window.location.replace('https://mcqgen.xyz/auth/signin');
          }, 3000);
        }
      } else {
        setError('No access token provided');
        setTimeout(() => {
          window.location.replace('https://mcqgen.xyz/auth/signin');
        }, 3000);
      }
    }

    handleAuthCallback();
  }, []);

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
