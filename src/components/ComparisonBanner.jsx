import React from 'react';
import { ArrowRight } from 'lucide-react';

const ComparisonBanner = () => {
  return (
    <section className="py-32 border-t border-b border-white/10 bg-[#121212]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight">
          Compare EVs side by side in seconds.
        </h2>
        
        <button className="px-8 py-4 bg-white text-black rounded-xl font-medium text-sm hover:scale-[1.02] transition-transform duration-300 inline-flex items-center gap-2">
          Start Comparing
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default ComparisonBanner;
