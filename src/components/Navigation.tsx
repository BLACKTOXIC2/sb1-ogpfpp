import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Youtube, CheckSquare } from 'lucide-react';

interface NavigationProps {
  mobile?: boolean;
  onNavClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ mobile, onNavClick }) => {
  const navItems = [
    { to: '/text-quiz', icon: <Brain className="w-5 h-5" />, label: 'Text MCQ' },
    { to: '/video', icon: <Youtube className="w-5 h-5" />, label: 'Video MCQ' },
    { to: '/true-false', icon: <CheckSquare className="w-5 h-5" />, label: 'True/False' },
  ];

  return (
    <nav className={`${mobile ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}`}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${mobile ? 'w-full' : ''}
            ${isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;