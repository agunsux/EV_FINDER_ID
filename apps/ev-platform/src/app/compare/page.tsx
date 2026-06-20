import { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { EVModel } from '@/types/ev';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

import VehicleSelect from './VehicleSelect';

export const metadata: Metadata = {
  title: 'Bandingkan EV - EV Finder Indonesia',
  description: 'Bandingkan spesifikasi, harga, dan fitur mobil listrik di Indonesia secara berdampingan.',
};

export default async function ComparePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const idsParam = typeof searchParams.ids === 'string' ? searchParams.ids : '';
  const selectedIds = idsParam ? idsParam.split(',').slice(0, 3) : []; // max 3 comparison

  // Fetch all EVs for the selection dropdown
  let allEvs: Pick<EVModel, 'id' | 'brand' | 'model'>[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'vehicles'));
    snapshot.forEach(doc => {
      const data = doc.data();
      allEvs.push({ id: doc.id, brand: data.brand, model: data.model });
    });
  } catch (e) {
    console.error(e);
  }

  // Fetch selected EVs
  const evs: EVModel[] = [];
  if (selectedIds.length > 0) {
    await Promise.all(
      selectedIds.map(async (id) => {
        try {
          const docSnap = await getDoc(doc(db, 'vehicles', id));
          if (docSnap.exists()) {
            evs.push({ id: docSnap.id, ...docSnap.data() } as EVModel);
          }
        } catch (e) {}
      })
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  // Helper to highlight best spec (simplistic)
  const isBest = (val: number, arr: number[], higherIsBetter = true) => {
    if (arr.length < 2) return false;
    const best = higherIsBetter ? Math.max(...arr) : Math.min(...arr);
    return val === best;
  };

  const ranges = evs.map(e => e.range_claimed);
  const batteries = evs.map(e => e.battery_capacity);
  const powers = evs.map(e => e.motor_power);
  const prices = evs.map(e => e.price_range.min);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold text-white mb-2">Bandingkan EV</h1>
      <p className="text-gray-400 mb-8">Pilih hingga 3 mobil listrik untuk membandingkan spesifikasi secara langsung.</p>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[0, 1, 2].map((index) => {
          const currentEv = evs[index];
          
          return (
            <div key={index} className="bg-[#1e2330] p-4 rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Kendaraan {index + 1}</h3>
              {currentEv ? (
                <div className="flex flex-col h-full">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-900 mb-4">
                    <Image src={currentEv.images[0] || '/placeholder.png'} alt={currentEv.model} fill className="object-cover" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{currentEv.brand} {currentEv.model}</h4>
                  <p className="text-emerald-400 font-bold mb-4">{formatPrice(currentEv.price_range.min)}</p>
                  
                  {/* We need a client component to handle removing/adding, but we'll use a simple link trick for SSR */}
                  <Link 
                    href={`/compare?ids=${evs.filter(e => e.id !== currentEv.id).map(e => e.id).join(',')}`}
                    className="mt-auto text-center w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition-colors border border-red-500/30"
                  >
                    Hapus
                  </Link>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-4 text-center">Tambahkan EV ke-({index + 1})</p>
                  <VehicleSelect selectedIds={selectedIds} allEvs={allEvs} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {evs.length > 0 && (
        <div className="bg-[#1e2330] rounded-2xl border border-gray-800 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="p-4 text-gray-400 font-medium w-1/4">Spesifikasi</th>
                {evs.map(ev => (
                  <th key={ev.id} className="p-4 text-white font-bold text-lg w-1/4">{ev.brand} {ev.model}</th>
                ))}
                {/* Fill empty columns if < 3 EVs selected */}
                {Array.from({ length: 3 - evs.length }).map((_, i) => (
                  <th key={`empty-th-${i}`} className="p-4 w-1/4"></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Harga Dasar</td>
                {evs.map(ev => (
                  <td key={ev.id} className={`p-4 font-semibold ${isBest(ev.price_range.min, prices, false) ? 'text-emerald-400' : 'text-white'}`}>
                    {formatPrice(ev.price_range.min)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Jarak Tempuh (Klaim)</td>
                {evs.map(ev => (
                  <td key={ev.id} className={`p-4 font-semibold ${isBest(ev.range_claimed, ranges) ? 'text-blue-400' : 'text-white'}`}>
                    {ev.range_claimed} km
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Kapasitas Baterai</td>
                {evs.map(ev => (
                  <td key={ev.id} className={`p-4 font-semibold ${isBest(ev.battery_capacity, batteries) ? 'text-green-400' : 'text-white'}`}>
                    {ev.battery_capacity} kWh
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Tenaga Motor</td>
                {evs.map(ev => (
                  <td key={ev.id} className={`p-4 font-semibold ${isBest(ev.motor_power, powers) ? 'text-purple-400' : 'text-white'}`}>
                    {ev.motor_power} kW
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Torsi</td>
                {evs.map(ev => (
                  <td key={ev.id} className="p-4 text-white">
                    {ev.torque} Nm
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Dimensi / Bodi</td>
                {evs.map(ev => (
                  <td key={ev.id} className="p-4 text-white capitalize">
                    {ev.category}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-800/30">
                <td className="p-4 text-gray-400">Penggerak DC Fast Charge</td>
                {evs.map(ev => (
                  <td key={ev.id} className="p-4">
                    {ev.charging_time.dc ? <Check className="text-emerald-500 w-5 h-5" /> : <X className="text-red-500 w-5 h-5" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
