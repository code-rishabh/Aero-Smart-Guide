import React from 'react';
import { Download, X } from 'lucide-react';
import { generateQRCode, downloadQRCode } from '@/utils/qrcode';

interface QRCodeModalProps {
  guideId: string;
  guideName: string;
  onDownload: () => void;
  onClose: () => void;
}

export default function QRCodeModal({ guideId, guideName, onDownload, onClose }: QRCodeModalProps) {
  const [qrUrl, setQrUrl] = React.useState<string>('');

  React.useEffect(() => {
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
      onDownload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-olive">Download Guide QR Code</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-khaki" />
          </button>
        </div>
        
        <p className="text-sm text-khaki-dark mb-4">
          Please download the QR code for your guide before continuing. This code will be needed for VR access.
        </p>

        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          {qrUrl && (
            <img 
              src={qrUrl} 
              alt={`QR Code for ${guideName}`}
              className="w-48 h-48 object-contain mb-4"
            />
          )}
          
          <button
            onClick={handleDownload}
            className="w-full flex justify-center items-center px-4 py-2 bg-brass hover:bg-brass-light text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
} 