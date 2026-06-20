import Link from 'next/link';
import Image from 'next/image';
import { EVModel } from '@/types/ev';
import { Battery, Zap, Car } from 'lucide-react';

export default function EVCard({ ev }: { ev: EVModel }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  return (
    <Link href={`/evs/${ev.id}`} className="group relative overflow-hidden rounded-2xl bg-[#1e2330] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        <Image 
          src={ev.images[0] || '/placeholder.png'} 
          alt={`${ev.brand} ${ev.model}`} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 uppercase tracking-wider">
          {ev.category}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {ev.brand} {ev.model}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{ev.year}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            <span>{ev.range_claimed} km</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Battery className="w-4 h-4 mr-2 text-green-400" />
            <span>{ev.battery_capacity} kWh</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm col-span-2">
            <Car className="w-4 h-4 mr-2 text-blue-400" />
            <span>{ev.motor_power} kW ({ev.torque} Nm)</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Estimasi Harga</p>
            <p className="text-lg font-bold text-white">
              {ev.price_range.min === ev.price_range.max 
                ? formatPrice(ev.price_range.min)
                : `${formatPrice(ev.price_range.min)} - ${formatPrice(ev.price_range.max)}`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
