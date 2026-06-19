import React from 'react';

const FilterSidebar = ({ filters, setFilters, availableBrands }) => {
  const handleBrandChange = (brand) => {
    setFilters(prev => {
      const currentBrands = prev.brands;
      if (currentBrands.includes(brand)) {
        return { ...prev, brands: currentBrands.filter(b => b !== brand) };
      } else {
        return { ...prev, brands: [...currentBrands, brand] };
      }
    });
  };

  const handleBodyTypeChange = (type) => {
    setFilters(prev => {
      const currentTypes = prev.bodyTypes;
      if (currentTypes.includes(type)) {
        return { ...prev, bodyTypes: currentTypes.filter(t => t !== type) };
      } else {
        return { ...prev, bodyTypes: [...currentTypes, type] };
      }
    });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-dark-bg h-max border border-white/5 rounded-2xl p-6">
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Price Range (Rp)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full bg-[#121212] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue/50"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full bg-[#121212] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue/50"
          />
        </div>
      </div>

      <div className="mb-8 border-t border-white/5 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Min Range (km)</h3>
        <input
          type="range"
          min="100"
          max="800"
          step="50"
          value={filters.minRange}
          onChange={(e) => setFilters({ ...filters, minRange: parseInt(e.target.value) })}
          className="w-full accent-accent-blue"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>100 km</span>
          <span className="text-white font-medium">{filters.minRange} km+</span>
          <span>800 km</span>
        </div>
      </div>

      <div className="mb-8 border-t border-white/5 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Brand</h3>
        <div className="space-y-3">
          {availableBrands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 rounded border-white/20 bg-transparent text-accent-blue focus:ring-offset-0 focus:ring-accent-blue/50 cursor-pointer"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Body Type</h3>
        <div className="space-y-3">
          {['Hatchback', 'SUV', 'Sedan'].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.bodyTypes.includes(type)}
                onChange={() => handleBodyTypeChange(type)}
                className="w-4 h-4 rounded border-white/20 bg-transparent text-accent-blue focus:ring-offset-0 focus:ring-accent-blue/50 cursor-pointer"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
