import React, { useState } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';
import { AuthButton } from '../auth/AuthButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Brain className="w-8 h-8 text-blue-600" />
            <div className="hidden xs:block">
              <h1 className="text-xl font-bold text-gray-800">MCQGEN</h1>
              <p className="text-xs text-gray-600">AI-Powered Quiz Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Navigation />
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <Navigation mobile onNavClick={() => setIsMenuOpen(false)} />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;