"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightIcon, X } from "lucide-react";
import { clientProfileFromVerifyResponse, fetchAPI } from "@/lib/api";
import { resolvePostAuthEnquiryDraftText } from "@/lib/expertListingChat";
import { submitPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const inputClass = (hasError) =>
  `w-full px-4 py-3.5 bg-white border text-sm font-medium rounded-xl focus:outline-none transition-all placeholder:text-gray-400 ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2 focus:ring-lime-500/25 focus:border-[#84cc16]"
  }`;

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login, consumeReturnPathAfterAuth } = useAuth();
  const router = useRouter();

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(23);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (isOpen && showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, showOtp, timer]);

  useEffect(() => {
    if (!isOpen) {
      setShowOtp(false);
      setTimer(23);
      setPhone("");
      setOtp(["", "", "", ""]);
      setError(false);
      setTouched(false);
      setVerifying(false);
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    setTouched(true);
    if (!phone.trim()) {
      setError(true);
      return;
    }

    try {
      await fetchAPI(
        "/experts/client/send-otp",
        {
          mobileNumber: phone.trim(),
        },
        "POST",
      );
      setShowOtp(true);
    } catch (err) {
      console.error("Login OTP failed:", err);
      setShowOtp(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetchAPI(
        "/experts/client/send-otp",
        {
          mobileNumber: phone.trim(),
        },
        "POST",
      );
      setTimer(23);
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    try {
      const response = await fetchAPI(
        "/experts/client/verify-otp",
        {
          mobileNumber: phone.trim(),
          otp: otp.join(""),
        },
        "POST",
      );

      const token = response?.token;
      if (!token) {
        return;
      }
      const profile = clientProfileFromVerifyResponse(response, {
        mobileNumber: phone.trim(),
      });
      login(token, profile);
      const returnTo = consumeReturnPathAfterAuth();
      onClose();
      const pending = await submitPendingExpertEnquiry(fetchAPI);
      if (pending && !pending.skip && "threadId" in pending) {
        const q = new URLSearchParams();
        q.set("thread", String(pending.threadId));
        const draftText = resolvePostAuthEnquiryDraftText(
          pending,
          profile,
          phone.trim(),
        );
        if (draftText.trim()) q.set("draft", draftText);
        router.push(`/dashboard/enquiries?${q.toString()}`);
        return;
      }
      if (pending && "error" in pending && pending.error) {
        toast.error(pending.error);
      }
      router.push(returnTo);
    } catch (err) {
      console.error("Login verification failed:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value !== "" && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`login-otp-${index - 1}`);
      prev?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="font-lato fixed inset-0 z-9999 flex items-center justify-center overflow-hidden p-4 sm:p-6">
      <div
        className="fixed inset-0 animate-in fade-in bg-neutral-800/55 backdrop-blur-[2px] duration-300"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-300 outline-none">
        <div className="relative rounded-[1.75rem] border-2 border-[#84cc16] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.12)] sm:rounded-[2rem] sm:p-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 sm:right-5 sm:top-5"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <div className="relative mx-auto max-w-md">
            <h2 className="font-lexend text-center text-[1.65rem] font-semibold leading-8 tracking-tight text-gray-900">
              Welcome back to your
              <br />
              Wellness Journey
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-center text-[0.9375rem] leading-5 text-gray-500 ">
              Log in to explore trusted experts, manage bookings, and continue
              where you left off.
            </p>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (verifying) return;
                if (showOtp) {
                  void handleVerifyOtp();
                } else {
                  void handleSendOtp();
                }
              }}
            >
              <div>
                <div className="mb-1.5 flex items-center justify-between px-0.5">
                  <label className="text-sm font-bold text-gray-900">
                    Phone Number
                  </label>
                  {touched && error && (
                    <span className="text-xs font-semibold text-red-500">
                      Required
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (touched && e.target.value) setError(false);
                  }}
                  placeholder="+91 9876543210"
                  disabled={showOtp}
                  readOnly={showOtp}
                  className={`${inputClass(touched && error)} ${showOtp ? "bg-gray-50 text-gray-600" : ""}`}
                />
              </div>

              {showOtp && (
                <div>
                  <label className="mb-3 block text-sm font-bold text-gray-900">
                    One Time Password (OTP)
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <div className="flex flex-1 justify-center gap-2 sm:justify-start">
                      {otp.map((val, idx) => (
                        <input
                          key={idx}
                          id={`login-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          className="h-12 w-10 rounded-lg border-2 border-gray-200 bg-white text-center text-lg font-bold text-gray-900 focus:border-[#84cc16] focus:outline-none focus:ring-2 focus:ring-lime-500/25 sm:h-12 sm:w-11"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timer > 0}
                      className={`shrink-0 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                        timer > 0
                          ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                          : "border-[#84cc16] bg-white text-[#84cc16] hover:bg-lime-50"
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {timer > 0
                      ? `Resend OTP in ${timer} Seconds`
                      : "You can resend the OTP now."}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-1">
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#84cc16] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#76b813] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#84cc16]"
                >
                  {verifying ? (
                    `Signing in…`
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div>Continue</div> <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {!showOtp && (
                  <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="font-bold text-[#84cc16] hover:underline"
                    >
                      Register Now
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
