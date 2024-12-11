import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Youtube, CheckSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Text MCQ Generator',
    description: 'Generate multiple choice questions from any text content',
    path: '/text-quiz',
    color: 'text-blue-600'
  },
  {
    icon: Youtube,
    title: 'Video Quiz Generator',
    description: 'Create quizzes from YouTube video content',
    path: '/video',
    color: 'text-red-600'
  },
  {
    icon: CheckSquare,
    title: 'True/False Generator',
    description: 'Generate true/false questions for quick assessments',
    path: '/true-false',
    color: 'text-green-600'
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          AI-Powered Quiz Generation
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Transform any content into engaging quizzes with our advanced AI technology.
          Perfect for educators, students, and learning enthusiasts.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/text-quiz"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Quiz Generation Tools
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-200"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <span className="inline-flex items-center text-blue-600 group-hover:gap-2 transition-all">
                Try Now <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Why Choose MCQGEN?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered Accuracy
            </h3>
            <p className="text-gray-600">
              Advanced algorithms ensure high-quality, relevant questions every time.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multiple Formats
            </h3>
            <p className="text-gray-600">
              Generate MCQs, true/false questions, and video-based quizzes.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              Simple interface for quick quiz generation and management.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}