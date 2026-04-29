"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import CouponCodeInput from "./CouponCodeInput";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const RAZORPAY_KEY =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function postWithAuth(endpoint, body) {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("client_token");
    window.dispatchEvent(new Event("auth_unauthorized"));
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

function userPrefill(user) {
  const contactRaw = user?.mobileNumber || user?.phoneNumber || user?.contact || "";
  const digits = String(contactRaw).replace(/\D/g, "");

  return Object.fromEntries(
    [
      ["name", user?.name],
      ["email", user?.email],
      ["contact", digits.length >= 10 ? digits.slice(-10) : ""],
    ].filter(([, value]) => value != null && String(value).trim() !== ""),
  );
}

export default function ProductCheckout({ partner, product, price = "" }) {
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [busy, setBusy] = useState(false);

  const productSlug = product?.slug;
  const partnerSlug = partner?.slug;
  const redirectUrl =
    typeof product?.redirectUrl === "string" ? product.redirectUrl.trim() : "";

  async function handleBuyNow() {
    if (!productSlug || !partnerSlug) {
      toast.error("This product is not available to purchase.");
      return;
    }

    if (!isAuthenticated) {
      openLoginModal?.();
      return;
    }

    if (!RAZORPAY_KEY) {
      toast.error("Set NEXT_PUBLIC_RAZORPAY_KEY_ID for Razorpay checkout.");
      return;
    }

    setBusy(true);
    try {
      const orderData = await postWithAuth(
        `/experts/client/partner-products/${encodeURIComponent(
          partnerSlug,
        )}/${encodeURIComponent(productSlug)}/order`,
        { couponCode },
      );

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Payment checkout failed to load");
        return;
      }

      const options = {
        key: orderData.keyId || RAZORPAY_KEY,
        name: "WellnessZ",
        description: product?.name || "Partner product",
        order_id: orderData.orderId,
        prefill: userPrefill(user),
        theme: { color: "#357200" },
        handler: async (rzResponse) => {
          try {
            await postWithAuth("/experts/client/partner-products/payments/verify", {
              paymentId: String(orderData.paymentId),
              razorpayOrderId: rzResponse.razorpay_order_id,
              razorpayPaymentId: rzResponse.razorpay_payment_id,
              razorpaySignature: rzResponse.razorpay_signature,
            });
            toast.success("Payment successful");
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (response) => {
        const err = response?.error || {};
        toast.error(
          [err.description, err.reason, err.code].filter(Boolean).join(" - ") ||
            "Payment failed. Please try again.",
        );
      });
      rz.open();
    } catch (err) {
      toast.error(err.message || "Could not start payment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <CouponCodeInput
        couponCode={product?.couponCode}
        couponDescription={product?.couponDescription}
        value={couponCode}
        onChange={setCouponCode}
      />
      {price ? (
        <button
          type="button"
          disabled={busy}
          onClick={handleBuyNow}
          className="mt-5 flex h-[58px] w-full items-center justify-center rounded-[4px] bg-[#357200] px-5 text-[14px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_14px_rgba(6,79,31,0.2)] transition hover:bg-[#055f24] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? "Please wait..." : `Buy Now${price ? ` - ${price}` : ""}`}
        </button>
      ) : redirectUrl ? (
        <a
          href={redirectUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex h-[58px] w-full items-center justify-center rounded-[4px] bg-[#357200] px-5 text-[14px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_14px_rgba(6,79,31,0.2)] transition hover:bg-[#055f24]"
        >
          Buy Now
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 flex h-[58px] w-full cursor-not-allowed items-center justify-center rounded-[4px] bg-[#d7ded1] px-5 text-[14px] font-black uppercase tracking-[0.18em] text-white"
        >
          Buy Now
        </button>
      )}
    </>
  );
}
