import React from 'react';

const PayCard = ({ receipt }) => {
  if (!receipt) return null;

  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Full screen occupy logic: Scale to fit with uniform side space (16px on each side)
      if (width < 640) {
        setScale((width - 32) / 620);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex items-start justify-center bg-white min-h-screen font-sans overflow-x-hidden">
      <div 
        className="bg-white border-[1.5px] border-black p-4 sm:p-5 shadow-sm origin-top transition-transform duration-300"
        style={{
          width: '620px',
          transform: `scale(${scale})`,
          marginTop: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Header Section - Logo Left (Matches Ref Image) */}
        <div className="flex items-center mb-4 gap-1">
          <div className="w-[100px] shrink-0">
            <img src="/logo.png" alt="PCMC Logo" className="w-full h-auto object-contain" />
          </div>
          <div className="flex-1 text-center pr-2">
            <h2 className="text-[#1a3a8f] font-black text-[18px] sm:text-xl devanagari leading-tight">पिंपरी चिंचवड महानगरपालिका</h2>
            <h3 className="text-[#1a3a8f] font-black text-[13px] sm:text-[15px] devanagari leading-tight">झोपडपट्टी निर्मूलन व पुनर्वसन विभाग</h3>
            <p className="text-[#1a3a8f] font-black text-[12px] sm:text-[14px] devanagari leading-tight">एकत्रित सेवा शुल्क बील</p>
            
            {/* GO Numbers - Centered in right area */}
            <div className="mt-1 text-[#1a3a8f] font-black text-[9px] sm:text-[11px] devanagari leading-tight">
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र-२०४(१) झोपसु(१), दिनांक ११ जुलै २००१<br />
              महाराष्ट्र शासन निर्णय क्र. गवसु/१२२०/प्र.क्र-३६४(२) झोपसु(१), दिनांक ३ मे २००३
            </div>
          </div>
        </div>

        {/* Dashed Line */}
        <div className="border-t-[1.5px] border-dashed border-[#1a3a8f] mb-6"></div>

        {/* Data Grid - Optimized Flex Layout */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-y-4">
            {/* Row 1 */}
            <div className="w-1/2 flex items-center pr-1">
              <span className="w-[70px] text-[11px] font-black devanagari leading-tight shrink-0">बील क्रमांक:</span>
              <div className="flex-1 bg-slate-50 border-[1.2px] border-black px-1 py-1 text-[11px] font-bold devanagari h-8 flex items-center overflow-hidden">
                {receipt.billNumber}
              </div>
            </div>
            <div className="w-1/2 flex items-center pl-1">
              <span className="w-[70px] text-[11px] font-black devanagari leading-tight shrink-0">बील दिनांक:</span>
              <div className="flex-1 bg-slate-50 border-[1.2px] border-black px-1 py-1 text-[11px] font-bold devanagari h-8 flex items-center">
                {receipt.billDate}
              </div>
            </div>

            {/* Row 2 */}
            <div className="w-1/2 flex items-center pr-1">
              <span className="w-[70px] text-[11px] font-black devanagari leading-tight shrink-0">झोपडी क्रमांक:</span>
              <div className="flex-1 bg-slate-50 border-[1.2px] border-black px-1 py-1 text-[11px] font-bold devanagari h-8 flex items-center">
                {receipt.jhopadiNumber || '3/21/J/25'}
              </div>
            </div>
            <div className="w-1/2 flex items-center pl-1">
              <span className="w-[70px] text-[11px] font-black devanagari leading-tight shrink-0">झोपडी धारक:</span>
              <div className="flex-1 bg-slate-50 border-[1.2px] border-black px-1 py-1 text-[11px] font-bold devanagari h-8 flex items-center overflow-hidden">
                {receipt.holderName}
              </div>
            </div>

            {/* Row 3 */}
            <div className="w-1/2 flex items-center pr-1">
              <span className="w-[70px] text-[11px] font-black devanagari leading-tight shrink-0">एकूण रक्कम:</span>
              <div className="flex-1 bg-slate-50 border-[1.2px] border-black px-1 py-1 text-[11px] font-black text-slate-900 h-8 flex items-center">
                ₹ {receipt.totalAmount?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="flex justify-center mt-10 mb-2">
          <button className="bg-[#789ce6] hover:bg-[#5e84d4] text-black font-black py-2 px-12 border-[1.2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[13px] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayCard;
