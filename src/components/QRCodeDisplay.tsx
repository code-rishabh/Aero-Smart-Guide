import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { generateQRCode, downloadQRCode } from '@/utils/qrcode';

interface QRCodeDisplayProps {
  guideId: string;
  guideName: string;
}

export default function QRCodeDisplay({ guideId, guideName }: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      const qrData = {
        guideId,
        title: guideName,
        version: "1.0",
        timestamp: new Date().toISOString()
      };
      
      try {
        const url = await generateQRCode(qrData);
        setQrUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [guideId, guideName]);

  const handleDownload = () => {
    if (qrUrl) {
      const fileName = `${guideName.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
      downloadQRCode(qrUrl, fileName);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-brass-light/20">
      {qrUrl && (
        <>
          <img 
            src={qrUrl} 
            alt={`QR Code for ${guideName}`}
            className="w-48 h-48 object-contain"
          />
          <button
            onClick={handleDownload}
            className="mt-4 inline-flex items-center px-4 py-2 bg-brass hover:bg-brass-light text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </button>
        </>
      )}
    </div>
  );
} 