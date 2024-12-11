import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Youtube, CheckSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Text MCQ Generator',
    description: 'Transform any text into multiple choice questions instantly. Perfect for creating assessments from articles, books, or study materials.',
    path: '/text-quiz',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Youtube,
    title: 'Video Quiz Generator',
    description: 'Create comprehensive quizzes from YouTube videos. Ideal for video-based learning and content comprehension testing.',
    path: '/video',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: CheckSquare,
    title: 'True/False Generator',
    description: 'Generate quick true/false questions for rapid assessments. Great for knowledge checks and quick reviews.',
    path: '/true-false',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Quiz Generation Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from multiple quiz formats to create the perfect assessment for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-8 border border-gray-200 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full ${feature.bgColor} opacity-20 transition-transform group-hover:scale-150`}></div>
              <div className="relative">
                <div className={`w-16 h-16 ${feature.bgColor} ${feature.color} rounded-lg p-4 mb-6`}>
                  <feature.icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {feature.description}
                </p>
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Try Now <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};