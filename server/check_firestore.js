import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(
  await readFile(new URL('./service-account.json', import.meta.url))
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkReceipts() {
  const snapshot = await db.collection('receipts').get();
  console.log(`Found ${snapshot.size} receipts.`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, billNumber: ${data.billNumber}, receiptId: ${data.receiptId}`);
  });
}

checkReceipts().catch(console.error);
