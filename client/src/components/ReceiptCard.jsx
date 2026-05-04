import React, { forwardRef } from 'react';

const ReceiptCard = forwardRef(({ receipt, qrDataURL }, ref) => {
  if (!receipt) return null;

  return (
    <div
      ref={ref}
      id="receipt-card"
      className="receipt-card bg-white p-8 relative overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        fontFamily: "'Noto Sans Devanagari', sans-serif",
        color: '#000',
        lineHeight: '1.4',
        boxSizing: 'border-box'
      }}
    >
      {/* Official PCMC Colors */}
      {/* Deep Blue: #1a3a8f, Red: #cc0000, Stamp Blue: #2b4bb5 */}
      {/* Watermark Emblem */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img src="/logo.png" alt="" style={{ width: '70%', filter: 'grayscale(100%)', opacity: 0.07 }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Official Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-24 h-24">
            <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto" />
          </div>
          <div className="flex-1 text-center" style={{ color: '#1a3a8f' }}>
            <h1 className="text-2xl font-black devanagari leading-tight">पिंपरी चिंचवड महानगरपालिका</h1>
            <h2 className="text-xl font-bold devanagari">झोपडपट्टी निर्मूलन व पुनर्वसन विभाग</h2>
            <p className="text-lg font-bold devanagari mt-1">एकत्रित सेवा शुल्क बील</p>
            <div className="text-[10px] mt-1 devanagari leading-tight">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र.२०४(१) झोपसु(१), दिनांक ११ जुलै २००१<br />
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र.३६४(२) झोपसु(१), दिनांक ३ मे २००३
            </div>
          </div>
          <div className="w-24"></div> {/* Spacer for symmetry */}
        </div>

        <div className="border-t-2 mb-6" style={{ borderColor: '#1a3a8f' }}></div>

        {/* ── Info Grid ── */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs mb-6">
          <div className="space-y-1">
            <div className="flex"><span className="w-32 font-bold devanagari">प्रभाग:</span> <span className="devanagari">3/21/20252026/11897</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">झोपडीचे नाव:</span> <span className="devanagari">{receipt.area || 'आनंद नगर_Chinchwad'}</span></div>
            <div className="flex items-start"><span className="w-32 font-bold devanagari">झोपडी धारकाचे नाव / पत्ता:</span> <span className="flex-1 devanagari">{receipt.holderName} <br /> {receipt.address || 'Nivasi'}</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">क्षेत्र:</span> <span className="devanagari">{receipt.areaSquareFeet || '100.00'} चौ.फू</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">मागणी कालावधी पासून:</span> <span className="devanagari">{receipt.demandFrom || '01 / 04 / 2025'}</span></div>
          </div>
          <div className="space-y-1">
            <div className="flex"><span className="w-32 font-bold devanagari">बील दिनांक:</span> <span className="devanagari">{receipt.billDate}</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">जागा मालकी:</span> <span className="devanagari">{receipt.landType || 'Khajagi'}</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">विभागाचे नाव:</span> <span className="devanagari">{receipt.department || '—'}</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">झोपडी क्रमांक:</span> <span className="devanagari">{receipt.jhopadiNumber || '3/21/J/25'}</span></div>
            <div className="flex"><span className="w-32 font-bold devanagari">ते दिनांक:</span> <span className="devanagari">{receipt.validTill || '31/03/2026'}</span></div>
          </div>
        </div>

        <p className="text-[10px] italic devanagari mb-4 leading-tight" style={{ color: '#cc0000' }}>
          पिंपरी चिंचवड महानगरपालिकेच्या हद्दीत आपल्या वर नमूद केलेल्या झोपडीवरील एकत्रित सेवा शुल्काची खालीलप्रमाणे आपणास मागणी करण्यात येत आहे. या बीलात मागणी केलेली रक्कम, हे बील आपणास मिळाले पासून पंधरा दिवसाच्या आत महानगरपालिकेच्या झोपडपट्टी निर्मूलन व पुनर्वसन कार्यालयात रोख भरावी.
        </p>

        {/* ── Financial Table ── */}
        <table className="w-full border-collapse border-2 text-[13px] mb-6" style={{ borderColor: '#1a3a8f', color: '#1a3a8f' }}>
          <thead>
            <tr style={{ color: '#1a3a8f' }}>
              <th className="border-2 p-2 devanagari border-[#1a3a8f] font-black">करावे नाव</th>
              <th className="border-2 p-2 devanagari border-[#1a3a8f] font-black">मागील बाकी रक्कम रुपये</th>
              <th className="border-2 p-2 devanagari border-[#1a3a8f] font-black">चालू मागणी रक्कम रुपये</th>
              <th className="border-2 p-2 devanagari border-[#1a3a8f] font-black">एकूण मागणी रक्कम रुपये</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center font-bold text-black">
              <td className="border-2 p-2 devanagari text-left border-[#1a3a8f] font-black" style={{ color: '#1a3a8f' }}>एकत्रित सेवा शुल्क</td>
              <td className="border-2 p-2 border-[#1a3a8f]">{receipt.pendingAmount || '500'}</td>
              <td className="border-2 p-2 border-[#1a3a8f]">{receipt.currentDemand || '300'}</td>
              <td className="border-2 p-2 border-[#1a3a8f]">{receipt.totalAmount || '800'}</td>
            </tr>
            <tr className="text-center bg-white text-black">
              <td className="border-2 p-2 devanagari text-left border-[#1a3a8f] font-black" style={{ color: '#1a3a8f' }}>एकूण</td>
              <td className="border-2 p-2 border-[#1a3a8f] font-bold">{receipt.pendingAmount || '500'}</td>
              <td className="border-2 p-2 border-[#1a3a8f] font-bold">{receipt.currentDemand || '300'}</td>
              <td className="border-2 p-2 border-[#1a3a8f] font-bold">{receipt.totalAmount || '800'}</td>
            </tr>
          </tbody>
        </table>

        {/* ── Signature Section ── */}
        <div className="flex justify-end mb-8 px-4">
          <div className="text-center relative">
            <div
              className="absolute inset-0 border-4 border-double rounded-full opacity-10 transform -rotate-12 flex items-center justify-center"
              style={{ borderColor: '#2b4bb5', pointerEvents: 'none' }}
            ></div>
            <div className="relative z-10 p-2" style={{ color: '#2b4bb5' }}>
              <img src="/signature.png" alt="" className="h-12 mx-auto mb-1 opacity-80" />
              <p className="text-[11px] font-black devanagari leading-tight uppercase">
                सक्षम प्राधिकरण संस्था सहा. आयुक्त<br />
                झोपडपट्टी निर्मूलन व पुनर्वसन विभाग<br />
                पिंपरी चिंचवड महानगरपालिका, पिंपरी १८
              </p>
            </div>
          </div>
        </div>

        {/* ── Instructions ── */}
        <div className="border-t-2 border-dashed mb-4" style={{ borderColor: '#888' }}></div>
        <div className="text-center text-[12px] font-black devanagari mb-3" style={{ color: '#cc0000' }}>- महत्वाच्या सूचना -</div>
        <ol className="text-[10.5px] devanagari space-y-1 text-red-700 mb-6 list-none px-6 font-semibold" style={{ color: '#cc0000' }}>
          <li>१) एकत्रित सेवा शुल्काबाबतची सविस्तर माहिती कार्यालयात पाहण्यास मिळेल.</li>
          <li>२) रोख रक्कम झोपडपट्टी निर्मूलन व पुनर्वसन कार्यालयामध्ये भरावी व पावती घ्यावी.</li>
          <li>३) पावतीशिवाय पैसे भरले आहेत, असे ग्राह्य धरले जाणार नाही.</li>
          <li>४) एकत्रित सेवा शुल्काची रक्कम भरण्याची कार्यालयीन वेळ (सुट्टीचे दिवस सोडून) १०:०० ते दुपारी ४:०० वाजेपर्यंत.</li>
          <li>५) रक्कम भरण्यास येताना कृपया हे बिल सोबत आणावे. काही तक्रार असल्यास मागील पावत्या सोबत आणाव्यात.</li>
          <li>६) सेवा आकार हा महानगरपालिकेकडून मिळणाऱ्या सेवा, सुविधांचे प्राधान्य आहे. सेवा आकार भरला म्हणजे झोपडीचा अथवा जागेचा अधिकृतपणा झाला असे समजले जाणार नाही.</li>
          <li>७) ऑनलाईन पेमेंट करण्याकरिता https://noncoreerp.pcmcindia.gov.in/ पोर्टलवरती लॉगिन करा अथवा खाली दिलेला क्यूआर कोड द्वारे पेमेंट करण्याकरिता क्यूआर कोड स्कॅन करा.</li>
        </ol>
        <div className="border-t-2 border-dashed mb-6" style={{ borderColor: '#888' }}></div>

        {/* ── Footer / QR ── */}
        <div className="flex justify-between items-start px-4 mt-8">
          <div className="text-[11px] devanagari space-y-10 flex-1">
            <p className="font-bold leading-relaxed text-slate-800">
              बीलातील झोपडी क्षेत्रापेक्षा वाढीव क्षेत्र आढळून आल्यास त्याप्रमाणे वाढीव<br />
              क्षेत्राची एकत्रित सेवा शुल्क आकारणी व वसुली करण्यात येईल.
            </p>
            <div className="pt-4 space-y-3">
              <p className="font-bold border-b border-black w-64 pb-1">बील मिळाल्याबाबत: ___________________</p>
              <p className="font-bold">स्वाक्षरी दिनांक: ___________________</p>
            </div>
          </div>

          <div className="flex flex-col items-center relative" style={{ minWidth: '180px' }}>
            {qrDataURL && (
              <div className="relative">
                {/* Hand-written style Verification Note - Restored and Refined */}

                <div className="h-0.5 w-full bg-[#1a3a8f] -mt-1 opacity-40"></div>

                <div className="p-1 bg-white border border-slate-300 relative z-0">
                  <img src={qrDataURL} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}
            <p className="text-[9px] mt-1 text-slate-500 font-bold uppercase tracking-widest text-center">Digital Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptCard;
