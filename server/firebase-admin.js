// server/firebase-admin.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initAdmin() {
  try {
    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (saJson) {
      // Use JSON string directly
      console.log('📦 Using Firebase Service Account from environment variable JSON');
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(saJson))
        });
      }
    } else if (saPath) {
      // Use path to file
      // Robust check: if the path starts with '{', someone likely pasted the JSON into the path variable
      if (saPath.trim().startsWith('{')) {
        console.log('📦 Detected JSON in PATH variable, parsing as JSON...');
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(saPath))
          });
        }
      } else {
        const filePath = join(__dirname, saPath);
        console.log(`📂 Using Firebase Service Account from file: ${filePath}`);
        const sa = JSON.parse(await readFile(filePath, 'utf8'));
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(sa)
          });
        }
      }
    } else {
      throw new Error('No Firebase credentials found (FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH)');
    }
    console.log('✅ Firebase Admin initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin:', err.message);
    // Don't exit process in dev, but in prod we might want to
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}

// Immediate execution
initAdmin();

export const getDb = () => admin.firestore();
export const getAuth = () => admin.auth();
export default admin;
