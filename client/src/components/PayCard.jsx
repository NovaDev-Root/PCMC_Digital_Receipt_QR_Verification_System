import React from 'react';

const PayCard = ({ receipt }) => {
  if (!receipt) return null;

  return (
    <div className="w-full flex flex-col items-center bg-white min-h-screen font-sans p-2 md:p-4 mt-4">
      <div className="w-full max-w-3xl  border-2 border-black p-3 sm:p-6 md:p-10 shadow-sm relative">

        {/* Header Section */}
        <div className="flex flex-row items-center w-full mb-3 md:mb-4">
          <div className="mr-1 sm:mr-3 md:mr-6 flex-shrink-0">
            <img src="/logo.png" alt="PCMC" className="w-[75px] sm:w-[90px] md:w-32 h-auto" />
          </div>
          <div className="flex-1 text-center font-bold devanagari leading-tight sm:leading-snug" style={{ color: '#13357b' }}>
            <p className="text-[11.5px] sm:text-[14px] md:text-[18px]">पिंपरी चिंचवड महानगरपालिका</p>
            <p className="text-[10.5px] sm:text-[13px] md:text-[16px]">झोपडपट्टी निर्मूलन व पुनर्वसन विभाग</p>
            <p className="text-[9.5px] sm:text-[12px] md:text-[15px]">एकत्रित सेवा शुल्क बील</p>
            <p className="text-[8.5px] sm:text-[11px] md:text-[14px] mt-1">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. २०४(१) झोपसु(१), दिनांक ११ जुलै २००१
            </p>
            <p className="text-[8.5px] sm:text-[11px] md:text-[14px] mt-0.5">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र. ३६४(२) झोपसु(१), दिनांक ३ मे २००३
            </p>
          </div>
        </div>

        {/* Dashed Line */}
        <div
          className="w-full mb-4"
          style={{
            height: '1.5px',
            backgroundImage: 'linear-gradient(to right, #13357b 65%, transparent 35%)',
            backgroundPosition: 'center',
            backgroundSize: '12px 100%',
            backgroundRepeat: 'repeat-x'
          }}
        ></div>

        {/* Form Grid */}
        <div className="w-full grid grid-cols-2 gap-x-2 sm:gap-x-4 md:gap-x-12 gap-y-3 md:gap-y-6 mb-6 md:mb-8 px-0 sm:px-4 md:px-8">
          <div className="flex items-center">
            <label className="w-[45%] md:w-28 font-bold text-[9px] sm:text-[11px] md:text-sm devanagari text-black mr-1 md:mr-0">बील क्रमांक:</label>
            <input
              type="text"
              readOnly
              value={receipt.billNumber}
              className="w-[55%] md:flex-1 border border-black bg-white px-1 sm:px-2 md:px-3 py-1 md:py-1.5 text-[9px] sm:text-[11px] md:text-sm font-sans focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <label className="w-[45%] md:w-28 font-bold text-[9px] sm:text-[11px] md:text-sm devanagari text-black mr-1 md:mr-0">बील दिनांक:</label>
            <input
              type="text"
              readOnly
              value={receipt.billDate}
              className="w-[55%] md:flex-1 border border-black bg-white px-1 sm:px-2 md:px-3 py-1 md:py-1.5 text-[9px] sm:text-[11px] md:text-sm font-sans focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <label className="w-[45%] md:w-28 font-bold text-[9px] sm:text-[11px] md:text-sm devanagari text-black mr-1 md:mr-0">झोपडी क्रमांक:</label>
            <input
              type="text"
              readOnly
              value={receipt.jhopadiNumber || '-'}
              className="w-[55%] md:flex-1 border border-black bg-white px-1 sm:px-2 md:px-3 py-1 md:py-1.5 text-[9px] sm:text-[11px] md:text-sm font-sans focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <label className="w-[45%] md:w-28 font-bold text-[9px] sm:text-[11px] md:text-sm devanagari text-black mr-1 md:mr-0">झोपडी धारक:</label>
            <input
              type="text"
              readOnly
              value={receipt.holderName}
              className="w-[55%] md:flex-1 border border-black bg-white px-1 sm:px-2 md:px-3 py-1 md:py-1.5 text-[9px] sm:text-[11px] md:text-sm font-sans devanagari focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <label className="w-[45%] md:w-28 font-bold text-[9px] sm:text-[11px] md:text-sm devanagari text-black mr-1 md:mr-0">एकूण रक्कम:</label>
            <input
              type="text"
              readOnly
              value={`₹ ${receipt.totalAmount || '0'}`}
              className="w-[55%] md:flex-1 border border-black bg-white px-1 sm:px-2 md:px-3 py-1 md:py-1.5 text-[9px] sm:text-[11px] md:text-sm font-sans focus:outline-none"
            />
          </div>
        </div>

        {/* Button & Links */}
        <div className="w-full flex flex-col items-center gap-4 mt-6 md:mt-10 mb-2 md:mb-4">
          <button
            onClick={() => alert('Payment Gateway Integration Coming Soon!')}
            className="bg-[#7b9de8] hover:bg-[#6285d6] text-black font-bold py-1.5 sm:py-2 md:py-2.5 px-8 sm:px-12 md:px-16 border border-black md:border-2 text-[11px] sm:text-[12px] md:text-sm font-sans transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)] md:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] md:active:translate-x-[2px] md:active:translate-y-[2px]"
          >
            Pay Now
          </button>


        </div>
      </div>
    </div>
  );
};

export default PayCard;
