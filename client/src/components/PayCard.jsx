import React from 'react';
import ReceiptCard from './ReceiptCard';

const PayCard = ({ receipt }) => {
  if (!receipt) return null;

  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const targetWidth = 794; // approx 210mm in pixels at 96dpi
      
      if (width < targetWidth + 32) { // 32px padding
        setScale((width - 32) / targetWidth); 
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-start bg-slate-50 min-h-screen font-sans overflow-x-hidden pt-8 pb-20">
      <div 
        ref={containerRef}
        className="origin-top transition-transform duration-300 flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          width: '794px', // Fixed width to match A4 proportions for scaling
        }}
      >
        <div className="shadow-xl border border-slate-200 bg-white">
          <ReceiptCard receipt={receipt} qrDataURL={receipt.qrCodeDataURL} />
        </div>
        
        {/* Pay Now Button */}
        <div className="flex justify-center mt-12 mb-8 w-full">
          <button className="bg-[#4a6eb0] hover:bg-[#3a5a9e] text-white font-bold py-4 px-24 rounded-lg shadow-lg text-[20px] transition-all hover:shadow-xl active:scale-95">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayCard;
