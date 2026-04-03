"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { clientProfileFromVerifyResponse, fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function GetStartedModal({ isOpen, onClose }) {
  const { login, openLoginModal } = useAuth();
  const router = useRouter();

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(23);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  // Body scroll lock
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
      setName("");
      setPhone("");
      setEmail("");
      setCity("");
      setState("");
      setOtp(["", "", "", ""]);
      setErrors({});
      setTouched(false);
      setVerifyingOtp(false);
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    setTouched(true);
    const newErrors = {};
    if (!name) newErrors.name = true;
    if (!phone) newErrors.phone = true;
    if (!email) newErrors.email = true;
    if (!city) newErrors.city = true;
    if (!state) newErrors.state = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      console.log("name", name);
      console.log("phone", phone);
      console.log("email", email);
      console.log("city", city);
      console.log("state", state);
      const res = await fetchAPI(
        "/experts/client/register",
        {
          name: name,
          mobileNumber: phone,
          email: email,
          city: city,
          state: state,
        },
        "POST",
      );
      setShowOtp(true);
      console.log(res);
    } catch (error) {
      console.error("Registration failed:", error);
      // Even if it fails, we show OTP for now as per user's flow
      setShowOtp(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetchAPI(
        "/experts/client/send-otp",
        {
          mobileNumber: phone,
        },
        "POST",
      );
      setTimer(23);
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      const response = await fetchAPI(
        "/experts/client/verify-otp",
        {
          mobileNumber: phone,
          otp: otp.join(""),
        },
        "POST",
      );

      if (response == null || response === undefined) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const token = response.token;
      if (!token) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const profile = clientProfileFromVerifyResponse(response, {
        name,
        email,
        city,
        state,
        mobileNumber: phone,
      });
      login(token, profile);
      onClose();
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Verification failed. Please try again.";
      toast.error(message);
      console.error("Verification failed:", error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop - fixed and filling viewport */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[520px] animate-in fade-in zoom-in duration-300 outline-none z-10">
        {/* Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-[#71BC2B]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X size={24} />
          </button>

          <div className="max-w-md mx-auto">
            {!showOtp ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8 tracking-tight">
                  Get Started with Experts
                </h2>
                <div className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="block text-sm font-bold text-gray-900">
                        Name
                      </label>
                      {touched && errors.name && (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">
                          (required)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touched && e.target.value)
                          setErrors((prev) => ({ ...prev, name: false }));
                      }}
                      placeholder="Write here..."
                      className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && errors.name ? "border-red-500 focus:ring-red-500/10" : "border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500"}`}
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="block text-sm font-bold text-gray-900">
                        Phone Number
                      </label>
                      {touched && errors.phone && (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">
                          (required)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (touched && e.target.value)
                          setErrors((prev) => ({ ...prev, phone: false }));
                      }}
                      placeholder="Write here..."
                      className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && errors.phone ? "border-red-500 focus:ring-red-500/10" : "border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500"}`}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="block text-sm font-bold text-gray-900">
                        Email
                      </label>
                      {touched && errors.email && (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">
                          (required)
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched && e.target.value)
                          setErrors((prev) => ({ ...prev, email: false }));
                      }}
                      placeholder="Write here..."
                      className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && errors.email ? "border-red-500 focus:ring-red-500/10" : "border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500"}`}
                    />
                  </div>

                  {/* City & State Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="block text-sm font-bold text-gray-900">
                          City
                        </label>
                        {touched && errors.city && (
                          <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">
                            (req)
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (touched && e.target.value)
                            setErrors((prev) => ({ ...prev, city: false }));
                        }}
                        placeholder="Select city"
                        className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && errors.city ? "border-red-500 focus:ring-red-500/10" : "border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="block text-sm font-bold text-gray-900">
                          State
                        </label>
                        {touched && errors.state && (
                          <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">
                            (req)
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          if (touched && e.target.value)
                            setErrors((prev) => ({ ...prev, state: false }));
                        }}
                        placeholder="Select state"
                        className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && errors.state ? "border-red-500 focus:ring-red-500/10" : "border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500"}`}
                      />
                    </div>
                  </div>

                  {/* Send OTP Button */}
                  <div className="pt-4 flex flex-col items-center gap-4">
                    <button
                      onClick={handleSendOtp}
                      className="w-full py-4 bg-[#71BC2B] hover:bg-[#63a525] text-white rounded-full font-bold text-base shadow-lg shadow-lime-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      Send OTP →
                    </button>

                    <p className="text-sm text-gray-500 font-medium">
                      Already registered?{" "}
                      <button
                        onClick={openLoginModal}
                        className="text-[#71BC2B] font-bold hover:underline"
                      >
                        Login instead
                      </button>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {/* OTP Title */}
                <h2 className="text-xl sm:text-2xl font-black text-center text-gray-900 tracking-tight">
                  One Time Password (OTP) Verification
                </h2>

                {/* 4 OTP Boxes */}
                <div className="flex justify-center gap-3 sm:gap-4 py-2">
                  {otp.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-gray-100 rounded-2xl text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-lime-500 transition-all bg-gray-50 focus:bg-white"
                    />
                  ))}
                </div>

                {/* Resend Row */}
                <div className="flex items-center justify-between px-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Resend OTP in{" "}
                    <span className="text-[#71BC2B] font-bold">{timer}</span>{" "}
                    Seconds
                  </p>
                  <button
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors border ${timer > 0 ? "text-gray-400 border-gray-100 cursor-not-allowed" : "text-[#71BC2B] hover:bg-lime-50 border-lime-100"}`}
                  >
                    Resend OTP
                  </button>
                </div>

                {/* Verify Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="w-full py-4 bg-[#71BC2B] hover:bg-[#63a525] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full font-bold text-base shadow-lg shadow-lime-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {verifyingOtp ? "Verifying…" : "Verify →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
