import React from 'react';
import PricingTierCard from './PricingTierCard';
import { tiers } from './data/pricing';

const PricingTiers = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.name}
              {...tier}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;