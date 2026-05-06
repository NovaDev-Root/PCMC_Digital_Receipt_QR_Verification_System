import React, { forwardRef, useState, useEffect } from 'react';

const ReceiptCard = forwardRef(({ receipt, qrDataURL, signatureDataURL }, ref) => {
  if (!receipt) return null;

  // Colors based on the PDF image
  const primaryBlue = '#1e3a8a'; // Dark blue for headers and lines
  const textBlue = '#1e3a8a'; // Dark blue for general text
  const alertRed = '#c23b3b'; // Red for instructions
  const signatureBlue = '#1e40af'; // Solid blue for the signature text
  const borderColor = '#1e3a8a'; // Black borders
  const [processedSignature, setProcessedSignature] = useState(signatureDataURL || null);

  useEffect(() => {
    if (signatureDataURL) {
      setProcessedSignature(signatureDataURL);
      return;
    }
    let isMounted = true;
    const processSignature = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      // Use absolute path to avoid any resolution issues
      img.src = window.location.origin + "/signature.png";
      
      img.onload = () => {
        if (!isMounted) return;
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Target blue color components for #1e40af
          const targetR = 30;
          const targetG = 64;
          const targetB = 175;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // If pixel is light (background), make it transparent
            if (r > 160 && g > 160 && b > 160) {
              data[i + 3] = 0;
            } else {
              // If pixel is dark (signature ink), color it blue
              data[i] = targetR;
              data[i + 1] = targetG;
              data[i + 2] = targetB;
              // Slightly boost alpha for clearer signature
              data[i + 3] = Math.min(255, data[i + 3] * 1.5);
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          setProcessedSignature(canvas.toDataURL('image/png'));
        } catch (err) {
          console.error("Signature processing failed:", err);
          // Fallback to original image if processing fails
          setProcessedSignature(img.src);
        }
      };
      img.onerror = () => {
        console.error("Failed to load signature image from:", img.src);
      };
    };
    processSignature();
    return () => { isMounted = false; };
  }, []);

  return (
    <div
      ref={ref}
      id="receipt-card"
      className="receipt-card bg-white relative overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: 0,
        padding: 12,
        boxShadow: 'none',
        fontFamily: "'Noto Sans Devanagari', sans-serif",
        color: '#000',
        lineHeight: '1.4',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        border: 'none',
        outline: 'none'
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
        <div className="flex items-center justify-center mb-1">
          <div className="w-28 flex-shrink-0 mr-4">
            <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto" />
          </div>
          <div className="text-center" style={{ color: primaryBlue }}>
            <h1 className="text-[20px] font-bold devanagari leading-snug">पिंपरी चिंचवड महानगरपालिका</h1>
            <h2 className="text-[18px] font-bold devanagari leading-snug">झोपडपट्टी निर्मूलन व पुनर्वसन विभाग</h2>
            <p className="text-[15px] font-bold devanagari leading-snug">एकत्रित सेवा शुल्क बील</p>
            <div className="text-[12px] devanagari leading-tight font-bold mt-1">
              <span style={{ fontFamily: 'sans-serif' }}>महाराष्ट्र</span> शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. २०४(१) झोपसु(१), दिनांक ११ जुलै २००१<br />
              <span style={{ fontFamily: 'sans-serif' }}>महाराष्ट्र</span> शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. ३६४(२) झोपसु(१), दिनांक ३ मे २००३
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed mb-2 mt-1" style={{ borderColor: borderColor }}></div>

        {/* ── Info Grid ── */}
        <div className="flex justify-between text-[13px] mb-1 font-bold" style={{ color: textBlue }}>
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

        <p className="text-[11px] devanagari mb-2 mt-3 leading-tight font-bold" style={{ color: alertRed }}>
          पिंपरी चिंचवड महानगरपालिकेच्या हद्दीत आपल्या वर नमूद केलेल्या झोपडीवरील एकत्रित सेवा शुल्काची खालीलप्रमाणे आपणास मागणी करण्यात येत आहे. या बीलात मागणी केलेली रक्कम, हे बील आपणास मिळाले पासून पंधरा दिवसाच्या आत महानगरपालिकेच्या झोपडपट्टी निर्मूलन व पुनर्वसन कार्यालयात रोख भरावी.
        </p>

        {/* ── Financial Table ── */}
        <table className="w-full border-collapse border text-[13px] mb-1 mt-0.5" style={{ borderColor: borderColor }}>
          <thead>
            <tr style={{ color: primaryBlue }}>
              <th className="border py-1 px-1 align-middle devanagari border-inherit font-bold text-center w-1/4">कराचे नाव</th>
              <th className="border py-1 px-1 align-middle devanagari border-inherit font-bold text-center w-1/4">मागील बाकी रक्कम रुपये</th>
              <th className="border py-1 px-1 align-middle devanagari border-inherit font-bold text-center w-1/4">चालू मागणी रक्कम रुपये</th>
              <th className="border py-1 px-1 align-middle devanagari border-inherit font-bold text-center w-1/4">एकूण मागणी रक्कम रुपये</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center font-medium text-black" style={{ borderColor: borderColor }}>
              <td className="border py-1 px-1 align-middle devanagari text-left border-inherit font-bold" style={{ color: primaryBlue }}>एकत्रित सेवा शुल्क</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.pendingAmount || '500'}</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.currentDemand || '300'}</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.totalAmount || '800'}</td>
            </tr>
            <tr className="text-center text-black font-medium" style={{ borderColor: borderColor }} >
              <td className="border py-1 px-1 align-middle devanagari text-left border-inherit font-bold" style={{ color: primaryBlue }}>एकूण</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.pendingAmount || '500'}</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.currentDemand || '300'}</td>
              <td className="border py-1 px-1 align-middle border-inherit text-black">{receipt.totalAmount || '800'}</td>
            </tr>
          </tbody>
        </table>

        {/* ── Signature Section ── */}
        <div className="flex justify-end mb-0 px-4 mt-2 mb-1">
          <div className="text-center relative">
            <div className="relative z-10 p-0" style={{ color: signatureBlue }}>
              <img 
                src={processedSignature || "/signature.png"} 
                alt="Signature" 
                className="h-16 mx-auto mb-0.5" 
                style={!processedSignature ? { filter: 'brightness(0.8) sepia(1) hue-rotate(190deg) saturate(1000%)', mixBlendMode: 'multiply' } : {}} 
              />
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
        <div className="text-[13px] devanagari text-center font-bold" style={{ color: primaryBlue }}>
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
                className="w-36 h-36 border border-white shadow-sm"
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptCard;
