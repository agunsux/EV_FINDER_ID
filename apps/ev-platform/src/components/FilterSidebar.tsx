"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, Suspense } from 'react';

function FilterSidebarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentBrand = searchParams.get('brand') || '';
  const currentCategory = searchParams.get('category') || '';
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/');
  };

  return (
    <div className="bg-[#1e2330] border border-gray-800 p-6 rounded-2xl sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Filter</h2>
        <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-blue-300">
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Brand Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Merek</h3>
          <select 
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            value={currentBrand}
            onChange={(e) => router.push(`/?${createQueryString('brand', e.target.value)}`)}
          >
            <option value="">Semua Merek</option>
            <option value="Hyundai">Hyundai</option>
            <option value="BYD">BYD</option>
            <option value="Wuling">Wuling</option>
            <option value="MG">MG</option>
            <option value="VinFast">VinFast</option>
            <option value="Chery">Chery</option>
            <option value="Toyota">Toyota</option>
            <option value="DFSK">DFSK</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Kategori</h3>
          <div className="space-y-2">
            {['suv', 'hatchback', 'sedan', 'mpv', 'commercial'].map(cat => (
              <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={currentCategory === cat}
                  onChange={() => router.push(`/?${createQueryString('category', cat)}`)}
                  className="form-radio text-blue-500 bg-gray-900 border-gray-700 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300 group-hover:text-white capitalize">{cat}</span>
              </label>
            ))}
            <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={currentCategory === ''}
                  onChange={() => router.push(`/?${createQueryString('category', '')}`)}
                  className="form-radio text-blue-500 bg-gray-900 border-gray-700 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300 group-hover:text-white capitalize">Semua</span>
              </label>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Harga (Rp)</h3>
          <div className="flex items-center space-x-2 mb-3">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={applyFilters}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
          >
            Terapkan Harga
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <Suspense fallback={<div className="bg-[#1e2330] border border-gray-800 p-6 rounded-2xl sticky top-24 text-gray-400">Memuat filter...</div>}>
      <FilterSidebarContent />
    </Suspense>
  );
}
