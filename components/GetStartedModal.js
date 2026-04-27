"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { X } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { clientProfileFromVerifyResponse, fetchAPI } from "@/lib/api";
import { resolvePostAuthEnquiryDraftText } from "@/lib/expertListingChat";
import { submitPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  getSortedCountries,
  getStatesForCountry,
  MAX_CITIES_IN_SELECT,
} from "@/lib/addressRegionUtils";

const SELECT_CHEVRON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;

const emptyLocation = () => ({
  countryCode: "",
  country: "",
  stateCode: "",
  state: "",
  city: "",
  pincode: "",
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** @returns {string | null} error message, or null if valid */
function getPincodeError(pincode, countryCode) {
  const p = (pincode || "").trim();
  if (!p) return "Required";
  const code = (countryCode || "").toUpperCase();
  if (code === "IN" && !/^\d{6}$/.test(p)) return "Enter a 6-digit PIN";
  if (code === "US" && !/^\d{5}(-\d{4})?$/.test(p)) {
    return "Enter a valid ZIP code";
  }
  if (p.length < 2 || p.length > 12) return "Enter a valid postal code";
  if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{0,11}$/u.test(p)) {
    return "Enter a valid postal code";
  }
  return null;
}

/**
 * @param {object} params
 * @returns {Record<string, string>}
 */
function validateGetStartedForm({
  name,
  email,
  phone,
  location,
  agreeTerms,
  hasStateList,
}) {
  const errors = {};
  const nameT = (name || "").trim();
  if (!nameT) errors.name = "Required";
  else if (nameT.length < 2) errors.name = "Enter at least 2 characters";

  const emailT = (email || "").trim();
  if (!emailT) errors.email = "Required";
  else if (!EMAIL_RE.test(emailT)) {
    errors.email = "Enter a valid email address";
  }

  const phoneT = (phone || "").trim();
  const digits = phoneT.replace(/\D/g, "");
  if (!phoneT) errors.phone = "Required";
  else if (digits.length < 8 || digits.length > 15) {
    errors.phone = "Enter a valid phone number (8–15 digits)";
  }

  if (!location.countryCode?.trim() || !location.country?.trim()) {
    errors.country = "Select a country";
  }

  if (hasStateList) {
    if (!location.stateCode?.trim()) {
      errors.state = "Select state / region";
    }
  } else if (!location.state?.trim()) {
    errors.state = "Required";
  }

  if (!location.city?.trim()) errors.city = "Required";

  const pc = getPincodeError(location.pincode, location.countryCode);
  if (pc) errors.pincode = pc;

  if (!agreeTerms) {
    errors.terms = "Please accept the terms to continue.";
  }

  return errors;
}

const selectClass = (hasError) =>
  `w-full px-4 py-3.5 bg-white border text-sm font-medium text-gray-900 rounded-xl focus:outline-none transition-all appearance-none cursor-pointer bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2 focus:ring-lime-500/25 focus:border-[#84cc16]"
  }`;

const inputClass = (hasError) =>
  `w-full px-4 py-3.5 bg-white border text-sm font-medium rounded-xl focus:outline-none transition-all placeholder:text-gray-400 ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2 focus:ring-lime-500/25 focus:border-[#84cc16]"
  }`;

function GymIllustration() {
  return (
    <Image
      className="pointer-events-none absolute -bottom-5 right-0 h-40 w-40 object-contain object-bottom opacity-[0.5] text-gray-800"
      src="/images/gym-illustration-with-dumbell.png"
      alt="gym-illustration-with-dumbell"
      height={300}
      width={300}
    />
  );
}

export default function GetStartedModal({ isOpen, onClose }) {
  const { login, openLoginModal, consumeReturnPathAfterAuth } = useAuth();
  const router = useRouter();

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(23);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(emptyLocation);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [blurred, setBlurred] = useState({
    name: false,
    email: false,
    phone: false,
    country: false,
    state: false,
    city: false,
    pincode: false,
  });

  const locationRef = useRef(location);
  locationRef.current = location;
  const postcodeLookupAbortRef = useRef(null);

  const countries = useMemo(() => getSortedCountries(), []);
  const states = useMemo(
    () => getStatesForCountry(location.countryCode),
    [location.countryCode],
  );
  const cities = useMemo(() => {
    if (!location.countryCode || !location.stateCode) return [];
    return [
      ...City.getCitiesOfState(location.countryCode, location.stateCode),
    ].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [location.countryCode, location.stateCode]);

  const hasStateList = states.length > 0;

  const fieldErrors = useMemo(
    () =>
      validateGetStartedForm({
        name,
        email,
        phone,
        location,
        agreeTerms,
        hasStateList,
      }),
    [name, email, phone, location, agreeTerms, hasStateList],
  );

  const visibleError = useCallback(
    (key) => {
      if (key === "terms") {
        return submitAttempted && fieldErrors.terms ? fieldErrors.terms : "";
      }
      if (!submitAttempted && !blurred[key]) return "";
      return fieldErrors[key] || "";
    },
    [blurred, fieldErrors, submitAttempted],
  );

  const markBlurred = useCallback((key) => {
    setBlurred((b) => (b[key] ? b : { ...b, [key]: true }));
  }, []);

  const useCitySelect =
    Boolean(location.countryCode && location.stateCode && hasStateList) &&
    cities.length > 0 &&
    cities.length <= MAX_CITIES_IN_SELECT;
  const showCityTextInput = !useCitySelect;

  const suggestPostcodeForLocation = useCallback(async (snapshot) => {
    const cityVal = snapshot.city?.trim();
    const stateVal = snapshot.state?.trim();
    const countryVal = snapshot.country?.trim();
    if (!cityVal || !stateVal || !countryVal) return;

    postcodeLookupAbortRef.current?.abort();
    const ac = new AbortController();
    postcodeLookupAbortRef.current = ac;

    try {
      const res = await fetch(
        `/api/lookup-postcode?${new URLSearchParams({
          city: cityVal,
          state: stateVal,
          country: countryVal,
        }).toString()}`,
        { signal: ac.signal },
      );
      if (!res.ok) return;
      const data = await res.json();
      const pc = typeof data.postcode === "string" ? data.postcode.trim() : "";
      if (!pc) return;
      setLocation((prev) =>
        prev.city.trim() === cityVal &&
        prev.state.trim() === stateVal &&
        prev.country.trim() === countryVal
          ? { ...prev, pincode: pc }
          : prev,
      );
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.error("Postcode lookup failed:", e);
    }
  }, []);

  useEffect(() => {
    return () => postcodeLookupAbortRef.current?.abort();
  }, []);

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
      setLocation(emptyLocation());
      setAgreeTerms(false);
      setNewsletter(false);
      setOtp(["", "", "", ""]);
      setSubmitAttempted(false);
      setBlurred({
        name: false,
        email: false,
        phone: false,
        country: false,
        state: false,
        city: false,
        pincode: false,
      });
      setVerifyingOtp(false);
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    setSubmitAttempted(true);
    const e = validateGetStartedForm({
      name,
      email,
      phone,
      location,
      agreeTerms,
      hasStateList,
    });
    if (Object.keys(e).length > 0) {
      return;
    }

    try {
      const data = await fetchAPI(
        "/experts/client/register",
        {
          name: name.trim(),
          mobileNumber: phone.trim(),
          email: email.trim(),
          city: location.city.trim(),
          state: location.state.trim(),
          countryCode: location.countryCode || "IN",
          countryName: location.country.trim(),
          pincode: location.pincode.trim(),
          newsletterOptIn: newsletter,
        },
        "POST",
      );
      if (data?.status_code === 200) {
        setShowOtp(true);
        return;
      }
      const msg =
        typeof data?.message === "string" && data.message.trim()
          ? data.message.trim()
          : "Could not start registration. Please try again.";
      toast.error(msg);
    } catch (error) {
      console.error("Registration failed:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetchAPI(
        "/experts/client/send-otp",
        {
          mobileNumber: phone,
          countryCode: location.countryCode || "IN",
        },
        "POST",
      );
      setTimer(23);
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("").replace(/\D/g, "");
    if (code.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      const response = await fetchAPI(
        "/experts/client/verify-otp",
        {
          mobileNumber: phone,
          otp: code,
          countryCode: location.countryCode || "IN",
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
        city: location.city,
        state: location.state,
        mobileNumber: phone,
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
          phone,
        );
        if (draftText.trim()) q.set("draft", draftText);
        router.push(`/dashboard/enquiries?${q.toString()}`);
        return;
      }
      if (pending && "error" in pending && pending.error) {
        toast.error(pending.error);
      }
      router.push(returnTo);
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
    if (value !== "" && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  if (!isOpen) return null;

  const nameErr = visibleError("name");
  const emailErr = visibleError("email");
  const phoneErr = visibleError("phone");
  const countryErr = visibleError("country");
  const stateErr = visibleError("state");
  const cityErr = visibleError("city");
  const pincodeErr = visibleError("pincode");
  const termsErr = visibleError("terms");

  return (
    <div className="font-lato fixed inset-0 z-9999 flex items-center justify-center overflow-hidden p-6">
      <div
        className="fixed inset-0 animate-in fade-in bg-neutral-800/55 backdrop-blur-[2px] duration-300"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-300 outline-none">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#84cc16] bg-white p-10 shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
          <GymIllustration />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <div className="relative mx-auto max-w-md">
            {!showOtp ? (
              <>
                <h2 className="text-center text-[1.65rem] font-bold leading-tight tracking-tight text-gray-900">
                  Start with the Right Expert
                </h2>
                <p className="mx-auto max-w-sm text-center text-[0.9375rem] leading-relaxed text-gray-500">
                  Create an account to discover trusted wellness experts who fit
                  your goals best.
                </p>

                <div className="mt-2 space-y-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between px-0.5">
                      <label className="text-sm font-bold text-gray-900">
                        Name
                      </label>
                      {nameErr && (
                        <span className="text-xs font-semibold text-red-500">
                          {nameErr}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => markBlurred("name")}
                      placeholder="Enter your name"
                      className={inputClass(!!nameErr)}
                      aria-invalid={!!nameErr}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between px-0.5">
                      <label className="text-sm font-bold text-gray-900">
                        Email ID
                      </label>
                      {emailErr && (
                        <span className="text-xs font-semibold text-red-500">
                          {emailErr}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => markBlurred("email")}
                      placeholder="example@gmail.com"
                      className={inputClass(!!emailErr)}
                      aria-invalid={!!emailErr}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between px-0.5">
                      <label className="text-sm font-bold text-gray-900">
                        Phone Number
                      </label>
                      {phoneErr && (
                        <span className="text-xs font-semibold text-red-500">
                          {phoneErr}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => markBlurred("phone")}
                      placeholder="+91 9876543210"
                      className={inputClass(!!phoneErr)}
                      aria-invalid={!!phoneErr}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between px-0.5">
                        <label className="text-sm font-bold text-gray-900">
                          Country
                        </label>
                        {countryErr && (
                          <span className="text-xs font-semibold text-red-500">
                            {countryErr}
                          </span>
                        )}
                      </div>
                      <select
                        value={location.countryCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          const c = code
                            ? Country.getCountryByCode(code)
                            : null;
                          setLocation({
                            countryCode: code,
                            country: c?.name || "",
                            stateCode: "",
                            state: "",
                            city: "",
                            pincode: "",
                          });
                        }}
                        onBlur={() => markBlurred("country")}
                        className={selectClass(!!countryErr)}
                        style={{ backgroundImage: SELECT_CHEVRON_BG }}
                        aria-invalid={!!countryErr}
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between px-0.5">
                        <label className="text-sm font-bold text-gray-900">
                          State / Region
                        </label>
                        {stateErr && (
                          <span className="text-xs font-semibold text-red-500">
                            {stateErr}
                          </span>
                        )}
                      </div>
                      {hasStateList ? (
                        <select
                          value={location.stateCode}
                          disabled={!location.countryCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            const s = states.find((x) => x.isoCode === code);
                            setLocation((prev) => ({
                              ...prev,
                              stateCode: code,
                              state: s?.name || "",
                              city: "",
                              pincode: "",
                            }));
                          }}
                          onBlur={() => markBlurred("state")}
                          className={`${selectClass(!!stateErr)} disabled:cursor-not-allowed disabled:opacity-50`}
                          style={{ backgroundImage: SELECT_CHEVRON_BG }}
                          aria-invalid={!!stateErr}
                        >
                          <option value="">
                            {location.countryCode
                              ? "Select state / region"
                              : "Select country first"}
                          </option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={location.state}
                          disabled={!location.countryCode}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLocation((prev) => ({
                              ...prev,
                              state: v,
                              stateCode: "",
                              city: "",
                              pincode: "",
                            }));
                          }}
                          onBlur={() => markBlurred("state")}
                          placeholder={
                            location.countryCode
                              ? "Region / province (if applicable)"
                              : "Select country first"
                          }
                          className={`${inputClass(!!stateErr)} disabled:cursor-not-allowed disabled:opacity-50`}
                          aria-invalid={!!stateErr}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between px-0.5">
                        <label className="text-sm font-bold text-gray-900">
                          City
                        </label>
                        {cityErr && (
                          <span className="text-xs font-semibold text-red-500">
                            {cityErr}
                          </span>
                        )}
                      </div>
                      {useCitySelect ? (
                        <select
                          value={location.city}
                          disabled={!location.stateCode}
                          onChange={(e) => {
                            const value = e.target.value;
                            setLocation((prev) => ({
                              ...prev,
                              city: value,
                              pincode: value.trim() ? "" : "",
                            }));
                            if (value.trim()) {
                              queueMicrotask(() => {
                                const snap = {
                                  ...locationRef.current,
                                  city: value,
                                };
                                suggestPostcodeForLocation(snap);
                              });
                            }
                          }}
                          onBlur={() => markBlurred("city")}
                          className={`${selectClass(!!cityErr)} disabled:cursor-not-allowed disabled:opacity-50`}
                          style={{ backgroundImage: SELECT_CHEVRON_BG }}
                          aria-invalid={!!cityErr}
                        >
                          <option value="">
                            {location.stateCode
                              ? "Select city"
                              : hasStateList
                                ? "Select state first"
                                : "Enter state first"}
                          </option>
                          {cities.map((c) => (
                            <option
                              key={`${location.countryCode}-${location.stateCode}-${c.name}`}
                              value={c.name}
                            >
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      {!useCitySelect &&
                      location.countryCode &&
                      cities.length > MAX_CITIES_IN_SELECT ? (
                        <p className="mb-2 text-xs text-gray-500">
                          This region has many localities (
                          {cities.length.toLocaleString()}). Type your city
                          name.
                        </p>
                      ) : null}
                      {showCityTextInput ? (
                        <input
                          type="text"
                          value={location.city}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLocation((prev) => ({
                              ...prev,
                              city: v,
                              pincode: v.trim() ? prev.pincode : "",
                            }));
                          }}
                          onBlur={() => {
                            markBlurred("city");
                            const snap = locationRef.current;
                            if (
                              snap.city?.trim() &&
                              snap.state?.trim() &&
                              snap.country?.trim()
                            ) {
                              suggestPostcodeForLocation(snap);
                            }
                          }}
                          placeholder="City"
                          disabled={
                            !location.countryCode ||
                            (hasStateList && !location.stateCode)
                          }
                          className={`${inputClass(!!cityErr)} disabled:cursor-not-allowed disabled:opacity-50`}
                          aria-invalid={!!cityErr}
                        />
                      ) : null}
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between px-0.5">
                        <label className="text-sm font-bold text-gray-900">
                          Pincode
                        </label>
                        {pincodeErr && (
                          <span className="text-xs font-semibold text-red-500">
                            {pincodeErr}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={location.pincode}
                        onChange={(e) => {
                          const v = e.target.value;
                          setLocation((prev) => ({ ...prev, pincode: v }));
                        }}
                        onBlur={() => markBlurred("pincode")}
                        placeholder="Pincode"
                        className={inputClass(!!pincodeErr)}
                        aria-invalid={!!pincodeErr}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#84cc16]"
                      />
                      <span>
                        By continuing, I agree to the{" "}
                        <a
                          href="#"
                          className="font-bold text-[#84cc16] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Terms &amp; Conditions
                        </a>
                      </span>
                    </label>
                    {termsErr && (
                      <p className="text-xs font-semibold text-red-500">
                        {termsErr}
                      </p>
                    )}
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#84cc16]"
                      />
                      <span>
                        Subscribe to our newsletter for regular health news and
                        updates.
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#84cc16] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#76b813] active:scale-[0.99]"
                    >
                      Continue →
                    </button>
                    <p className="text-sm text-gray-500">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="font-bold text-[#84cc16] hover:underline"
                      >
                        Login instead
                      </button>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-center text-[1.65rem] font-semibold leading-tight tracking-tight text-gray-900">
                  Start with the Right Expert
                </h2>
                <p className="text-center text-[0.9375rem] text-gray-500">
                  Enter the code we sent to your phone to finish signing up.
                </p>

                <div>
                  <label className="mb-3 block text-sm font-bold text-gray-900">
                    One Time Password (OTP)
                  </label>
                  <div className="flex flex-row flex-wrap items-center gap-3">
                    <div className="flex flex-1 justify-start gap-2">
                      {otp.map((val, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          className="h-12 w-11 rounded-lg border-2 border-gray-200 bg-white text-center text-lg font-bold text-gray-900 focus:border-[#84cc16] focus:outline-none focus:ring-2 focus:ring-lime-500/25"
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

                <div className="flex w-full justify-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="inline-flex h-auto w-[200px] max-w-full flex-none items-center justify-center gap-2 rounded-2xl bg-[#84cc16] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#76b813] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#84cc16]"
                  >
                    {verifyingOtp ? "Verifying…" : "Continue →"}
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
