// src/pages/PublicReceipt.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReceiptCard from '../components/ReceiptCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function PublicReceipt() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/api/receipt/${receiptId}`);
        setReceipt(res.data.receipt);
      } catch (err) {
        setError(err.response?.data?.error || 'Receipt not found or server error');
      } finally {
        setLoading(false);
      }
    };
    if (receiptId) load();
  }, [receiptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 border border-red-200 shadow-lg text-center max-w-sm">
          <p className="text-red-600 font-bold mb-4">{error || 'Receipt not found'}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-12 px-4">
      {/* Centered Document Display */}
      <div className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform transition-all">
        <ReceiptCard receipt={receipt} qrDataURL={receipt.qrCodeDataURL} />
      </div>

      {/* Verification Badge */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full border border-green-300 font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Authentic Municipal Document
        </div>
        
        <button 
          onClick={() => window.print()} 
          className="bg-[#232f3e] text-white px-10 py-3 font-bold hover:bg-black transition-colors"
        >
          Print Official Copy
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          button { display: none !important; }
          div[class*="Verification Badge"] { display: none !important; }
          .bg-slate-200 { background: white !important; padding: 0 !important; }
          .shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] { shadow: none !important; }
        }
      `}} />
    </div>
  );
}
