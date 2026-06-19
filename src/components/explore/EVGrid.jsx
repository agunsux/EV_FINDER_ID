import React from 'react';
import EVCard from './EVCard';

const EVGrid = ({ vehicles, compareList, toggleCompare }) => {
  if (vehicles.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-center border border-white/5 border-dashed rounded-2xl bg-[#121212]/50">
        <p className="text-gray-400 mb-2">No vehicles found matching your criteria.</p>
        <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <EVCard 
          key={vehicle.id} 
          vehicle={vehicle} 
          isCompared={compareList.includes(vehicle.id)}
          toggleCompare={toggleCompare}
        />
      ))}
    </div>
  );
};

export default EVGrid;
