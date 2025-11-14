import { QRCodeCanvas } from "qrcode.react";

export default function CouponCard({ coupon }) {
  return (
    <div style={{ width: "180px", height: "250px", border: "1px solid #000", padding: "10px" }}>
      {/* <h4>{coupon.name || "Coupon"}</h4>
      <p>Code: {coupon.code}</p>
      <p>Amount: {coupon.amount}</p>
      <QRCodeCanvas value={JSON.stringify(coupon)} size={70} /> */}
    </div>
  );
}

