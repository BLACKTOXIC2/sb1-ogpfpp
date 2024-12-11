import React from 'react';
import { LogOut } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';

export const LogoutButton: React.FC = () => {
  const { handleLogout, isLoading } = useLogout();

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Sign Out
    </button>
  );
};