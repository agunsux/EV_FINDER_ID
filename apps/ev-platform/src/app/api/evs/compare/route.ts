import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { EVModel } from '@/types/ev';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
    }

    const ids = idsParam.split(',');
    
    // Using Promise.all to fetch documents concurrently
    const evs = await Promise.all(ids.map(async (id) => {
      const docRef = doc(db, 'vehicles', id.trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as EVModel;
      }
      return null;
    }));

    // Filter out any nulls if an ID wasn't found
    const validEvs = evs.filter((ev): ev is EVModel => ev !== null);

    return NextResponse.json(validEvs);
  } catch (error) {
    console.error('Error comparing EVs:', error);
    return NextResponse.json({ error: 'Failed to compare EVs' }, { status: 500 });
  }
}
