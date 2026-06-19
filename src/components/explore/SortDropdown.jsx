import React from 'react';

const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs text-gray-500">Sort by:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="block py-2 px-3 bg-[#121212] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors cursor-pointer appearance-none"
        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
      >
        <option value="newest">Newest</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="range-high-low">Range: High to Low</option>
      </select>
    </div>
  );
};

export default SortDropdown;
