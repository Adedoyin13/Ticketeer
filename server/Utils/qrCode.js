const QRCode = require('qrcode');

exports.generateQrCode = async (text) => {
  try {
    const qrImage = await QRCode.toDataURL(text);
    return qrImage; // base64 image URL
  } catch (err) {
    console.error("QR Code generation error:", err);
    return null;
  }
};