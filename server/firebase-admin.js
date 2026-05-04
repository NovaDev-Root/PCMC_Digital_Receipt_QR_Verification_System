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
    // If a path is provided, read the JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const filePath = join(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      const sa = JSON.parse(await readFile(filePath, 'utf8'));
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(sa)
        });
      }
    } else {
      // Fallback to environment variable if provided
      let raw = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!raw) throw new Error('No Firebase credentials found in environment variables');
      
      // Handle potential escaping of newlines in the private key
      try {
        const credentials = JSON.parse(raw);
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(credentials)
          });
        }
      } catch (parseErr) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON. Ensure it is a valid single-line JSON string.');
        throw parseErr;
      }
    }
    console.log('✅ Firebase Admin initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin:', err.message);
    process.exit(1);
  }
}

// Immediate execution
initAdmin();

export const getDb = () => admin.firestore();
export const getAuth = () => admin.auth();
export default admin;
