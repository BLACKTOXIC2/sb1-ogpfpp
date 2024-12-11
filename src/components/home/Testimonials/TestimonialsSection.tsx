import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import TestimonialList from './TestimonialList';

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquareQuote className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Loved by Educators Worldwide
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of educators who are transforming their teaching experience with our AI-powered quiz generation platform
          </p>
        </div>
        <TestimonialList />
      </div>
    </section>
  );
};

export default TestimonialsSection;