import QRCode from "qrcode";

export const generateQR = async (data) => {
  const obj = JSON.parse(data);
  try {
    return await QRCode.toDataURL(obj.code, {
      margin: 0,          // ✅ Remove white border
      width: 256,         // Optional: control size
      color: {
        dark: "#000000",
        light: "#FFFFFF00", // Transparent background (optional)
      },
    });
  } catch (error) {
    console.error("QR generation failed", error);
    return null;
  }
};
