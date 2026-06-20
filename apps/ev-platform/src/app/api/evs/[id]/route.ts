import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { EVModel } from '@/types/ev';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const docRef = doc(db, 'vehicles', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() } as EVModel;
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'EV not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching EV:', error);
    return NextResponse.json({ error: 'Failed to fetch EV' }, { status: 500 });
  }
}
