// src/pages/PublicReceipt.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="animate-pulse text-slate-600 font-bold devanagari">लोड होत आहे...</div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="bg-white p-8 border border-black shadow-lg text-center max-w-sm">
          <p className="text-red-600 font-bold mb-4">{error || 'Receipt not found'}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-start py-8 sm:pt-6 sm:pt-12 pb-12 px-4 sm:px-8">

      {/* Exact Document Box from Image - Rigid Width with Margins */}
      <div className="w-full max-w-[850px] bg-white border border-black p-4 sm:p-10 shadow-sm relative overflow-hidden">

        {/* Header Section - Rigid Row */}
        <div className="flex flex-row items-center gap-3 sm:gap-6">
          {/* Logo Container */}
          <div className="w-[80px] sm:w-[180px] flex-shrink-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="PCMC Logo"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Text Header Container */}
          <div className="flex-1 text-center pr-2 sm:pr-10">
            <h1 className="text-[#004a99] font-bold text-[13px] sm:text-2xl devanagari mb-0.5 sm:mb-1">
              पिंपरी चिंचवड महानगरपालिका
            </h1>
            <h2 className="text-[#004a99] font-bold text-[11px] sm:text-lg devanagari mb-0.5 sm:mb-1">
              झोपडपट्टी निर्मूलन व पुनर्वसन विभाग
            </h2>
            <h3 className="text-[#004a99] font-bold text-[10px] sm:text-md devanagari mb-2 sm:mb-4">
              एकत्रित सेवा शुल्क बील
            </h3>

            <div className="space-y-0.5 sm:space-y-1 text-[#004a99] font-bold text-[7px] sm:text-[14px] devanagari leading-tight">
              <p>महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्रक-२०४(१) झोपसु(१), दिनांक ११ जुलै २००१</p>
              <p>महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्रक-३६४(२) झोपसु(१), दिनांक ३ मे २००३</p>
            </div>
          </div>
        </div>

        {/* Dashed Separator Line */}
        <div className="border-t-[1.5px] border-dashed border-[#004a99] my-5 sm:my-10 -mx-4 sm:-mx-10"></div>

        {/* Content Grid - Rigid 2 Columns - No Stacking on Mobile */}
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-12 gap-y-6 sm:gap-y-10 px-2 sm:px-8 mt-10">

          {/* Left Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-row items-center">
              <label className="w-[50px] sm:w-36 font-bold devanagari text-[9px] sm:text-[16px] text-black pr-2">बील क्रमांक:</label>
              <div className="flex-1 border border-black rounded-none bg-[#f8f8f8] text-[9px] sm:text-[15px] font-sans text-black h-[32px] sm:h-[44px] flex items-center">
                <span className="ml-3 sm:ml-4">{receipt.billNumber}</span>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <label className="w-[50px] sm:w-36 font-bold devanagari text-[9px] sm:text-[16px] text-black pr-2">झोपडी क्रमांक:</label>
              <div className="flex-1 border border-black rounded-none bg-[#f8f8f8] text-[9px] sm:text-[15px] font-sans text-black h-[32px] sm:h-[44px] flex items-center">
                <span className="ml-3 sm:ml-4">{receipt.jhopadiNumber}</span>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <label className="w-[50px] sm:w-36 font-bold devanagari text-[9px] sm:text-[16px] text-black pr-2">एकूण रक्कम:</label>
              <div className="flex-1 border border-black rounded-none bg-[#f8f8f8] text-[9px] sm:text-[15px] font-sans text-black h-[32px] sm:h-[44px] flex items-center">
                <span className="ml-3 sm:ml-4">₹ {receipt.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-row items-center">
              <label className="w-[50px] sm:w-36 font-bold devanagari text-[9px] sm:text-[16px] text-black pr-2">बील दिनांक:</label>
              <div className="flex-1 border border-black rounded-none bg-[#f8f8f8] text-[9px] sm:text-[15px] font-sans text-black h-[32px] sm:h-[44px] flex items-center">
                <span className="ml-3 sm:ml-4">{receipt.billDate}</span>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <label className="w-[50px] sm:w-36 font-bold devanagari text-[10px] sm:text-[16px] text-black pr-2">झोपडी धारक:</label>
              <div className="flex-1 border border-black rounded-none bg-[#f8f8f8] text-[9px] sm:text-[15px] font-sans text-black h-[32px] sm:h-[44px] flex items-center overflow-hidden">
                <span className="ml-3 sm:ml-4 truncate">{receipt.holderName}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button Section */}
        <div className="mt-12 sm:mt-16 flex justify-center pb-4">
          <button
            className="w-auto bg-[#7a9ee6] hover:bg-[#5a7ec6] text-black font-bold border-[1.5px] sm:border-[2px] border-black px-10 sm:px-16 py-2 sm:py-3 rounded-none text-[12px] sm:text-[16px] transition-all shadow-[1px_1px_0px_0px_black] sm:shadow-[2px_2px_0px_0px_black] active:shadow-none"
            onClick={() => alert('Razorpay integration coming soon')}
          >
            Pay Now
          </button>
        </div>

      </div>
    </div>
  );
}
