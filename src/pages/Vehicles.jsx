import React, { useEffect, useState, useMemo } from 'react';
import { fetchVehicles } from '../services/api';
import EVCard from '../components/EVCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filters
  const [brandFilter, setBrandFilter] = useState('');
  const [bodyFilter, setBodyFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('');

  useEffect(() => {
    fetchVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Search
      const searchMatch = v.brand.toLowerCase().includes(search.toLowerCase()) || 
                          v.model.toLowerCase().includes(search.toLowerCase());
      if (!searchMatch) return false;

      // Brand
      if (brandFilter && v.brand !== brandFilter) return false;

      // Body Type
      if (bodyFilter && v.bodyType !== bodyFilter) return false;

      // Price
      if (priceFilter) {
        if (priceFilter === '<300') { if (v.price >= 300000000) return false; }
        else if (priceFilter === '300-500') { if (v.price < 300000000 || v.price > 500000000) return false; }
        else if (priceFilter === '500-800') { if (v.price < 500000000 || v.price > 800000000) return false; }
        else if (priceFilter === '>800') { if (v.price <= 800000000) return false; }
      }

      // Range
      if (rangeFilter) {
        if (rangeFilter === '<300') { if (v.rangeKm >= 300) return false; }
        else if (rangeFilter === '300-400') { if (v.rangeKm < 300 || v.rangeKm > 400) return false; }
        else if (rangeFilter === '>400') { if (v.rangeKm <= 400) return false; }
      }

      return true;
    });
  }, [vehicles, search, brandFilter, bodyFilter, priceFilter, rangeFilter]);

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))];
  const uniqueBodyTypes = [...new Set(vehicles.map(v => v.bodyType))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 text-white font-semibold border-b border-white/10 pb-4">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filter Kendaraan</span>
            </div>

            <div className="space-y-6">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Merek</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
                >
                  <option value="">Semua Merek</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Harga</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
                >
                  <option value="">Semua Harga</option>
                  <option value="<300">&lt; 300 Juta</option>
                  <option value="300-500">300 - 500 Juta</option>
                  <option value="500-800">500 - 800 Juta</option>
                  <option value=">800">&gt; 800 Juta</option>
                </select>
              </div>

              {/* Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Jarak Tempuh (Range)</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  value={rangeFilter} onChange={e => setRangeFilter(e.target.value)}
                >
                  <option value="">Semua Jarak</option>
                  <option value="<300">&lt; 300 km</option>
                  <option value="300-400">300 - 400 km</option>
                  <option value=">400">&gt; 400 km</option>
                </select>
              </div>

              {/* Body Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tipe Bodi</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  value={bodyFilter} onChange={e => setBodyFilter(e.target.value)}
                >
                  <option value="">Semua Tipe</option>
                  {uniqueBodyTypes.map(body => (
                    <option key={body} value={body}>{body}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setBrandFilter('');
                setBodyFilter('');
                setPriceFilter('');
                setRangeFilter('');
                setSearch('');
              }}
              className="mt-8 w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Database Kendaraan Listrik</h1>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari merek atau model..."
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <EVCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/10">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Tidak ada kendaraan yang cocok</h3>
              <p className="text-gray-400">Coba ubah kriteria filter pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
