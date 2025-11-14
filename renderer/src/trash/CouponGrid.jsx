import CouponCard from "./CouponCard";

export default function CouponGrid({ coupons }) {
  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(4, 1fr)", 
      gap: "10px", 
      marginTop: "20px" 
    }}>
      {/* {coupons.slice(0, 16).map((c, i) => (
        <CouponCard key={i} coupon={c} />
      ))} */}
    </div>
  );
}
