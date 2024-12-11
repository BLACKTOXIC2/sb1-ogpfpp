import React from 'react';
import { Check, X } from 'lucide-react';
import { features } from './data/pricing';

const PricingFeatureComparison = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Compare Features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="py-4 px-6 text-left text-gray-500 font-medium">Features</th>
                <th className="py-4 px-6 text-center text-gray-900 font-semibold">Free</th>
                <th className="py-4 px-6 text-center text-blue-600 font-semibold">Pro</th>
                <th className="py-4 px-6 text-center text-gray-900 font-semibold">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature) => (
                <tr key={feature.name} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">{feature.name}</td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-600">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-600">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.team === 'boolean' ? (
                      feature.team ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-600">{feature.team}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingFeatureComparison;