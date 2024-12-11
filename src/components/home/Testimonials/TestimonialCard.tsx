import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from './types';

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  role,
  image,
  quote,
  rating = 5,
  organization
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="absolute -top-4 -right-4 bg-blue-600 rounded-full p-3 shadow-lg">
          <Quote className="w-6 h-6 text-white" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-600 text-sm">{role}</p>
            {organization && (
              <p className="text-blue-600 text-sm">{organization}</p>
            )}
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>

        <blockquote className="text-gray-700 text-lg leading-relaxed">
          "{quote}"
        </blockquote>
      </div>
    </div>
  );
};

export default TestimonialCard;