import React from 'react';
import { Plus, Check } from 'lucide-react';

const EVCard = ({ vehicle, isCompared, toggleCompare }) => {
  return (
    <div className="flex flex-col bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-white/10 transition-all duration-300">
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          className="w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        <button 
          onClick={() => toggleCompare(vehicle.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isCompared ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50' : 'bg-black/50 text-white hover:bg-black/80 border border-white/10'}`}
          title={isCompared ? "Remove from Compare" : "Add to Compare"}
        >
          {isCompared ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{vehicle.brand}</p>
          <h3 className="text-lg font-medium text-white leading-tight">{vehicle.model}</h3>
          <p className="text-xl font-light text-white mt-2">{vehicle.priceFormatted}</p>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-y-3 gap-x-2">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Range (WLTP)</p>
            <p className="text-sm font-medium text-white">{vehicle.rangeKm} km</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Battery</p>
            <p className="text-sm font-medium text-white">{vehicle.batteryKwh} kWh</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Body</p>
            <p className="text-sm font-medium text-white">{vehicle.bodyType}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Fast Charge</p>
            <p className="text-sm font-medium text-white">{vehicle.fastChargeTimeMins ? `${vehicle.fastChargeTimeMins} min` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EVCard;
