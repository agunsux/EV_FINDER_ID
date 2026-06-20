import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

export function getAdminDb() {
  if (!getApps().length) {
    try {
      let credential;
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
      } else {
        const serviceAccountPath = path.resolve(process.cwd(), '../../serviceAccountKey.json');
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          credential = cert(serviceAccount);
        }
      }
      
      if (credential) {
        initializeApp({ credential });
      } else {
        initializeApp();
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin in Next.js:', error);
    }
  }
  return getFirestore();
}
