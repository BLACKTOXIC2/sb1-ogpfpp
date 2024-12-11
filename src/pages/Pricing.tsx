import React from 'react';
import PricingHero from '../components/pricing/PricingHero';
import PricingTiers from '../components/pricing/PricingTiers';
import PricingFAQ from '../components/pricing/PricingFAQ';
import PricingFeatureComparison from '../components/pricing/PricingFeatureComparison';
import PricingTestimonials from '../components/pricing/PricingTestimonials';
import PricingCTA from '../components/pricing/PricingCTA';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PricingHero />
      <PricingTiers />
      <PricingFeatureComparison />
      <PricingTestimonials />
      <PricingFAQ />
      <PricingCTA />
    </div>
  );
}