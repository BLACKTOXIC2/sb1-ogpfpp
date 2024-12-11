import React, { useState } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';
import { AuthButton } from '../auth/AuthButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              <Brain className="w-8 h-8 text-blue-600" />
              <div className="hidden xs:block">
                <h1 className="text-xl font-bold text-gray-800 leading-none">MCQGEN</h1>
                <p className="text-xs text-gray-600">AI-Powered Quiz Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-between md:flex-1 md:ml-10">
            <div className="flex-1">
              <Navigation />
            </div>
            <div className="ml-4">
              <AuthButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <AuthButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <Navigation mobile onNavClick={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;