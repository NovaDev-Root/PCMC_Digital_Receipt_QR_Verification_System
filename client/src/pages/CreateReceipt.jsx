// src/pages/CreateReceipt.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QRDisplay from '../components/QRDisplay';

const API_URL = import.meta.env.VITE_API_URL || '';

const today = () => new Date().toISOString().split('T')[0];
const formatDate = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

// Bill number is now manual

function FormField({ label, marathi, children, centered }) {
  return (
    <div className={`space-y-1.5 ${centered ? 'text-center' : ''}`}>
      <label className="block text-[10px] font-black text-slate-400 devanagari">
        <span className="text-slate-600">{marathi}</span>
        {label && <span className="ml-1 opacity-50 font-sans font-bold uppercase tracking-widest">({label})</span>}
      </label>
      {children}
    </div>
  );
}

export default function CreateReceipt() {
  const { getIdToken } = useAuth();
  const navigate       = useNavigate();

  const [form, setForm] = useState({
    billNumber:     '',
    billDate:       today(),
    validTill:      '',
    holderName:     '',
    address:        '',
    area:           '',
    landType:       'Khajagi',
    customLandType: '',
    department:     '',
    jhopadiNumber:  '',
    areaSquareFeet: '',
    demandFrom:     '',
    pendingAmount:  '',
    currentDemand:  '',
  });

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [submitted, setSubmitted]   = useState(null);

  const total = (Number(form.pendingAmount) || 0) + (Number(form.currentDemand) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await getIdToken();
      const payload = {
        ...form,
        landType:   form.landType === 'Other' ? form.customLandType : form.landType,
        billDate:   formatDate(form.billDate),
        validTill:  formatDate(form.validTill),
        demandFrom: formatDate(form.demandFrom),
      };

      const res = await axios.post(`${API_URL}/api/receipt/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitted(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to connect to municipal server');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-start pt-20 p-6">
        <div className="bg-white max-w-md w-full border border-slate-300 shadow-sm">
          <div className="bg-[#0f1111] px-8 py-6 text-center border-b border-slate-300">
            <h2 className="text-white font-bold text-xl devanagari">पावती यशस्वीरित्या तयार!</h2>
            <p className="text-gray-300 text-[10px] uppercase font-semibold tracking-widest mt-1">Bill Generation Complete</p>
          </div>

          <div className="px-8 py-8">
            <div className="p-4 bg-slate-50 border border-slate-300 mb-8 flex justify-center">
              <QRDisplay
                qrDataURL={submitted.qrCodeDataURL}
                receiptUrl={submitted.receiptUrl}
                receiptId={submitted.receiptId}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => navigate(`/receipt/${submitted.receiptId}`)}
                className="bg-white hover:bg-slate-50 text-black border border-slate-400 font-semibold h-12 text-sm transition-colors flex items-center justify-center"
              >
                View Bill
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] font-semibold h-12 text-sm transition-colors flex items-center justify-center"
              >
                Create New
              </button>
            </div>

            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm py-2 text-center"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl animate-fade-in">
        
        {/* Centered Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#232f3e] text-white px-4 py-2 mb-4 border border-[#232f3e]">
            <span className="text-[10px] font-bold uppercase tracking-widest">Official PCMC Billing Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 devanagari leading-tight">
            नवीन सेवा शुल्क बील
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">Jhopadpatti Nirmulan Vibhag</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 px-6 py-4 mb-8 text-sm text-red-700 font-semibold flex items-start gap-4">
            <div>
              <p className="uppercase text-[10px] tracking-widest opacity-80 mb-0.5">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Card: Bill Details */}
          <div className="bg-white border border-slate-300 w-full">
            <div className="bg-[#f3f3f3] border-b border-slate-300 px-8 py-4">
              <h2 className="text-black font-bold text-base devanagari leading-none">बील माहिती (Bill Basic Info)</h2>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FormField marathi="बील क्रमांक" label="Bill Number">
                <input name="billNumber" value={form.billNumber} onChange={handleChange} required placeholder="उदा. 3/21/..." className="form-input font-bold" />
              </FormField>
              <FormField marathi="बील दिनांक" label="Date">
                <input name="billDate" type="date" value={form.billDate} onChange={handleChange} required className="form-input font-bold" />
              </FormField>
              <FormField marathi="ते दिनांक" label="Valid Till">
                <input name="validTill" type="date" value={form.validTill} onChange={handleChange} className="form-input font-bold" />
              </FormField>
              <FormField marathi="मागणी पासून" label="Demand From">
                <input name="demandFrom" type="date" value={form.demandFrom} onChange={handleChange} className="form-input font-bold" />
              </FormField>
            </div>
          </div>

          {/* Card: Holder Details */}
          <div className="bg-white border border-slate-300 w-full">
            <div className="bg-[#f3f3f3] border-b border-slate-300 px-8 py-4">
              <h2 className="text-black font-bold text-base devanagari leading-none">धारक माहिती (Beneficiary Details)</h2>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <FormField marathi="अर्जदाराचे नाव" label="Full Name">
                    <input name="holderName" value={form.holderName} onChange={handleChange} placeholder="नाव आडनाव लिहा" required className="form-input text-xl font-black devanagari py-5" />
                  </FormField>
                </div>
                <div className="md:col-span-2">
                  <FormField marathi="पत्ता" label="Address">
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="पत्ता लिहा..." rows="2" className="form-input devanagari py-4" />
                  </FormField>
                </div>
                <FormField marathi="क्षेत्र (एरिया)" label="Area">
                  <input name="area" value={form.area} onChange={handleChange} placeholder="एरिया..." className="form-input font-bold devanagari" />
                </FormField>
                <FormField marathi="झोपडी क्रमांक" label="Jhopadi No">
                  <input name="jhopadiNumber" value={form.jhopadiNumber} onChange={handleChange} placeholder="No." className="form-input font-black text-[#cc0000]" />
                </FormField>
                <FormField marathi="जागा मालकी" label="Land Type">
                  <select name="landType" value={form.landType} onChange={handleChange} className="form-input font-black text-slate-700 bg-slate-50">
                    <option value="Khajagi">खाजगी (Private)</option>
                    <option value="Sarkari">सरकारी (Govt)</option>
                    <option value="Municipal">महानगरपालिका (PCMC)</option>
                    <option value="Other">इतर (Other)</option>
                  </select>
                  {form.landType === 'Other' && (
                    <input name="customLandType" value={form.customLandType || ''} onChange={handleChange} placeholder="जागा मालकी लिहा..." className="form-input font-bold devanagari mt-2" required />
                  )}
                </FormField>
                <FormField marathi="विभागाचे नाव" label="Department">
                  <input name="department" value={form.department} onChange={handleChange} placeholder="विभागाचे नाव..." className="form-input font-bold devanagari" />
                </FormField>
                <FormField marathi="क्षेत्र (चौ.फू)" label="Sq. Ft.">
                  <div className="relative">
                    <input name="areaSquareFeet" value={form.areaSquareFeet} onChange={handleChange} placeholder="0" className="form-input font-black pr-16" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">SQFT</span>
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          {/* Card: Financials */}
          <div className="bg-white border border-slate-300 w-full">
            <div className="bg-[#f3f3f3] border-b border-slate-300 px-8 py-4">
              <h2 className="text-black font-bold text-base devanagari leading-none">रक्कम तपशील (Demand & Financials)</h2>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-4">
                <FormField marathi="मागणी बाकी" label="Arrears">
                  <div className="flex border border-slate-400 focus-within:border-[#e38800] transition-colors bg-white">
                    <div className="bg-[#f3f3f3] px-4 flex items-center justify-center border-r border-slate-400 text-slate-600 font-bold">₹</div>
                    <input name="pendingAmount" type="number" value={form.pendingAmount} onChange={handleChange} placeholder="0" className="flex-1 px-3 py-3 outline-none font-bold text-black text-lg w-full" />
                  </div>
                </FormField>
              </div>
              <div className="md:col-span-4">
                <FormField marathi="चालू मागणी" label="Current">
                  <div className="flex border border-slate-400 focus-within:border-[#e38800] transition-colors bg-white">
                    <div className="bg-[#f3f3f3] px-4 flex items-center justify-center border-r border-slate-400 text-slate-600 font-bold">₹</div>
                    <input name="currentDemand" type="number" value={form.currentDemand} onChange={handleChange} placeholder="0" className="flex-1 px-3 py-3 outline-none font-bold text-black text-lg w-full" />
                  </div>
                </FormField>
              </div>
              <div className="md:col-span-4">
                <div className="bg-white border-2 border-black p-4 flex flex-col items-center justify-center h-full min-h-[90px]">
                  <p className="text-[10px] font-bold text-slate-600 mb-1 devanagari">एकूण देय रक्कम <span className="font-sans uppercase tracking-widest opacity-70">(Total)</span></p>
                  <p className="text-3xl font-black text-black">₹{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Actions */}
          <div className="flex flex-col items-center gap-6 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-xl bg-[#ffd814] hover:bg-[#f7ca00] disabled:opacity-60 text-black border border-[#fcd200] font-semibold py-4 text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-sm">Processing...</span>
                </>
              ) : (
                <>
                  पावती तयार करा (Generate Receipt)
                </>
              )}
            </button>
            
            <div className="flex items-center gap-4 text-slate-300">
              <span className="w-12 h-px bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Municipal System</span>
              <span className="w-12 h-px bg-slate-200" />
            </div>
          </div>
          
        </form>
      </div>
      <div className="h-20" />
    </div>
  );
}
