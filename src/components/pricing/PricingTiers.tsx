import React from 'react';
import PricingTierCard from './PricingTierCard';
import PricingToggle from './PricingToggle';
import { usePricingPlan } from '../../hooks/usePricingPlan';
import { tiers } from './data/pricing';

const PricingTiers = () => {
  const { isYearly, setIsYearly, calculatePrice, getBillingPeriod } = usePricingPlan();

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.name}
              {...tier}
              price={calculatePrice(Number(tier.price)).toString()}
              billingPeriod={getBillingPeriod()}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;