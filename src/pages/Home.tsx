import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Benefits } from '../components/home/Benefits';
import TestimonialsSection from '../components/home/Testimonials/TestimonialsSection';
import FAQSection from '../components/home/FAQ/FAQSection';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MCQGEN - AI-Powered Quiz Generation Platform for Educators</title>
        <meta name="description" content="Transform any content into engaging multiple-choice questions with our AI-powered platform. Perfect for educators, students, and learning professionals." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MCQGEN - AI-Powered Quiz Generation Platform" />
        <meta property="og:description" content="Create professional MCQs instantly from text, videos, and images using advanced AI technology." />
        <meta property="og:image" content="https://mcqgen.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MCQGEN - AI-Powered Quiz Generation" />
        <meta name="twitter:description" content="Generate engaging quizzes instantly with AI technology. Perfect for educators and learning professionals." />
        <meta name="twitter:image" content="https://mcqgen.com/twitter-card.jpg" />
        
        {/* Additional SEO tags */}
        <meta name="keywords" content="MCQ generator, quiz maker, AI quiz generation, education technology, assessment tools, online learning" />
        <meta name="author" content="MCQGEN" />
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mcqgen.com" />
      </Helmet>

      <div className="min-h-screen">
        <Hero />
        <Features />
        <Benefits />
        <TestimonialsSection />
        <FAQSection />
      </div>
    </>
  );
}