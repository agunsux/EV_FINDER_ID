import React from 'react';
import { Link } from 'react-router-dom';
import { Battery, Zap, ChevronRight } from 'lucide-react';

export default function EVCard({ vehicle }) {
  return (
    <Link to={`/vehicle/${vehicle.id}`} className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] block">
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.model}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
          {vehicle.bodyType}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{vehicle.brand}</p>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{vehicle.model}</h3>
          </div>
          <p className="text-lg font-semibold text-white">{vehicle.priceFormatted}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{vehicle.rangeKm} km</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Battery className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{vehicle.batteryKwh} kWh</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm font-medium text-blue-500 group-hover:text-blue-400">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
