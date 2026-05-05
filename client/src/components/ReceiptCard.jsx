import React, { forwardRef } from 'react';

const ReceiptCard = forwardRef(({ receipt, qrDataURL }, ref) => {
  if (!receipt) return null;

  // Colors based on the PDF image
  const primaryBlue = '#1e3a8a'; // Dark blue for headers and lines
  const textBlue = '#1e3a8a'; // Dark blue for general text
  const alertRed = '#c23b3b'; // Red for instructions
  const signatureBlue = '#4a6eb0'; // Original medium blue for the signature
  const borderColor = '#1e3a8a'; // Black borders

  return (
    <div
      ref={ref}
      id="receipt-card"
      className="receipt-card bg-white relative overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: 6,
        padding: 20,
        fontFamily: "'Noto Sans Devanagari', sans-serif",
        color: '#000',
        lineHeight: '1.4',
        boxSizing: 'border-box',
        backgroundColor: '#fff'
      }}
    >
      {/* Watermark Emblem */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img src="/logo.png" alt="" style={{ width: '40.5%', opacity: 0.08, transform: 'translateY(-32%)' }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Official Header ── */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-28 flex-shrink-0 mr-4">
            <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto" />
          </div>
          <div className="text-center" style={{ color: primaryBlue }}>
            <h1 className="text-[20px] font-bold devanagari leading-snug">पिंपरी चिंचवड महानगरपालिका</h1>
            <h2 className="text-[18px] font-bold devanagari leading-snug">झोपडपट्टी निर्मूलन व पुनर्वसन विभाग</h2>
            <p className="text-[15px] font-bold devanagari leading-snug">एकत्रित सेवा शुल्क बील</p>
            <div className="text-[12px] devanagari leading-tight font-bold mt-1">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. २०४(१) झोपसु(१), दिनांक ११ जुलै २००१<br />
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. ३६४(२) झोपसु(१), दिनांक ३ मे २००३
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed mb-2 mt-1" style={{ borderColor: borderColor }}></div>

        {/* ── Info Grid ── */}
        <div className="flex justify-between text-[13px] mb-2 font-bold" style={{ color: textBlue }}>
          <div className="w-[55%] space-y-1">
            <div className="flex"><span className="w-48 devanagari">बील क्रमांक:</span> <span className="devanagari text-black">{receipt.billNumber}</span></div>
            <div className="flex"><span className="w-48 devanagari">झोपडपट्टीचे नाव:</span> <span className="devanagari text-black">{receipt.area || '—'}</span></div>
            <div className="flex items-start"><span className="w-48 devanagari">झोपडी धारकाचे नाव / पत्ता:</span> <span className="flex-1 devanagari text-black">{receipt.holderName} <br /> {receipt.address || '—'}</span></div>
            <div className="flex"><span className="w-48 devanagari">वापर:</span> <span className="devanagari text-black">{receipt.usage || 'निवासी'}</span></div>
            <div className="flex"><span className="w-48 devanagari">क्षेत्र:</span> <span className="devanagari text-black">{receipt.areaSquareFeet || '0.00'} चौ.फू</span></div>
            <div className="flex"><span className="w-48 devanagari">मागणी कालावधी पासून:</span> <span className="devanagari text-black">{receipt.demandFrom || '—'}</span></div>
          </div>
          <div className="w-[40%] space-y-1">
            <div className="flex"><span className="w-36 devanagari">बील दिनांक:</span> <span className="devanagari text-black">{receipt.billDate}</span></div>
            <div className="flex"><span className="w-36 devanagari">जागा मालकी:</span> <span className="devanagari text-black">{receipt.landType || 'Khajagi'}</span></div>
            <div className="flex"><span className="w-36 devanagari">विभागाचे नाव:</span> <span className="devanagari text-black">{receipt.department || '—'}</span></div>
            <div className="flex"><span className="w-36 devanagari">झोपडी क्रमांक:</span> <span className="devanagari text-black">{receipt.jhopadiNumber || '—'}</span></div>
            <div className="flex"><span className="w-36 devanagari">ते दिनांक:</span> <span className="devanagari text-black">{receipt.validTill || '—'}</span></div>
          </div>
        </div>

        <p className="text-[11px] devanagari mb-2 mt-1 leading-tight font-bold" style={{ color: alertRed }}>
          पिंपरी चिंचवड महानगरपालिकेच्या हद्दीत आपल्या वर नमूद केलेल्या झोपडीवरील एकत्रित सेवा शुल्काची खालीलप्रमाणे आपणास मागणी करण्यात येत आहे. या बीलात मागणी केलेली रक्कम, हे बील आपणास मिळाले पासून पंधरा दिवसाच्या आत महानगरपालिकेच्या झोपडपट्टी निर्मूलन व पुनर्वसन कार्यालयात रोख भरावी.
        </p>

        {/* ── Financial Table ── */}
        <table className="w-full border-collapse border-2 text-[13px] mb-2 mt-1" style={{ borderColor: borderColor }}>
          <thead>
            <tr style={{ color: primaryBlue }}>
              <th className="border-2 p-1 devanagari border-inherit font-bold text-center w-1/4">कराचे नाव</th>
              <th className="border-2 p-1 devanagari border-inherit font-bold text-center w-1/4">मागील बाकी रक्कम रुपये</th>
              <th className="border-2 p-1 devanagari border-inherit font-bold text-center w-1/4">चालू मागणी रक्कम रुपये</th>
              <th className="border-2 p-1 devanagari border-inherit font-bold text-center w-1/4">एकूण मागणी रक्कम रुपये</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center font-bold text-black">
              <td className="border-2 p-1 devanagari text-left border-inherit" style={{ color: primaryBlue, borderColor: borderColor }}>एकत्रित सेवा शुल्क</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.pendingAmount || '500'}</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.currentDemand || '300'}</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.totalAmount || '800'}</td>
            </tr>
            <tr className="text-center text-black font-bold">
              <td className="border-2 p-1 devanagari text-left border-inherit" style={{ color: primaryBlue, borderColor: borderColor }}>एकूण</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.pendingAmount || '500'}</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.currentDemand || '300'}</td>
              <td className="border-2 p-1 border-inherit text-black">{receipt.totalAmount || '800'}</td>
            </tr>
          </tbody>
        </table>

        {/* ── Signature Section ── */}
        <div className="flex justify-end mb-0 px-4">
          <div className="text-center relative">
            <div className="relative z-10 p-2" style={{ color: signatureBlue }}>
              <img src="/signature.png" alt="Signature" className="h-16 mx-auto mb-1 opacity-90 mix-blend-multiply" />
              <p className="text-[10px] font-bold devanagari leading-tight">
                सक्षम प्राधिकरण संस्था सहा. आयुक्त<br />
                झोपडपट्टी निर्मूलन व पुनर्वसन विभाग<br />
                पिंपरी चिंचवड महानगरपालिका, पिंपरी १८
              </p>
            </div>
          </div>
        </div>

        {/* ── Instructions ── */}
        <div className="relative flex items-center justify-center mb-0.5">
          <div className="absolute w-full border-t-2 border-dashed" style={{ borderColor: borderColor }}></div>

        </div>

        <ol className="text-[10px] devanagari mb-4 mt-1 list-none font-bold leading-snug" style={{ color: alertRed }}>
          <div className="flex items-center justify-center mt-2 px-4 relative z-10 text-[14px] font-bold devanagari" style={{ color: alertRed }}>
            - महत्त्वाच्या सूचना -
          </div>
          <li>१) एकत्रित सेवा शुल्काबाबतची सविस्तर माहिती कार्यालयात पहावयास मिळेल.</li>
          <li>२) रोख रक्कम झोपडपट्टी निर्मूलन व पुनर्वसन कार्यालयामध्ये भरावी व पावती घ्यावी.</li>
          <li>३) पावतीशिवाय पैसे भरले आहेत, असे ग्राह्य धरले जाणार नाही.</li>
          <li>४) एकत्रित सेवा शुल्काची रक्कम भरण्याची कार्यालयीन वेळ (सुट्टीचे दिवस सोडून) १०:०० ते दुपारी ४:०० वाजेपर्यंत</li>
          <li>५) रक्कम भरण्यास येताना कृपया हे बिल सोबत आणावे. काही तक्रारअसल्यास मागील पावत्या सोबत आणाव्यात.</li>
          <li>६) सेवा आकार हा महानगरपालिकेकडून मिळणाऱ्या सेवा, सुविधांचे प्राधान्य आहे. सेवा आकार भरला म्हणजे झोपडीचा अथवा जागेचा अधिकृतपणा झाला असे समजले जाणार नाही.</li>
          <li>७) ऑनलाईन पेमेंट करण्याकरिता https://noncoreerp.pcmcindia.gov.in/ पोर्टलवरती लॉगिन करा अथवा खाली दिलेला क्यूआर कोड द्वारे पेमेंट करण्याकरिता क्यूआर कोड स्कॅन करा.</li>
        </ol>

        <div className="border-t-2 border-dashed mb-2" style={{ borderColor: borderColor }}></div>

        {/* ── Footer / QR ── */}
        <div className="text-[13px] devanagari text-center font-bold mb-4" style={{ color: primaryBlue }}>
          <p className="leading-relaxed">
            बीलातील झोपडी क्षेत्रापेक्षा वाढीव क्षेत्र आढळून आल्यास त्याप्रमाणे वाढीव<br />
            क्षेत्राची एकत्रित सेवा शुल्क आकारणी व वसुली करण्यात येईल.
          </p>
        </div>

        <div className="flex justify-between items-start px-2 mb-2">
          <div className="flex-1 text-[13px] devanagari" style={{ color: primaryBlue }}>
            <div className="space-y-0 text-left">
              <p className="font-bold">बील मिळाल्याबाबत</p>
              <p className="font-bold">स्वाक्षरी दिनांक</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            {qrDataURL && (
              <img
                src={qrDataURL}
                alt="QR Code"
                className="w-36 h-36 border-4 border-white shadow-sm"
                style={{ filter: 'grayscale(100%) contrast(200%)', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptCard;
