import React from 'react';
import { Clock } from 'lucide-react';

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ isYearly, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-12">
      <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-lg">
        <button
          onClick={() => onToggle(false)}
          className={`px-4 py-2 rounded-md transition-all ${
            !isYearly
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-4 py-2 rounded-md transition-all ${
            isYearly
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Yearly
        </button>
      </div>
      {isYearly && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Save 20% with yearly billing</span>
        </div>
      )}
    </div>
  );
};

export default PricingToggle;