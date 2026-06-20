import { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { EVModel } from '@/types/ev';
import { notFound } from 'next/navigation';
import { CheckCircle2, Battery, Zap, Car, Shield, Navigation } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let ev: EVModel | null = null;
  try {
    const docSnap = await getDoc(doc(db, 'vehicles', params.id));
    if (docSnap.exists()) ev = { id: docSnap.id, ...docSnap.data() } as EVModel;
  } catch (e) {}

  if (!ev) return { title: 'EV Not Found' };

  return {
    title: `${ev.brand} ${ev.model} - Spesifikasi & Harga | EV Finder`,
    description: `Lihat spesifikasi lengkap, jarak tempuh, baterai, dan harga ${ev.brand} ${ev.model} terbaru di Indonesia.`,
    openGraph: {
      title: `${ev.brand} ${ev.model}`,
      images: [ev.images[0] || ''],
    }
  };
}

export default async function EVDetailPage({ params }: Props) {
  let ev: EVModel | null = null;

  try {
    const docSnap = await getDoc(doc(db, 'vehicles', params.id));
    if (docSnap.exists()) ev = { id: docSnap.id, ...docSnap.data() } as EVModel;
  } catch (error) {
    console.error(error);
  }

  if (!ev) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${ev.brand} ${ev.model}`,
    image: ev.images[0],
    description: `Spesifikasi lengkap ${ev.brand} ${ev.model} di Indonesia.`,
    brand: {
      '@type': 'Brand',
      name: ev.brand
    },
    offers: {
      '@type': 'AggregateOffer',
      url: `https://evfinder.id/evs/${ev.id}`,
      priceCurrency: 'IDR',
      lowPrice: ev.price_range.min,
      highPrice: ev.price_range.max,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex space-x-2">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <span>/</span>
        <span>{ev.brand}</span>
        <span>/</span>
        <span className="text-white">{ev.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
            <Image 
              src={ev.images[0] || '/placeholder.png'} 
              alt={`${ev.brand} ${ev.model}`} 
              fill
              className="object-cover"
            />
          </div>
          {ev.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {ev.images.slice(1).map((img, idx) => (
                <div key={idx} className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Essential Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-extrabold text-white">{ev.brand} {ev.model} <span className="text-gray-500 font-medium text-2xl">({ev.year})</span></h1>
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider border border-blue-500/30">
              {ev.category}
            </span>
          </div>

          <p className="text-3xl font-bold text-emerald-400 mt-4 mb-8">
            {ev.price_range.min === ev.price_range.max 
              ? formatPrice(ev.price_range.min)
              : `${formatPrice(ev.price_range.min)} - ${formatPrice(ev.price_range.max)}`}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#1e2330] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center text-gray-400 mb-1">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" /> Jarak Tempuh
              </div>
              <p className="text-2xl font-bold text-white">{ev.range_claimed} km</p>
              <p className="text-sm text-gray-500">Real-world: {ev.range_real_world} km</p>
            </div>
            
            <div className="bg-[#1e2330] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center text-gray-400 mb-1">
                <Battery className="w-5 h-5 mr-2 text-green-400" /> Kapasitas Baterai
              </div>
              <p className="text-2xl font-bold text-white">{ev.battery_capacity} kWh</p>
            </div>

            <div className="bg-[#1e2330] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center text-gray-400 mb-1">
                <Car className="w-5 h-5 mr-2 text-blue-400" /> Performa
              </div>
              <p className="text-2xl font-bold text-white">{ev.motor_power} kW</p>
              <p className="text-sm text-gray-500">Torsi: {ev.torque} Nm</p>
            </div>

            <div className="bg-[#1e2330] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center text-gray-400 mb-1">
                <Shield className="w-5 h-5 mr-2 text-purple-400" /> Garansi
              </div>
              <p className="text-xl font-bold text-white">{ev.warranty.years} Tahun</p>
              <p className="text-sm text-gray-500">atau {ev.warranty.km.toLocaleString('id-ID')} km</p>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-lg font-bold text-white mb-3">Keunggulan & Insentif</h3>
            <ul className="space-y-2">
              {ev.incentives.length > 0 ? ev.incentives.map((inc, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
                  {inc}
                </li>
              )) : (
                <li className="text-gray-500 italic">Tidak ada info insentif.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Specs Table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Spesifikasi Detail</h2>
        <div className="bg-[#1e2330] rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium w-1/3">Waktu Charging AC (0-100%)</th>
                <td className="py-4 px-6 text-white">{ev.charging_time.ac} Jam</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Waktu Charging DC Fast (10-80%)</th>
                <td className="py-4 px-6 text-white">{ev.charging_time.dc ? `${ev.charging_time.dc * 60} Menit` : 'Tidak mendukung DC Fast Charge'}</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Kapasitas Penumpang</th>
                <td className="py-4 px-6 text-white">{ev.seating_capacity} Orang</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Volume Bagasi</th>
                <td className="py-4 px-6 text-white">{ev.cargo_volume} Liter</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Ground Clearance</th>
                <td className="py-4 px-6 text-white">{ev.ground_clearance} mm</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Negara Pembuat (CBU/CKD)</th>
                <td className="py-4 px-6 text-white">{ev.made_in}</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <th className="py-4 px-6 text-gray-400 font-medium">Jaringan Dealer</th>
                <td className="py-4 px-6 text-white">{ev.dealer_network.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
