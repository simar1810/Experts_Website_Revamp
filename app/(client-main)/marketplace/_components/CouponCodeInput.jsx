"use client";

import { useMemo } from "react";

function normalizeCouponCode(value) {
  return String(value || "").trim().toUpperCase();
}

export default function CouponCodeInput({
  couponCode = "",
  couponDescription = "",
  /** Shown after a successful checkout preview (affiliate coach code or server copy for product coupon). */
  checkoutHint = "",
  value = "",
  onChange,
}) {
  const normalizedCouponCode = useMemo(
    () => normalizeCouponCode(couponCode),
    [couponCode],
  );
  const normalizedValue = useMemo(() => normalizeCouponCode(value), [value]);

  const showProductDescription =
    Boolean(couponDescription) &&
    Boolean(normalizedCouponCode) &&
    normalizedValue === normalizedCouponCode;

  const showCheckoutHint =
    Boolean(String(checkoutHint || "").trim()) && Boolean(normalizedValue);

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
      {showCheckoutHint ? (
        <p className="mt-2 text-xs font-semibold leading-relaxed text-[#75904f]">
          {String(checkoutHint).trim()}
        </p>
      ) : showProductDescription ? (
        <p className="mt-2 text-xs font-semibold leading-relaxed text-[#75904f]">
          {couponDescription}
        </p>
      ) : null}
    </>
  );
}
