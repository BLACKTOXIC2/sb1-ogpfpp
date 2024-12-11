import React from 'react';
import { ArrowRight } from 'lucide-react';

const PricingCTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Transform Your Assessment Process?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of educators who are already using MCQGEN to create engaging quizzes and assessments.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingCTA;