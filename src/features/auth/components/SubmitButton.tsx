import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
  text: string;
  Icon: LucideIcon;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, text, Icon }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      <>
        <Icon className="w-5 h-5" />
        {text}
      </>
    )}
  </button>
);