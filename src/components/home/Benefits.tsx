import React from 'react';
import { Zap, Shield, Clock, Users, Book, BarChart } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'AI-Powered Accuracy',
    description: 'Advanced algorithms ensure high-quality, relevant questions every time'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your content and quizzes are protected with enterprise-grade security'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Generate quizzes in seconds instead of hours of manual work'
  },
  {
    icon: Users,
    title: 'Collaborative',
    description: 'Share quizzes with your team or students easily'
  },
  {
    icon: Book,
    title: 'Multiple Formats',
    description: 'Create MCQs, true/false, and video-based questions'
  },
  {
    icon: BarChart,
    title: 'Track Progress',
    description: 'Monitor performance and identify areas for improvement'
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose MCQGEN?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the benefits of our advanced quiz generation platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};