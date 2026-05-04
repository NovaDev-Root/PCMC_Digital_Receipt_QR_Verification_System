// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
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

  useEffect(() => {
    if (printingReceipt && hiddenReceiptRef.current) {
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(hiddenReceiptRef.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
          pdf.save(`PCMC_Bill_${printingReceipt.billNumber}.pdf`);
        } catch (err) {
          console.error('Error generating PDF:', err);
        } finally {
          setPrintingReceipt(null);
        }
      }, 500);
    }
  }, [printingReceipt]);

  const [search, setSearch] = useState('');
  const filteredReceipts = receipts.filter(r => 
    r.holderName?.toLowerCase().includes(search.toLowerCase()) || 
    r.billNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-7xl animate-fade-in flex flex-col items-center">
        
        {/* Centered Dashboard Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#232f3e] text-white px-4 py-2 mb-4 border border-[#232f3e]">
            <span className="text-[10px] font-bold uppercase tracking-widest">Admin Control Panel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 devanagari tracking-tight">पावती डॅशबोर्ड</h1>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-[0.3em]">Municipal Receipt Management Console</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
          <StatCard title="Total Bills" value={receipts.length} color="blue" />
          <StatCard title="Paid Amount" value={`₹${receipts.filter(r => r.status === 'paid').reduce((acc, r) => acc + (r.totalAmount || 0), 0).toLocaleString('en-IN')}`} color="green" />
          <StatCard title="Pending" value={`₹${receipts.filter(r => r.status !== 'paid').reduce((acc, r) => acc + (r.totalAmount || 0), 0).toLocaleString('en-IN')}`} color="amber" />
          <StatCard title="Efficiency" value={`${receipts.length > 0 ? Math.round((receipts.filter(r => r.status === 'paid').length / receipts.length) * 100) : 0}%`} color="purple" />
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
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] devanagari">धारक (Beneficiary)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] devanagari">बील नं (Bill ID)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] devanagari">रक्कम (Financials)</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] devanagari">स्थिती (Status)</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] devanagari">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.receiptId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="text-sm font-black text-slate-900 devanagari leading-tight">{receipt.holderName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{receipt.billDate}</div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {receipt.billNumber}
                        </span>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="text-sm font-black text-slate-900">₹{receipt.totalAmount?.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[9px] font-bold border ${
                          receipt.status === 'paid' 
                            ? 'bg-green-50 text-green-700 border-green-300' 
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {receipt.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap text-right space-x-3">
                        <button 
                          onClick={() => setPrintingReceipt(receipt)}
                          className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-400 text-xs font-semibold"
                        >
                          Print
                        </button>
                        <Link 
                          to={`/receipt/${receipt.receiptId}`} 
                          target="_blank" 
                          className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 transition-colors border border-blue-400 text-xs font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Receipt for PDF Generation */}
      {printingReceipt && (
        <div className="fixed top-0 left-[-9999px]">
          <div className="w-[800px] p-8 bg-white">
            <ReceiptCard receipt={printingReceipt} ref={hiddenReceiptRef} />
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
    <div className={`p-6 border border-slate-300 bg-white`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
