import React from 'react';

interface ErrorMessageProps {
  error?: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {error}
    </div>
  );
};