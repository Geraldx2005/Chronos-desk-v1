import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const Qr = () => {
  const textToEncode = "Gerald";

  return (
    <div>
      <h2>Your QR Code</h2>
        <QRCodeCanvas value={textToEncode} />
    </div>
  );
};

export default Qr;
