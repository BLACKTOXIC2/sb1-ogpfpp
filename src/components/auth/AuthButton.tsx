import React from 'react';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserMenu } from './UserMenu';

export const AuthButton: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <UserMenu />;
  }

  return (
    <Link
      to="/auth/signin"
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
    >
      <LogIn className="w-5 h-5" />
      <span>Sign In</span>
    </Link>
  );
};