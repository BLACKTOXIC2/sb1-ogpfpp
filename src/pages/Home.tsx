import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Benefits } from '../components/home/Benefits';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Benefits />
    </div>
  );
}