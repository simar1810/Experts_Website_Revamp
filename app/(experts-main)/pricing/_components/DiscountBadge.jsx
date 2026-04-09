import React from "react";

const DiscountBadge = ({ discountValue }) => {
  return (
    <div className="bg-[#67BC2A1A] text-[#67BC2A] border border-[#67BC2A] text-center text-xs px-4 py-2 rounded-full">
      {discountValue}% Off
    </div>
  );
};

export default DiscountBadge;
