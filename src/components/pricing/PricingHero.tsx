import React from 'react';
import { Sparkles } from 'lucide-react';

const PricingHero = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Simple, transparent pricing</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Choose the Perfect Plan for Your Learning Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're an individual learner or managing a team, we have a plan that fits your needs.
          All plans include core features with flexible options.
        </p>
      </div>
    </section>
  );
};

export default PricingHero;