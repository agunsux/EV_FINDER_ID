import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/explore/FilterSidebar';
import SearchBar from '../components/explore/SearchBar';
import SortDropdown from '../components/explore/SortDropdown';
import EVGrid from '../components/explore/EVGrid';
import AIAdvisorPanel from '../components/explore/AIAdvisorPanel';
import vehicleData from '../data/vehicles.json';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [compareList, setCompareList] = useState([]);
  
  // Initialize filters
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minRange: 100,
    brands: [],
    bodyTypes: []
  });

  // Extract available brands
  const availableBrands = useMemo(() => {
    const brands = new Set(vehicleData.map(v => v.brand));
    return Array.from(brands).sort();
  }, []);

  // Filter and sort logic
  const filteredVehicles = useMemo(() => {
    let result = vehicleData;

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.brand.toLowerCase().includes(lowerQuery) || 
        v.model.toLowerCase().includes(lowerQuery)
      );
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter(v => v.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      result = result.filter(v => v.price <= filters.maxPrice);
    }

    // Range filter
    if (filters.minRange > 100) {
      result = result.filter(v => v.rangeKm >= filters.minRange);
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(v => filters.brands.includes(v.brand));
    }

    // Body Type filter
    if (filters.bodyTypes.length > 0) {
      result = result.filter(v => filters.bodyTypes.includes(v.bodyType));
    }

    // Sorting
    result = [...result]; // Clone to sort safely
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'range-high-low':
        result.sort((a, b) => b.rangeKm - a.rangeKm);
        break;
      case 'newest':
      default:
        // Default order from JSON
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert("You can only compare up to 3 vehicles at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Header Zone */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Explore Vehicles</h1>
              <p className="text-sm text-gray-400">
                {filteredVehicles.length} EVs available in Indonesia
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              availableBrands={availableBrands} 
            />
            
            <div className="flex-1 w-full min-w-0">
              <EVGrid 
                vehicles={filteredVehicles} 
                compareList={compareList}
                toggleCompare={toggleCompare}
              />

              <AIAdvisorPanel 
                vehicles={filteredVehicles.slice(0, 5)}
              />
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
