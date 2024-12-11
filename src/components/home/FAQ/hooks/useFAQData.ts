import { useMemo } from 'react';
import { FAQ } from '../types';

export const useFAQData = () => {
  const faqs: FAQ[] = useMemo(() => [
    {
      question: "How does the MCQ generation work?",
      answer: "Our AI-powered system analyzes your content and generates relevant multiple-choice questions using advanced natural language processing. It ensures questions are contextually accurate and cover key concepts from your material."
    },
    {
      question: "What types of content can I use?",
      answer: "You can generate MCQs from text documents, YouTube videos, and images. Our system supports various formats and can extract meaningful questions from educational content, articles, lectures, and more."
    },
    {
      question: "How accurate are the generated questions?",
      answer: "Our AI model is trained on extensive educational content and maintains high accuracy. However, we recommend reviewing questions before use, especially for specialized subjects."
    },
    {
      question: "Can I customize the generated questions?",
      answer: "Yes! You can edit questions, modify options, and adjust difficulty levels. You can also specify the number of questions you want to generate and focus on specific topics."
    },
    {
      question: "Is there a limit to how many questions I can generate?",
      answer: "Free users can generate up to 10 MCQs per month. Premium users get unlimited generations along with additional features like video analysis and custom templates."
    },
    {
      question: "Can I save and export my quizzes?",
      answer: "Yes, you can save quizzes to your account, export them as PDFs, and share them with others. Premium users get additional export formats and collaboration features."
    }
  ], []);

  return { faqs };
};