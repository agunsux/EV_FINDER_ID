import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { evData } from './ev-data';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// IMPORTANT: Download your Firebase service account key from the Firebase Console
// and save it as "serviceAccountKey.json" in the root of apps/ev-platform/
const serviceAccountPath = resolve(__dirname, '../../serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('Error loading serviceAccountKey.json. Please ensure it exists at root/serviceAccountKey.json');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  console.log(`Seeding Firestore with ${evData.length} EV models...`);
  
  const batch = db.batch();
  const vehiclesCollection = db.collection('vehicles');

  for (const ev of evData) {
    const docRef = vehiclesCollection.doc(ev.id);
    batch.set(docRef, ev);
  }

  try {
    await batch.commit();
    console.log(`Successfully seeded ${evData.length} EV models!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
