import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchVehicleById } from '../services/api';
import { Battery, Zap, Gauge, Wrench, MapPin, ArrowLeft, ShieldCheck, Banknote } from 'lucide-react';

export default function EVDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleById(id)
      .then(data => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16">
      <h2 className="text-2xl font-bold text-white mb-4">Kendaraan Tidak Ditemukan</h2>
      <Link to="/vehicles" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Eksplorasi
      </Link>
    </div>
  );

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent z-10" />
        <img 
          src={vehicle.image} 
          alt={vehicle.model} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/vehicles" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-blue-400 font-semibold text-lg mb-2">{vehicle.brand}</p>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{vehicle.model}</h1>
                <p className="text-gray-300 text-lg">{vehicle.bodyType}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-400 text-sm mb-1">Mulai Dari</p>
                <p className="text-3xl md:text-4xl font-bold text-white">{vehicle.priceFormatted}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Specs */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Spesifikasi Utama</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                  <Zap className="w-8 h-8 text-blue-500 mb-4" />
                  <p className="text-sm text-gray-400 mb-1">Jarak Tempuh</p>
                  <p className="text-xl font-bold text-white">{vehicle.rangeKm} <span className="text-sm font-normal text-gray-400">km</span></p>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                  <Battery className="w-8 h-8 text-blue-500 mb-4" />
                  <p className="text-sm text-gray-400 mb-1">Kapasitas Baterai</p>
                  <p className="text-xl font-bold text-white">{vehicle.batteryKwh} <span className="text-sm font-normal text-gray-400">kWh</span></p>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                  <Gauge className="w-8 h-8 text-blue-500 mb-4" />
                  <p className="text-sm text-gray-400 mb-1">Fast Charging</p>
                  <p className="text-xl font-bold text-white">{vehicle.fastChargeTimeMins ? `${vehicle.fastChargeTimeMins} mnt` : 'N/A'}</p>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                  <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
                  <p className="text-sm text-gray-400 mb-1">Garansi Baterai</p>
                  <p className="text-xl font-bold text-white">8 <span className="text-sm font-normal text-gray-400">Tahun</span></p>
                </div>
              </div>
            </section>

            {/* Ownership */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Kepemilikan & Dukungan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg mb-1">Pusat Layanan</h3>
                    <p className="text-gray-400 text-sm">Jaringan bengkel resmi {vehicle.brand} tersedia di kota-kota besar di Indonesia.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg mb-1">Home Charging</h3>
                    <p className="text-gray-400 text-sm">Pemasangan wall charger gratis untuk setiap pembelian unit baru.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Monetization CTAs */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Tertarik dengan {vehicle.model}?</h3>
              <p className="text-gray-400 text-sm mb-8">Ambil langkah selanjutnya untuk kendaraan masa depan Anda.</p>
              
              <div className="space-y-4">
                <button className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
                  <Banknote className="w-5 h-5" /> Simulasi Kredit
                </button>
                <button className="w-full py-4 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold transition-colors">
                  Booking Test Drive
                </button>
                <button className="w-full py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-xl font-bold transition-colors">
                  Hubungi Dealer
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Summary
                  </h4>
                  <p className="text-sm text-gray-300">
                    Mobil ini cocok untuk Anda jika mencari {vehicle.bodyType} dengan jarak tempuh menengah ke atas. 
                    Konsultasikan dengan AI Advisor untuk pengecekan kecocokan personal.
                  </p>
                  <Link to="/advisor" className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                    Tanya AI Advisor <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
