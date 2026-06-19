import React from 'react';

const FeaturedCars = () => {
  const cars = [
    {
      name: "Hyundai Ioniq 5",
      brand: "Hyundai",
      price: "Rp 782 Juta",
      range: "481 km",
      acceleration: "7.4s",
      charging: "18 min",
      image: "https://images.unsplash.com/photo-1671207604603-78fca554ff1a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "BYD Dolphin",
      brand: "BYD",
      price: "Rp 425 Juta",
      range: "490 km",
      acceleration: "7.0s",
      charging: "29 min",
      image: "https://images.unsplash.com/photo-1707227155609-5b91a766418d?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Wuling Air EV",
      brand: "Wuling",
      price: "Rp 206 Juta",
      range: "300 km",
      acceleration: "N/A",
      charging: "4 hours",
      image: "https://images.unsplash.com/photo-1698380290196-8eb5db21d030?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 border-t border-white/10 bg-dark-bg">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Featured Models
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <div key={index} className="group border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 bg-[#121212]">
              <div className="relative h-48 bg-gray-900 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{car.brand}</p>
                  <h3 className="text-lg font-medium text-white mb-2">{car.name}</h3>
                  <p className="text-xl font-light text-white">{car.price}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Range</p>
                    <p className="text-sm font-medium text-white">{car.range}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">0-100</p>
                    <p className="text-sm font-medium text-white">{car.acceleration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Charge</p>
                    <p className="text-sm font-medium text-white">{car.charging}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
