// src/components/QRDisplay.jsx
export default function QRDisplay({ qrDataURL, receiptUrl, receiptId }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = `PCMC_QR_${receiptId}.png`;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="text-center animate-scale-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-white border border-slate-300">
          <img
            src={qrDataURL}
            alt="QR Code"
            className="w-56 h-56"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-1">Scan to verify receipt</p>
      <p className="text-xs text-blue-600 font-mono break-all px-4 mb-4">
        {receiptUrl}
      </p>

      <div className="flex flex-row gap-4 justify-center">
        <button
          id="btn-download-qr"
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center bg-[#ff9900] hover:bg-[#e38800] text-black text-sm font-semibold h-12 border border-slate-400 rounded-none transition-colors"
        >
          Download QR
        </button>
        <button
          id="btn-copy-link"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center bg-[#f3f4f6] hover:bg-[#e5e7eb] text-black text-sm font-semibold h-12 border border-slate-400 rounded-none transition-colors"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
