import QRCode from 'qrcode';

interface QRCodeData {
  _id: string;
  name: string;
}

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      width: 300,
      margin: 2,
      color: {
        dark: '#242926', // Olive color for QR
        light: '#FFFFFF' // White background
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const downloadQRCode = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 