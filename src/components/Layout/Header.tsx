import React from 'react';
import { Brain } from 'lucide-react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link to="/" className="flex items-center justify-center sm:justify-start gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">MCQGEN</h1>
              <p className="text-xs text-gray-600">AI-Powered Quiz Platform</p>
            </div>
          </Link>
          
          <Navigation />
        </div>
      </div>
    </header>
  );
}

export default Header;