import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 bg-[#121212] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors"
        placeholder="Search by brand or model..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
