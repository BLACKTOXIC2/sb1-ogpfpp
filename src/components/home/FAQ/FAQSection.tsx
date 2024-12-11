import React from 'react';
import FAQList from './FAQList';
import { HelpCircle } from 'lucide-react';

const FAQSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-gray-600">
            Get answers to common questions about our MCQ generation platform
          </p>
        </div>
        <FAQList />
      </div>
    </section>
  );
};

export default FAQSection;