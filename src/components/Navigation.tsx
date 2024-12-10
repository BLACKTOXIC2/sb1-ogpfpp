import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Youtube, CheckSquare } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: <Brain className="w-5 h-5" />, label: 'Text MCQ' },
    { to: '/video', icon: <Youtube className="w-5 h-5" />, label: 'Video MCQ' },
    { to: '/true-false', icon: <CheckSquare className="w-5 h-5" />, label: 'True/False' },
  ];

  return (
    <nav className="w-full sm:w-auto">
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
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
      </div>
    </nav>
  );
};

export default Navigation;