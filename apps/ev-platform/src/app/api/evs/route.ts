import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, QueryConstraint } from 'firebase/firestore';
import { EVModel } from '@/types/ev';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const evsRef = collection(db, 'vehicles');
    const constraints: QueryConstraint[] = [];

    if (brand) constraints.push(where('brand', '==', brand));
    if (category) constraints.push(where('category', '==', category));
    
    // Note: Firestore requires a composite index if doing range queries alongside equality queries on different fields.
    // For simplicity without assuming pre-built indexes, we filter pricing locally if complex, 
    // or rely on simple where statements if possible.
    
    const q = query(evsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let evs: EVModel[] = [];
    snapshot.forEach((doc) => {
      evs.push({ id: doc.id, ...doc.data() } as EVModel);
    });

    // Local filter for prices if provided (workaround for composite index reqs)
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      evs = evs.filter(ev => ev.price_range.max >= min && ev.price_range.min <= max);
    }

    return NextResponse.json(evs);
  } catch (error) {
    console.error('Error fetching EVs:', error);
    return NextResponse.json({ error: 'Failed to fetch EVs' }, { status: 500 });
  }
}
