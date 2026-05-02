"use client";

import { useMemo } from "react";

function normalizeCouponCode(value) {
  return String(value || "").trim().toUpperCase();
}

export default function CouponCodeInput({
  couponCode = "",
  couponDescription = "",
  value = "",
  onChange,
}) {
  const normalizedCouponCode = useMemo(
    () => normalizeCouponCode(couponCode),
    [couponCode],
  );
  const showDescription =
    Boolean(couponDescription) &&
    Boolean(normalizedCouponCode) &&
    normalizeCouponCode(value) === normalizedCouponCode;

  return (
    <>
      <label htmlFor="coupon-code" className="sr-only">
        Coupon code
      </label>
      <input
        id="coupon-code"
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value.toUpperCase())}
        placeholder="APPLY COUPON CODE"
        className="h-[58px] w-full rounded-[4px] border border-[#dfe5d8] bg-white px-8 text-[12px] font-black uppercase tracking-[0.2em] text-[#263616] outline-none placeholder:text-[#c6cbbf]"
      />
      {showDescription ? (
        <p className="mt-2 text-xs font-semibold text-[#75904f]">
          {couponDescription}
        </p>
      ) : null}
    </>
  );
}
