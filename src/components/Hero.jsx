import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20">
      <div className="max-w-[1200px] mx-auto px-6 w-full flex flex-col items-center text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl leading-tight">
          Find the Right Electric Vehicle in Indonesia
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
          Compare, explore, and discover EVs with clarity and precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-medium text-sm hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2">
            Explore EVs
            <ArrowRight size={18} />
          </button>
          
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/5 transition-colors duration-300 flex items-center justify-center gap-2">
            Compare Models
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
