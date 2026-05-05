// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ReceiptCard from '../components/ReceiptCard';

export default function AdminDashboard() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const [printingReceipt, setPrintingReceipt] = useState(null);
  const hiddenReceiptRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(`${apiUrl}/api/receipt/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReceipts(response.data.receipts || []);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) fetchReceipts();
  }, [currentUser, apiUrl]);

  const handleDelete = async (receiptId) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;

    try {
      const token = await currentUser.getIdToken();
      await axios.delete(`${apiUrl}/api/receipt/${receiptId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceipts(prev => prev.filter(r => r.receiptId !== receiptId));
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert('Failed to delete receipt');
    }
  };

  useEffect(() => {
    if (printingReceipt) {
      setTimeout(async () => {
        try {
          const element = hiddenReceiptRef.current;
          if (!element) return;

          const imgData = await toPng(element, { 
            quality: 1, 
            pixelRatio: 3, 
            style: { 
              backgroundColor: '#ffffff',
              margin: '0',
              padding: '0'
            }
          });
          
          const width = element.offsetWidth;
          const height = element.offsetHeight;
          
          const pdf = new jsPDF({
            orientation: width > height ? 'l' : 'p',
            unit: 'px',
            format: [width, height]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, width, height);
          pdf.save(`PCMC_Official_Bill_${printingReceipt.billNumber}.pdf`);
        } catch (err) {
          console.error('Error generating PDF:', err);
          alert('Failed to generate PDF. Please try again.');
        } finally {
          setPrintingReceipt(null);
        }
      }, 300);
    }
  }, [printingReceipt]);

  const handlePrint = (receipt) => {
    if (!receipt.qrCodeDataURL) {
      setPrintingReceipt(receipt);
      return;
    }
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
           data[i] = 0;
           data[i+1] = 0;
           data[i+2] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setPrintingReceipt({ ...receipt, qrCodeDataURL: canvas.toDataURL('image/png') });
    };
    img.src = receipt.qrCodeDataURL;
  };

  const [search, setSearch] = useState('');
  const filteredReceipts = receipts.filter(r =>
    r.holderName?.toLowerCase().includes(search.toLowerCase()) ||
    r.billNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-7xl animate-fade-in flex flex-col items-center">

        {/* Centered Dashboard Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#232f3e] text-white px-4 py-2 mb-4 border border-[#232f3e]">
            <span className="text-[10px] font-bold uppercase tracking-widest">Admin Control Panel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 devanagari">पावती डॅशबोर्ड</h1>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-[0.3em]">Municipal Receipt Management Console</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
          <StatCard title="Total Bills" value={receipts.length} color="blue" icon="📄" />
          <StatCard title="Paid Amount" value={`₹${receipts.filter(r => r.status === 'paid').reduce((acc, r) => acc + (r.totalAmount || 0), 0).toLocaleString('en-IN')}`} color="green" icon="💰" />
          <StatCard title="Pending" value={`₹${receipts.filter(r => r.status !== 'paid').reduce((acc, r) => acc + (r.totalAmount || 0), 0).toLocaleString('en-IN')}`} color="amber" icon="⏳" />
          <StatCard title="Efficiency" value={`${receipts.length > 0 ? Math.round((receipts.filter(r => r.status === 'paid').length / receipts.length) * 100) : 0}%`} color="purple" icon="📈" />
        </div>

        {/* Controls Card */}
        <div className="bg-white border border-slate-300 w-full">
          <div className="bg-[#232f3e] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-300">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search Name or Bill Number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 py-3 px-4 text-black placeholder:text-slate-500 font-bold devanagari focus:outline-none focus:border-[#ff9900]"
              />
            </div>
            <Link
              to="/admin/create"
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] font-semibold px-8 py-3 text-sm flex items-center justify-center transition-colors"
            >
              Create New Bill
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Accessing Records...</p>
              </div>
            ) : filteredReceipts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-500 font-bold devanagari text-lg">No records found.</p>
                <p className="text-slate-400 text-xs mt-1">Please try a different search query.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 devanagari">धारक (Beneficiary)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 devanagari">बील नं (Bill ID)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 devanagari">रक्कम (Financials)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 devanagari">स्थिती (Status)</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 devanagari">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.receiptId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="text-sm font-black text-slate-900 devanagari leading-tight">{receipt.holderName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{receipt.billDate}</div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 mb-2">
                            {receipt.billNumber}
                          </span>
                          {receipt.qrCodeDataURL ? (
                            <img src={receipt.qrCodeDataURL} alt="QR" className="w-10 h-10 border border-slate-200" title="QR Ready" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400">NO QR</div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="text-sm font-black text-slate-900">₹{receipt.totalAmount?.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[9px] font-bold border ${receipt.status === 'paid'
                          ? 'bg-green-50 text-green-700 border-green-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}>
                          {receipt.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap text-right space-x-3">
                        <button
                          onClick={() => {
                            if (!receipt.qrCodeDataURL) {
                              alert('QR Code not generated for this receipt.');
                              return;
                            }
                            const link = document.createElement('a');
                            link.href = receipt.qrCodeDataURL;
                            link.download = `PCMC_QR_${receipt.billNumber}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-4 py-2 bg-[#ff9900] text-black hover:bg-[#e38800] transition-colors border border-slate-600 text-xs font-bold"
                        >
                          QR
                        </button>
                        <button
                          onClick={() => handlePrint(receipt)}
                          className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-400 text-xs font-semibold"
                        >
                          Print
                        </button>
                        <Link
                          to={`/view-receipt/${receipt.receiptId}`}
                          target="_blank"
                          className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 transition-colors border border-blue-400 text-xs font-semibold"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(receipt.receiptId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg group"
                          title="Delete Receipt"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Receipt for PDF Generation - Exact Match for View Page */}
      {printingReceipt && (
        <div className="fixed top-0 left-[-9999px] bg-slate-50 py-8 flex flex-col items-center overflow-visible">
          <div className="bg-white shadow-xl w-full max-w-[210mm]">
            <ReceiptCard 
              receipt={printingReceipt} 
              qrDataURL={printingReceipt.qrCodeDataURL} 
              ref={hiddenReceiptRef} 
            />
          </div>
        </div>
      )}

      {printingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-700">Generating PDF...</p>
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5',
    green: 'bg-green-50 text-green-600 border-green-100 shadow-green-500/5',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/5',
  };
  return (
    <div className={`p-6 border border-slate-300 bg-white group hover:border-blue-400 transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-2xl font-black tracking-tight ${color === 'blue' ? 'text-blue-700' : color === 'green' ? 'text-green-700' : color === 'amber' ? 'text-amber-700' : 'text-purple-700'}`}>
        {value}
      </p>
    </div>
  );
}
