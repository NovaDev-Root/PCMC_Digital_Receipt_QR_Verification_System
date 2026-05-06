import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { getDb, getAuth } from '../firebase-admin.js';

const router = express.Router();

// ─── Middleware: verify Firebase ID token ───────────────────────────────────
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);

    // Strict Admin Authorization
    if (process.env.ADMIN_EMAIL && decoded.email !== process.env.ADMIN_EMAIL) {
      console.warn(`Unauthorized access attempt by: ${decoded.email}`);
      return res.status(403).json({ error: 'Forbidden: You do not have admin privileges' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// ─── POST /api/receipt/create ────────────────────────────────────────────────
router.post('/create', verifyToken, async (req, res) => {
  try {
    const {
      billNumber,
      billDate,
      validTill,
      holderName,
      address,
      area,
      landType,
      department,
      jhopadiNumber,
      areaSquareFeet,
      demandFrom,
      pendingAmount,
      currentDemand,
    } = req.body;

    if (!holderName || !billDate) {
      return res.status(400).json({ error: 'holderName and billDate are required' });
    }

    const receiptId = uuidv4();
    const totalAmount = (Number(pendingAmount) || 0) + (Number(currentDemand) || 0);

    const receiptData = {
      receiptId,
      billNumber: billNumber || `PCMC/${Date.now()}`,
      billDate,
      validTill: validTill || '',
      holderName,
      address: address || '',
      area: area || '',
      landType: landType || 'Khajagi',
      department: department || '-',
      jhopadiNumber: jhopadiNumber || '',
      areaSquareFeet: areaSquareFeet || '',
      demandFrom: demandFrom || '',
      pendingAmount: Number(pendingAmount) || 0,
      currentDemand: Number(currentDemand) || 0,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Generate QR code
    // Prioritize CLIENT_URL from environment; ensuring no localhost leak in production
    let clientUrl = process.env.CLIENT_URL;
    
    // If we are in what looks like a production environment (not localhost) 
    // but CLIENT_URL is missing, we should be very careful.
    if (!clientUrl) {
      clientUrl = 'http://localhost:5173';
      console.warn("WARNING: CLIENT_URL is not set. Falling back to localhost for QR generation.");
    }
    
    const receiptUrl = `${clientUrl.replace(/\/$/, '')}/receipt/${receiptId}`;
    console.log(`[QR GEN] Targeting URL: ${receiptUrl}`);

    const qrCodeDataURL = await QRCode.toDataURL(receiptUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Save to Firestore with QR info
    await getDb().collection('receipts').doc(receiptId).set({
      ...receiptData,
      receiptUrl,
      qrCodeDataURL
    });

    res.status(201).json({
      success: true,
      receiptId,
      receiptUrl,
      qrCodeDataURL,
      receiptData,
    });
  } catch (err) {
    console.error('Create receipt error:', err);
    res.status(500).json({ error: err.message || 'Failed to create receipt' });
  }
});


// ─── PUT /api/receipt/:receiptId ──────────────────────────────────────────
router.put('/:receiptId', verifyToken, async (req, res) => {
  try {
    const { receiptId } = req.params;
    const {
      billNumber,
      billDate,
      validTill,
      holderName,
      address,
      area,
      landType,
      department,
      jhopadiNumber,
      areaSquareFeet,
      demandFrom,
      pendingAmount,
      currentDemand,
    } = req.body;

    if (!holderName || !billDate) {
      return res.status(400).json({ error: 'holderName and billDate are required' });
    }

    const totalAmount = (Number(pendingAmount) || 0) + (Number(currentDemand) || 0);

    const updateData = {
      billNumber,
      billDate,
      validTill: validTill || '',
      holderName,
      address: address || '',
      area: area || '',
      landType: landType || 'Khajagi',
      department: department || '-',
      jhopadiNumber: jhopadiNumber || '',
      areaSquareFeet: areaSquareFeet || '',
      demandFrom: demandFrom || '',
      pendingAmount: Number(pendingAmount) || 0,
      currentDemand: Number(currentDemand) || 0,
      totalAmount,
      updatedAt: new Date().toISOString(),
    };

    await getDb().collection('receipts').doc(receiptId).update(updateData);

    res.json({
      success: true,
      receiptId,
      updateData,
    });
  } catch (err) {
    console.error('Update receipt error:', err);
    res.status(500).json({ error: err.message || 'Failed to update receipt' });
  }
});

// ─── DELETE /api/receipt/:receiptId ──────────────────────────────────────────

router.delete('/:receiptId', verifyToken, async (req, res) => {
  try {
    const { receiptId } = req.params;
    await getDb().collection('receipts').doc(receiptId).delete();
    res.json({ success: true, message: 'Receipt deleted successfully' });
  } catch (err) {
    console.error('Delete receipt error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete receipt' });
  }
});

// ─── GET /api/receipt/all ────────────────────────────────────────────────────
router.get('/all', verifyToken, async (req, res) => {
  try {
    const snapshot = await getDb()
      .collection('receipts')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const receipts = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure receiptId is present even if not in document data
      receipts.push({
        ...data,
        receiptId: data.receiptId || doc.id
      });
    });

    res.json({ success: true, receipts });
  } catch (err) {
    console.error('Fetch all receipts error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch receipts' });
  }
});

// ─── PATCH /api/receipt/:receiptId/status ───────────────────────────────────
router.patch('/:receiptId/status', verifyToken, async (req, res) => {
  try {
    const { receiptId } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use pending or paid.' });
    }

    await getDb().collection('receipts').doc(receiptId).update({ status });
    res.json({ success: true, receiptId, status });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: err.message || 'Failed to update status' });
  }
});

// ─── GET /api/receipt/:receiptId  (PUBLIC) ───────────────────────────────────
router.get('/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const doc = await getDb().collection('receipts').doc(receiptId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    res.json({ success: true, receipt: doc.data() });
  } catch (err) {
    console.error('Fetch receipt error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch receipt' });
  }
});

export default router;
