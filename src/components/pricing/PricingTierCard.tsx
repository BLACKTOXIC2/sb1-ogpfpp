import React from 'react';
import { Check } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'solid' | 'outline';
  popular?: boolean;
}

const PricingTierCard: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  buttonText,
  buttonVariant,
  popular
}) => {
  const { handlePayment, isProcessing, error } = usePayment();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (name === 'Free') {
      navigate('/text-quiz');
      return;
    }

    if (!user) {
      navigate('/auth/signin', { state: { from: '/pricing' } });
      return;
    }

    try {
      const result = await handlePayment(name, parseInt(price));
      if (result.success) {
        // Handle successful payment
        navigate('/profile');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
        popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-600 ml-2">/month</span>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <button
          onClick={handleClick}
          disabled={isProcessing}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            buttonVariant === 'solid'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing...' : buttonText}
        </button>
        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingTierCard;