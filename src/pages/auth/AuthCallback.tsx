import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react'; // Ensure this package is installed
import { GoogleAuthProvider } from '../../services/auth/providers/GoogleAuthProvider';

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        await GoogleAuthProvider.handleCallback();
        // Redirect to home on success
        window.location.replace('https://mcqgen.xyz/'); // Redirect to the production domain
      } catch (err) {
        console.error('Auth callback error:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        // Redirect to sign-in after showing error
        setTimeout(() => {
          window.location.replace('https://mcqgen.xyz/auth/signin'); // Redirect to the sign-in page
        }, 3000);
      }
    }

    handleAuthCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-600 mb-4" aria-live="assertive">
            {error}
          </div>
          <div className="text-gray-600">Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-gray-600" aria-live="polite">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
