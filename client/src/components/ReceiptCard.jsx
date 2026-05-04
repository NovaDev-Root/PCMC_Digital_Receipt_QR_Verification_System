import React, { forwardRef } from 'react';

const PCMCLogo = () => (
  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
    <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto object-contain" />
  </div>
);

function Row({ label, value, accent = false }) {
  return (
    <div className={`flex items-start py-2 border-b border-dashed border-blue-200 last:border-0 ${accent ? 'bg-blue-50 rounded px-2' : ''}`}>
      <span className="text-xs font-semibold text-slate-500 w-44 flex-shrink-0 devanagari leading-snug">{label}</span>
      <span className="text-xs text-slate-800 font-medium flex-1 devanagari leading-snug">{value || '—'}</span>
    </div>
  );
}

const ReceiptCard = forwardRef(({ receipt, qrDataURL }, ref) => {
  if (!receipt) return null;

  const isPaid = receipt.status === 'paid';

  return (
    <div
      ref={ref}
      id="receipt-card"
      className="receipt-card bg-white rounded-2xl overflow-hidden"
      style={{
        border: '2px dashed #1a3a8f',
        maxWidth: '640px',
        margin: '0 auto',
        fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#1a3a8f] to-[#2563eb] px-6 py-4">
        <div className="flex items-center gap-4">
          <PCMCLogo />
          <div className="flex-1 text-center">
            <h1
              className="text-white font-bold text-lg leading-tight devanagari"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              पिंपरी चिंचवड महानगरपालिका
            </h1>
            <p className="text-blue-100 text-xs mt-0.5 devanagari">
              Pimpri Chinchwad Municipal Corporation
            </p>
          </div>
          {/* Status badge top-right */}
          <div className="flex-shrink-0">
            {isPaid ? (
              <span className="badge-paid text-xs font-bold px-3 py-1 rounded-full">✅ Paid</span>
            ) : (
              <span className="badge-pending text-xs font-bold px-3 py-1 rounded-full">⏳ Pending</span>
            )}
          </div>
        </div>

        {/* Sub-headers */}
        <div className="mt-3 text-center">
          <div
            className="bg-white/15 rounded-lg py-2 px-3 border border-white/25"
          >
            <p className="text-yellow-200 font-semibold text-sm devanagari">
              झोपडपट्टी निर्मूलन व पुनर्वसन विभाग
            </p>
            <p className="text-white font-bold text-base devanagari mt-0.5">
              एकत्रित सेवा शुल्क बील
            </p>
            <p className="text-blue-200 text-xs mt-1 devanagari leading-tight">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र.७७/नवि-१४ दि. ०४/०२/२०१३
            </p>
          </div>
        </div>
      </div>

      {/* ── Bill Info Strip ── */}
      <div className="bg-[#f0f4ff] border-b-2 border-[#1a3a8f] px-6 py-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <span className="text-xs text-slate-500 font-semibold devanagari">बील क्रमांक</span>
            <p className="text-sm font-bold text-[#1a3a8f] devanagari">{receipt.billNumber}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold devanagari">बील दिनांक</span>
            <p className="text-sm font-bold text-[#1a3a8f] devanagari">{receipt.billDate}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold devanagari">देय दिनांक पर्यंत</span>
            <p className="text-sm font-semibold text-red-700 devanagari">{receipt.validTill || '—'}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold devanagari">मागणी दिनांक</span>
            <p className="text-sm font-semibold text-slate-700 devanagari">{receipt.demandFrom || '—'}</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-4">
        {/* Holder Info */}
        <p className="text-xs font-bold text-[#cc0000] uppercase tracking-wide mb-2 devanagari">
          झोपडी धारक माहिती
        </p>
        <div className="space-y-0">
          <Row label="झोपडी धारकाचे नाव" value={receipt.holderName} />
          <Row label="पत्ता" value={receipt.address} />
          <Row label="क्षेत्र" value={receipt.area} />
          <Row label="झोपडी क्रमांक" value={receipt.jhopadiNumber} />
          <Row label="जागा मालकी" value={receipt.landType} />
          <Row label="क्षेत्र (चौ.फू)" value={receipt.areaSquareFeet} />
          <Row label="विभागाचे नाव" value={receipt.department} />
        </div>

        {/* Amount Section */}
        <p className="text-xs font-bold text-[#cc0000] uppercase tracking-wide mb-2 mt-4 devanagari">
          देय रक्कम
        </p>
        <div className="space-y-0">
          <Row label="मागणी बाकी रक्कम" value={`₹ ${receipt.pendingAmount?.toLocaleString('en-IN')}`} />
          <Row label="चालू मागणी रक्कम" value={`₹ ${receipt.currentDemand?.toLocaleString('en-IN')}`} />
        </div>

        {/* Total */}
        <div className="mt-3 rounded-xl bg-gradient-to-r from-[#1a3a8f] to-[#2563eb] p-4 flex items-center justify-between">
          <span className="text-white font-bold text-base devanagari">एकूण देय रक्कम</span>
          <span className="text-yellow-300 font-black text-2xl">
            ₹ {receipt.totalAmount?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* ── QR + Footer ── */}
      {qrDataURL && (
        <div className="px-6 pb-4 flex items-end justify-between gap-4 border-t border-dashed border-blue-200 pt-4">
          <div className="text-xs text-slate-500 max-w-xs devanagari leading-relaxed">
            <p className="font-semibold text-[#1a3a8f] mb-1">⚠️ महत्त्वाची सूचना:</p>
            <p>शुल्क भरल्यानंतर पावती जपून ठेवावी. अधिक माहितीसाठी PCMC कार्यालयाशी संपर्क साधावा.</p>
          </div>
          <div className="flex flex-col items-center flex-shrink-0">
            <img src={qrDataURL} alt="QR Code" className="w-24 h-24 rounded-lg border-2 border-blue-200" />
            <p className="text-xs text-slate-500 mt-1 text-center">Scan to verify</p>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <div className="bg-[#1a3a8f] px-6 py-2 text-center">
        <p className="text-blue-200 text-xs devanagari">
          PCMC झोपडपट्टी निर्मूलन विभाग | Official Digital Receipt
        </p>
      </div>
    </div>
  );
});

export default ReceiptCard;
