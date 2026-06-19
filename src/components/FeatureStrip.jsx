import React from 'react';
import { SlidersHorizontal, Wallet, ShieldCheck } from 'lucide-react';

const FeatureStrip = () => {
  const features = [
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-accent-blue" />,
      title: "Compare EV specifications instantly",
      description: "Side-by-side technical specs, dimensions, and features."
    },
    {
      icon: <Wallet className="w-5 h-5 text-accent-blue" />,
      title: "Discover best EV by budget",
      description: "Find the perfect match for your lifestyle and wallet."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-accent-blue" />,
      title: "Transparent real-world insights",
      description: "Actual range data and verified owner experiences."
    }
  ];

  return (
    <section className="py-24 border-t border-white/10 bg-dark-bg">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start md:items-center text-left md:text-center">
              <div className="mb-6 text-accent-blue">
                {feature.icon}
              </div>
              <h3 className="text-base font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
