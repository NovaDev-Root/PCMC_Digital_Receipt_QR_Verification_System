import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReceiptCard from '../components/ReceiptCard';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function OriginalReceiptView() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blackQr, setBlackQr] = useState(null);
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const element = receiptRef.current.querySelector('.receipt-card');
      if (!element) throw new Error('Receipt element not found');
      
      const imgData = await toPng(element, { 
        quality: 1, 
        pixelRatio: 3, 
        style: { backgroundColor: '#ffffff' }
      });
      
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      
      const pdf = new jsPDF({
        orientation: width > height ? 'l' : 'p',
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`PCMC_Official_Bill_${receipt.billNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    document.title = `Official Receipt | ${receiptId}`;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/api/receipt/${receiptId}`);
        setReceipt(res.data.receipt);
        
        // Convert QR to black if it exists
        if (res.data.receipt?.qrCodeDataURL) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] < 200 || data[i+1] < 200 || data[i+2] < 200) {
                 data[i] = 0; data[i+1] = 0; data[i+2] = 0;
              }
            }
            ctx.putImageData(imageData, 0, 0);
            setBlackQr(canvas.toDataURL('image/png'));
          };
          img.src = res.data.receipt.qrCodeDataURL;
        }
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
    <div className="min-h-screen bg-slate-50 py-8 flex flex-col items-center">
      <div className="mb-4">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow-md print:hidden mr-4"
        >
          Print (Browser)
        </button>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold shadow-md print:hidden disabled:bg-green-400"
        >
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
      <div className="bg-white shadow-xl overflow-x-auto w-full max-w-[210mm]" ref={receiptRef}>
        <ReceiptCard receipt={receipt} qrDataURL={blackQr || receipt.qrCodeDataURL} />
      </div>
    </div>
  );
}
