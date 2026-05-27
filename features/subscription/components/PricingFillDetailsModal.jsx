"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Pricing lead form using shadcn/Radix Dialog (portal, overlay, focus trap, scroll lock).
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

  const isIndianPricing = currency === "INR";
  const defaultCountry = currency === "USD" ? "US" : "IN";

  useEffect(() => {
    if (!open) {
      setForm({ name: "", mobileNumber: "", email: "", enquiry: "" });
      setErrors({});
      setLoading(false);
    }
  }, [open]);

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

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-40 border-0 bg-black/35 p-0 supports-backdrop-filter:backdrop-blur-sm"
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="z-50 flex max-h-[min(90vh,800px)] w-[calc(100%-2rem)] max-w-[550px] flex-col gap-0 overflow-y-auto rounded-[20px] border-none bg-white p-0 text-neutral-900 shadow-2xl sm:max-w-[550px]"
        showCloseButton
        onOpenAutoFocus={(e) => {
          // Keep focus where it is to avoid any browser scroll jump on open.
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          // Avoid restoring focus to a trigger in a way that may scroll page.
          e.preventDefault();
        }}
      >
        <DialogTitle className="border-b border-gray-100 p-6 pr-12 text-center text-[28px] font-bold leading-tight md:text-[28px]">
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Enter your details to continue with this plan.
        </DialogDescription>
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
            className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-linear-to-r from-[#67BC2A] to-[#3C9300] py-3 text-lg font-bold text-white shadow-lg shadow-green-200 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
