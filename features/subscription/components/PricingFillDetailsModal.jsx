"use client";

import { useEffect, useId, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, XIcon } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";

/**
 * Pricing lead form in a portal overlay.
 * Scroll lock uses overflow:hidden only — not body position:fixed — so
 * backdrop-filter still sees the real page (Firefox/solid-gray bug with fixed body).
 */
export default function PricingFillDetailsModal({
  open,
  onOpenChange,
  currency,
  onSubmit,
  title = "Fill Details",
  submitLabel = "Submit",
}) {
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    enquiry: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const isIndianPricing = currency === "INR";
  const defaultCountry = currency === "USD" ? "US" : "IN";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setForm({ name: "", mobileNumber: "", email: "", enquiry: "" });
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  /** Lock scroll without position:fixed on body (breaks backdrop-filter compositing). */
  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollbarW = window.innerWidth - html.clientWidth;

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlPaddingRight: html.style.paddingRight,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      html.style.paddingRight = `${scrollbarW}px`;
      body.style.paddingRight = `${scrollbarW}px`;
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.paddingRight = prev.htmlPaddingRight;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const validate = function () {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!isValidPhoneNumber(form.mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = function (field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ ...form });
    } catch {
      /* errors are handled inside onSubmit (toast, etc.) */
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="presentation">
      {/* Semi-transparent + blur: page must stay in normal flow (no body fixed) to show through. */}
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 z-0 cursor-pointer border-0 bg-black/30 p-0 transition-opacity duration-150"
        style={{
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed left-1/2 top-1/2 z-[201] max-h-[min(90vh,800px)] w-[calc(100%-2rem)] max-w-[550px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] border-none bg-white shadow-2xl outline-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 z-10"
          onClick={() => onOpenChange(false)}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
        <h2
          id={titleId}
          className="border-b border-gray-100 p-6 pr-12 text-center text-[28px] font-bold md:text-[28px]"
        >
          {title}
        </h2>
        <div className="space-y-6 p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-2 w-full rounded-[10px] border px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#67BC2A] ${errors.name ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  international
                  country={isIndianPricing ? "IN" : undefined}
                  defaultCountry={isIndianPricing ? "IN" : defaultCountry}
                  countries={isIndianPricing ? ["IN"] : undefined}
                  value={form.mobileNumber}
                  onChange={(value) =>
                    handleInputChange("mobileNumber", value || "")
                  }
                  placeholder="Enter phone number"
                  className={errors.mobileNumber ? "phone-input-error" : ""}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.mobileNumber}
                </p>
              )}
              <style>{`
                .phone-input-wrapper .PhoneInput { width: 100%; }
                .phone-input-wrapper .PhoneInputInput {
                  width: 100%;
                  padding: 0.5rem 1rem;
                  border-radius: 10px;
                  border: 1px solid #e5e7eb;
                  outline: none;
                  transition: all 0.2s;
                }
                .phone-input-wrapper .PhoneInputInput:focus {
                  border-color: #67BC2A;
                  box-shadow: 0 0 0 2px rgba(103, 188, 42, 0.2);
                }
                .phone-input-wrapper .phone-input-error .PhoneInputInput,
                .phone-input-wrapper .PhoneInputInput.phone-input-error {
                  border-color: #ef4444;
                }
                .phone-input-wrapper .PhoneInputCountryIcon {
                  width: 1.5em;
                  height: 1.2em;
                }
                .phone-input-wrapper .PhoneInputCountrySelect {
                  padding: 0.5rem;
                  border: none;
                  background: transparent;
                  margin-right: 0.5rem;
                }
              `}</style>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-2 w-full rounded-[10px] border px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#67BC2A] ${errors.email ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#67BC2A] to-[#3C9300] py-3 text-lg font-bold text-white shadow-lg shadow-green-200 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
