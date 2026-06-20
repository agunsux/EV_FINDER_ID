import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://evfinder.id';

  // Fetch all EVs
  const evs: any[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'vehicles'));
    snapshot.forEach(doc => {
      evs.push(doc.id);
    });
  } catch (e) {
    console.error(e);
  }

  const evUrls = evs.map((id) => ({
    url: `${baseUrl}/evs/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...evUrls,
  ];
}
