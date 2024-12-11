import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Benefits } from '../components/home/Benefits';
import TestimonialsSection from '../components/home/Testimonials/TestimonialsSection';
import FAQSection from '../components/home/FAQ/FAQSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Benefits />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}