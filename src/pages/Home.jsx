import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import EVCard from '../components/EVCard';
import { fetchVehicles } from '../services/api';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles().then(data => {
      // Just show top 3 as featured for the home page
      setFeaturedVehicles(data.slice(0, 3));
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Masa Depan Mobilitas Indonesia</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Temukan EV <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Impian Anda</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Platform intelijen untuk menemukan mobil listrik terbaik yang sesuai dengan gaya hidup, budget, dan kebutuhan Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/advisor" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2">
              Tanya AI Advisor
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link to="/vehicles" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all flex items-center justify-center gap-2">
              Lihat Semua EV
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Populer di Indonesia</h2>
              <p className="text-gray-400">Pilihan kendaraan listrik terbaik bulan ini.</p>
            </div>
            <Link to="/vehicles" className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium">
              Eksplorasi Katalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map(vehicle => (
              <EVCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
