import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import vehiclesData from '../data/vehicles.json';
import { PLN_TARIFFS, BBM_TYPES, ICE_EFFICIENCY } from '../utils/constants';
import { saveLead } from '../utils/leadStorage';

const Calculator = () => {
  const [distance, setDistance] = useState(1000); // km per month
  const [selectedEvId, setSelectedEvId] = useState(vehiclesData[0].id);
  const [selectedBbm, setSelectedBbm] = useState("Pertamax");
  const [selectedTariff, setSelectedTariff] = useState("R-1/2200VA");

  const [leadName, setLeadName] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, loading, success
  const selectedEv = useMemo(() => vehiclesData.find(v => v.id === selectedEvId) || vehiclesData[0], [selectedEvId]);

  const evEfficiency = selectedEv.rangeKm / selectedEv.batteryKwh; // km per kWh

  const iceCostPerMonth = (distance / ICE_EFFICIENCY) * BBM_TYPES[selectedBbm];
  const evCostPerMonth = (distance / evEfficiency) * PLN_TARIFFS[selectedTariff];
  const savingsPerMonth = iceCostPerMonth - evCostPerMonth;
  const savingsPercentage = iceCostPerMonth > 0 ? ((savingsPerMonth / iceCostPerMonth) * 100).toFixed(0) : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const handleSubmitLead = () => {
    if (!leadName || !leadWhatsapp || !leadCity) return;
    
    setSubmitStatus('loading');
    
    // Simulate network delay for better UX
    setTimeout(() => {
      saveLead({
        name: leadName,
        whatsapp: leadWhatsapp,
        city: leadCity,
        model: selectedEv.brand + ' ' + selectedEv.model
      });
      setSubmitStatus('success');
      setLeadName('');
      setLeadWhatsapp('');
      setLeadCity('');
    }, 800);
  };
  return (
    <div className="min-h-screen bg-dark-bg text-white pt-24 pb-12">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Kalkulator Biaya EV vs BBM
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Hitung seberapa besar penghematan Anda dengan beralih ke kendaraan listrik dibandingkan dengan mobil bensin (ICE).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-6">Parameter Perhitungan</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jarak Tempuh per Bulan (km)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="bg-dark-bg border border-white/10 rounded-lg px-4 py-2 min-w-[100px] text-center font-medium">
                    {distance} km
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pilih Mobil Listrik (EV)
                </label>
                <select
                  value={selectedEvId}
                  onChange={(e) => setSelectedEvId(e.target.value)}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
                >
                  {vehiclesData.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Efisiensi EV ini: {evEfficiency.toFixed(2)} km/kWh (Kapasitas: {selectedEv.batteryKwh} kWh, Jarak: {selectedEv.rangeKm} km)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tarif Listrik Rumah (PLN)
                </label>
                <select
                  value={selectedTariff}
                  onChange={(e) => setSelectedTariff(e.target.value)}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
                >
                  {Object.entries(PLN_TARIFFS).map(([key, value]) => (
                    <option key={key} value={key}>{key} - Rp {value}/kWh</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jenis BBM Mobil Bensin (ICE)
                </label>
                <select
                  value={selectedBbm}
                  onChange={(e) => setSelectedBbm(e.target.value)}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
                >
                  {Object.entries(BBM_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{key} - Rp {value}/liter</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Asumsi efisiensi mobil bensin: {ICE_EFFICIENCY} km/liter
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 border border-emerald-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-center text-center">
              <h3 className="text-xl font-medium text-emerald-300 mb-2">Potensi Penghematan per Bulan</h3>
              <div className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                {formatCurrency(savingsPerMonth)}
              </div>
              <div className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold w-fit mx-auto">
                <span>Lebih hemat {savingsPercentage}%</span>
              </div>
              <p className="text-gray-400 mt-6 max-w-md mx-auto">
                Penghematan ini bisa digunakan untuk investasi, liburan, atau bahkan menyicil mobil EV impian Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-300">Biaya Bensin (ICE)</h4>
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-8c0-1.5 1-2 3-2h2c2 0 3 .5 3 2v8"/><path d="M11 22H3"/><path d="M14 22h-3"/><path d="M14 11V3c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v8"/><path d="M14 9h6a2 2 0 0 1 2 2v2"/><path d="M22 13v8a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4"/></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(iceCostPerMonth)}
                </div>
                <p className="text-sm text-gray-500">
                  {((distance / ICE_EFFICIENCY)).toFixed(1)} Liter per bulan
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h4 className="text-lg font-medium text-gray-300">Biaya Listrik (EV)</h4>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1 relative z-10">
                  {formatCurrency(evCostPerMonth)}
                </div>
                <p className="text-sm text-gray-500 relative z-10">
                  {((distance / evEfficiency)).toFixed(1)} kWh per bulan
                </p>
              </div>
            </div>
            
            {/* Yearly Savings Alert/Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-blue-400 mt-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-100 mb-1">Fakta Menarik</h4>
                <p className="text-sm text-blue-200/70">
                  Dalam 1 tahun, dengan beralih ke EV {selectedEv.brand} {selectedEv.model}, Anda bisa menghemat <strong>{formatCurrency(savingsPerMonth * 12)}</strong>!
                </p>
              </div>
            </div>

            {/* Lead Generation Form */}
            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl text-gray-800">
              {submitStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Terima Kasih!</h3>
                  <p className="text-gray-600">
                    Permintaan penawaran Anda untuk <strong>{selectedEv.brand} {selectedEv.model}</strong> telah kami terima. Dealer resmi kami akan segera menghubungi Anda melalui WhatsApp.
                  </p>
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-6 text-sm font-semibold text-yellow-600 hover:text-yellow-700"
                  >
                    Kirim permintaan lain
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg text-gray-900">🔥 Dapatkan Penawaran Terbaik!</h3>
                  <p className="text-sm text-gray-600">Dealer resmi akan menghubungi Anda dengan harga terbaik untuk <strong>{selectedEv.brand} {selectedEv.model}</strong>.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white text-gray-900"
                    />
                    <input 
                      type="tel" 
                      placeholder="No. WhatsApp" 
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white text-gray-900"
                    />
                    <input 
                      type="text" 
                      placeholder="Kota" 
                      value={leadCity}
                      onChange={(e) => setLeadCity(e.target.value)}
                      className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white text-gray-900"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSubmitLead}
                    disabled={!leadName || !leadWhatsapp || !leadCity || submitStatus === 'loading'}
                    className={`mt-4 font-bold px-8 py-3 rounded-lg transition w-full md:w-auto ${
                      (!leadName || !leadWhatsapp || !leadCity || submitStatus === 'loading') 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    }`}
                  >
                    {submitStatus === 'loading' ? 'Mengirim...' : 'Kirim & Dapatkan Penawaran 🚀'}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">*Data akan dikirim ke dealer resmi terdekat. Privasi terjaga.</p>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
