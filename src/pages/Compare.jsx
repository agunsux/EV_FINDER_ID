import React, { useEffect, useState } from 'react';
import { fetchVehicles } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

export default function Compare() {
  const [vehicles, setVehicles] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles().then(data => {
      setVehicles(data);
      // Auto select first 2 for demo purposes
      if (data.length >= 2) {
        setCompareList([data[0], data[1]]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSelect = (index, vehicleId) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    const newList = [...compareList];
    newList[index] = selectedVehicle;
    setCompareList(newList);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
      <div className="mb-8">
        <Link to="/vehicles" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-4 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-3xl font-bold text-white">Bandingkan Kendaraan</h1>
        <p className="text-gray-400 mt-2">Pilih hingga 3 kendaraan untuk membandingkan spesifikasi.</p>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="flex gap-4 mb-8">
            <div className="w-48 shrink-0"></div> {/* Empty corner */}
            
            {[0, 1, 2].map(index => (
              <div key={index} className="flex-1 bg-[#111] rounded-2xl border border-white/10 p-4 relative">
                <select 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mb-4"
                  value={compareList[index]?.id || ""}
                  onChange={(e) => handleSelect(index, e.target.value)}
                >
                  <option value="">-- Pilih Kendaraan --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))}
                </select>

                {compareList[index] ? (
                  <div className="text-center">
                    <img src={compareList[index].image} alt={compareList[index].model} className="w-full h-32 object-cover rounded-xl mb-3" />
                    <h3 className="font-bold text-lg text-white">{compareList[index].brand} {compareList[index].model}</h3>
                    <p className="text-blue-400 font-semibold">{compareList[index].priceFormatted}</p>
                    <Link to={`/vehicle/${compareList[index].id}`} className="mt-4 block text-sm text-gray-400 hover:text-white transition-colors">
                      Lihat Detail
                    </Link>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm">Tambah Kendaraan</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Specs Rows */}
          <div className="space-y-4">
            <SpecRow title="Tipe Bodi" dataKey="bodyType" compareList={compareList} />
            <SpecRow title="Jarak Tempuh (WLTP)" dataKey="rangeKm" suffix=" km" compareList={compareList} />
            <SpecRow title="Kapasitas Baterai" dataKey="batteryKwh" suffix=" kWh" compareList={compareList} />
            <SpecRow title="Fast Charging (10-80%)" dataKey="fastChargeTimeMins" suffix=" menit" fallback="Tidak diketahui" compareList={compareList} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ title, dataKey, suffix = '', fallback = '-', compareList }) {
  return (
    <div className="flex gap-4 items-center bg-[#111]/50 rounded-xl p-4 border border-white/5 hover:bg-[#111] transition-colors">
      <div className="w-48 shrink-0 font-medium text-gray-400">{title}</div>
      {[0, 1, 2].map(index => (
        <div key={index} className="flex-1 text-center font-semibold text-white">
          {compareList[index] 
            ? (compareList[index][dataKey] ? `${compareList[index][dataKey]}${suffix}` : fallback)
            : '-'}
        </div>
      ))}
    </div>
  );
}
