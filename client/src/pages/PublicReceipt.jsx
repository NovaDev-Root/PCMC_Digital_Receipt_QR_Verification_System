// src/pages/PublicReceipt.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PayCard from '../components/PayCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function PublicReceipt() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `PCMC PayCard | ${receiptId}`;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 border border-red-200 shadow-lg text-center max-w-sm">
          <p className="text-red-600 font-bold mb-4">{error || 'Receipt not found'}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <PayCard receipt={receipt} />
    </div>
  );
}
