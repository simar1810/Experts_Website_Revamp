"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { clientProfileFromVerifyResponse, fetchAPI } from "@/lib/api";
import { probeClientSendOtp } from "@/lib/clientMobileStatus";
import { submitPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const inputClass = (hasError) =>
  `w-full px-4 py-3.5 bg-white border text-sm font-medium rounded-xl focus:outline-none transition-all placeholder:text-gray-400 ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2 focus:ring-lime-500/25 focus:border-[var(--brand-primary)]"
  }`;

/** Same decorative corner as GetStartedModal */
function GymIllustration() {
  return (
    <Image
      className="pointer-events-none absolute right-3 top-16 z-0 h-24 w-24 select-none object-contain opacity-[0.1] sm:right-5 sm:top-[4.5rem] sm:h-28 sm:w-28"
      src="/images/gym-illustration-with-dumbell.png"
      alt=""
      height={120}
      width={120}
      aria-hidden
    />
  );
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login, consumeReturnPathAfterAuth, presetSignupDraft } = useAuth();
  const router = useRouter();

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(23);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);

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
      setCheckingMobile(false);
    }
  }, [isOpen]);

  const digitsOnlyUpTo10 = (value) =>
    String(value ?? "")
      .replace(/\D/g, "")
      .slice(0, 10);

  const handlePhoneContinueLogin = async () => {
    setTouched(true);
    const digitsOnly = digitsOnlyUpTo10(phone);

    if (digitsOnly.length !== 10) {
      setError(true);
      toast.error("Enter exactly 10 digits");
      return;
    }
    setError(false);
    setCheckingMobile(true);

    try {
      const { branch } = await probeClientSendOtp(fetchAPI, {
        mobileNumber: digitsOnly,
        countryCode: "IN",
      });

      /** Unknown number (no SMS) → signup with this number prefilled */
      if (branch === "signup") {
        presetSignupDraft(digitsOnly, "IN");
        onSwitchToRegister();
        setCheckingMobile(false);
        return;
      }

      /** Known number: send-otp already sent OTP (single call) */
      if (branch === "login") {
        setShowOtp(true);
        return;
      }

      /** Ambiguous body — prefer signup to avoid duplicate send-otp */
      toast.error(
        "Could not confirm your number. Continuing to create an account—you can sign in if you already have one.",
      );
      presetSignupDraft(digitsOnly, "IN");
      onSwitchToRegister();
    } catch (err) {
      console.error("Login OTP send failed:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not send OTP. Try again shortly.",
      );
    } finally {
      setCheckingMobile(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetchAPI(
        "/experts/client/send-otp",
        {
          mobileNumber: digitsOnlyUpTo10(phone),
          countryCode: "IN",
        },
        "POST",
      );
      setTimer(23);
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  const handleVerifyOtp = async (explicitCode) => {
    const code = (explicitCode ?? otp.join("")).replace(/\D/g, "");
    if (code.length !== 4) {
      return;
    }
    if (verifying) return;
    setVerifying(true);
    try {
      const response = await fetchAPI(
        "/experts/client/verify-otp",
        {
          mobileNumber: digitsOnlyUpTo10(phone),
          otp: code,
        },
        "POST",
      );

      const token = response?.token;
      if (!token) {
        return;
      }
      const profile = clientProfileFromVerifyResponse(response, {
        mobileNumber: digitsOnlyUpTo10(phone),
      });
      login(token, profile);
      const returnTo = consumeReturnPathAfterAuth();
      onClose();
      const pending = await submitPendingExpertEnquiry(fetchAPI);
      if (pending && !pending.skip && "threadId" in pending) {
        const q = new URLSearchParams();
        q.set("thread", String(pending.threadId));
        if (
          typeof pending.composerDraft === "string" &&
          pending.composerDraft.trim() !== ""
        ) {
          q.set("draft", pending.composerDraft);
        }
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
    if (verifying) return;
    const digits = String(value ?? "").replace(/\D/g, "");
    if (digits.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && index + i < 4; i += 1) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      const joined = newOtp.join("");
      if (/^\d{4}$/.test(joined)) {
        void handleVerifyOtp(joined);
      } else {
        const nextFocus = Math.min(index + digits.length, 3);
        requestAnimationFrame(() =>
          document.getElementById(`login-otp-${nextFocus}`)?.focus(),
        );
      }
      return;
    }

    if (value !== "" && !/^\d$/.test(digits)) return;
    const newOtp = [...otp];
    newOtp[index] = digits.slice(-1);
    setOtp(newOtp);

    if (digits && index < otp.length - 1) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
      return;
    }

    const joined = newOtp.join("");
    if (/^\d{4}$/.test(joined)) {
      void handleVerifyOtp(joined);
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
    <div className="font-lato fixed inset-0 z-9999 flex items-center justify-center overflow-hidden p-6">
      <div
        className="fixed inset-0 animate-in fade-in bg-neutral-800/55 backdrop-blur-[2px] duration-300"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-300 outline-none">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-[var(--brand-primary)] bg-white p-10 pt-12 shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
          <GymIllustration />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <div className="relative z-10 mx-auto max-w-md">
            {!showOtp ? (
              <>
                <h2 className="text-center text-[1.65rem] font-bold leading-tight tracking-tight text-gray-900">
                  Welcome back to your
                  <br />
                  Wellness Journey
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-center text-[0.9375rem] leading-relaxed text-gray-500">
                  Enter your mobile number. We&apos;ll send a code to sign in—or
                  guide you to create an account if you&apos;re new.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center text-[1.65rem] font-semibold leading-tight tracking-tight text-gray-900">
                  Sign in
                </h2>
                <p className="text-center text-[0.9375rem] text-gray-500">
                  Enter the code we sent to your phone to continue.
                </p>
              </>
            )}

            <form
              className="relative z-10 mt-6 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (verifying) return;
                if (showOtp) {
                  void handleVerifyOtp();
                } else {
                  void handlePhoneContinueLogin();
                }
              }}
            >
              {!showOtp ? (
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5 px-0.5">
                      <label
                        htmlFor="login-modal-phone"
                        className="text-sm font-bold text-gray-900"
                      >
                        Phone number
                      </label>
                      {touched && error ? (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          Enter exactly 10 digits
                        </p>
                      ) : null}
                    </div>
                    <input
                      id="login-modal-phone"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(digitsOnlyUpTo10(e.target.value));
                        if (touched && e.target.value) setError(false);
                      }}
                      placeholder="9876543210"
                      autoComplete="tel"
                      className={inputClass(touched && error)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={checkingMobile}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-primary)] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#76b813] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--brand-primary)]"
                  >
                    {checkingMobile ? (
                      <>
                        <Loader2
                          className="h-5 w-5 animate-spin"
                          aria-hidden
                        />
                        Checking…
                      </>
                    ) : (
                      <>Continue →</>
                    )}
                  </button>

                  {/* <p className="text-center text-sm text-gray-500">
                    Prefer to register first?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        presetSignupDraft("");
                        onSwitchToRegister();
                      }}
                      className="font-bold text-[var(--brand-primary)] hover:underline"
                    >
                      Get started
                    </button>
                  </p> */}
                </div>
              ) : null}

              {showOtp ? (
                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-sm font-bold text-gray-900">
                      One Time Password (OTP)
                    </label>
                    <div className="flex flex-row flex-wrap items-center gap-3">
                      <div className="flex flex-1 justify-start gap-2">
                        {otp.map((val, idx) => (
                          <input
                            key={idx}
                            id={`login-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={val}
                            onChange={(e) =>
                              handleOtpChange(idx, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            disabled={verifying}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="h-12 w-11 rounded-lg border-2 border-gray-200 bg-white text-center text-lg font-bold text-gray-900 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-lime-500/25 disabled:cursor-not-allowed disabled:opacity-60"
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
                            : "border-[var(--brand-primary)] bg-white text-[var(--brand-primary)] hover:bg-lime-50"
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

                  <div className="flex w-full justify-center">
                    <button
                      type="submit"
                      disabled={verifying || checkingMobile}
                      className="inline-flex h-auto w-[200px] max-w-full flex-none items-center justify-center gap-2 rounded-2xl bg-[var(--brand-primary)] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#76b813] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--brand-primary)]"
                    >
                      {verifying ? (
                        <>
                          <Loader2
                            className="h-5 w-5 animate-spin"
                            aria-hidden
                          />
                          Verifying…
                        </>
                      ) : (
                        <>Continue →</>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtp(false);
                        setTimer(23);
                        setOtp(["", "", "", ""]);
                      }}
                      className="text-sm font-semibold text-[var(--brand-primary)] underline underline-offset-2 hover:text-[#76b813]"
                    >
                      Wrong number? Go back
                    </button>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
