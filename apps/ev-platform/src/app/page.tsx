import FilterSidebar from '@/components/FilterSidebar';
import EVCard from '@/components/EVCard';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, QueryConstraint } from 'firebase/firestore';
import { EVModel } from '@/types/ev';

// In Next.js App Router, page props can be async. searchParams is a promise in Next 15, but Next 14 it's sync.
// Since the prompt specifies Next 14+, we'll type it accordingly.
export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : '';
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : '';

  let evs: EVModel[] = [];
  let errorMsg = '';

  try {
    const evsRef = collection(db, 'vehicles');
    const constraints: QueryConstraint[] = [];

    if (brand) constraints.push(where('brand', '==', brand));
    if (category) constraints.push(where('category', '==', category));

    const q = query(evsRef, ...constraints);
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      evs.push({ id: doc.id, ...doc.data() } as EVModel);
    });

    // Local filtering for price
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      evs = evs.filter(ev => ev.price_range.max >= min && ev.price_range.min <= max);
    }
  } catch (error) {
    console.error('Failed to fetch EVs from Firebase:', error);
    errorMsg = 'Koneksi ke database gagal. Pastikan konfigurasi Firebase sudah benar.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Temukan EV Anda</h1>
        <p className="text-gray-400 mt-2 text-lg">Bandingkan ratusan mobil listrik yang tersedia di Indonesia.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <FilterSidebar />
        </aside>

        {/* Grid */}
        <div className="w-full lg:w-3/4">
          {errorMsg ? (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
              {errorMsg}
            </div>
          ) : evs.length === 0 ? (
            <div className="bg-[#1e2330] border border-gray-800 text-gray-400 p-12 text-center rounded-2xl">
              <p className="text-xl">Tidak ada EV yang cocok dengan filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {evs.map(ev => (
                <EVCard key={ev.id} ev={ev} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
