"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, MoveLeft, UploadCloud } from "lucide-react";
import InputMobileNumberWithCountryCode, {
  countryCodes,
} from "@/features/mobile-number";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import CityRegionAutocomplete from "./CityRegionAutocomplete";
import {
  validatePricingApplyField,
  validatePricingApplyForm,
} from "./validatePricingApplyForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const WELLNESSZ_APP_ORIGIN = (
  process.env.NEXT_PUBLIC_WELLNESSZ_APP_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://app.wellnessz.in")
).replace(/\/$/, "");

const FORM_STEP = "form";
const OTP_STEP = "otp";
const SUCCESS_STEP = "success";

const PROFESSIONS = [
  "Fitness Trainer",
  "Yoga Instructor",
  "Dietitian / Nutritionist",
  "Strength Coach",
  "Pilates Coach",
  "Physiotherapist",
  "Sports Nutritionist",
  "Wellness Coach",
];

const EXPERIENCE_OPTIONS = [
  { label: "0-2 years", value: "1" },
  { label: "2-5 years", value: "3" },
  { label: "5+ years", value: "5" },
];

const initialTouched = {
  firstName: false,
  lastName: false,
  email: false,
  mobileNumber: false,
  profession: false,
  city: false,
  certificationName: false,
  certificationInstitute: false,
  yearsExperience: false,
  certificateFile: false,
  whyJoin: false,
};

const ALL_FORM_FIELDS = Object.keys(initialTouched);

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  countryCode: "IN",
  profession: "",
  city: "",
  certificationName: "",
  certificationInstitute: "",
  yearsExperience: "",
  certificateFile: null,
  whyJoin: "",
};

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function fullName(form) {
  return [form.firstName, form.lastName]
    .map((v) => String(v || "").trim())
    .filter(Boolean)
    .join(" ");
}

function apiUrl(endpoint) {
  return `${API_BASE}/${String(endpoint).replace(/^\/+/, "")}`;
}

async function postJson(endpoint, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(apiUrl(endpoint), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }
  return data;
}

async function uploadFileToPresignedUrl(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Certificate upload failed. Please try again.");
  }
}

function FormError({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-semibold text-red-500">{children}</p>;
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="text-sm font-semibold text-gray-800">
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

function TextInput({ error, className, ...props }) {
  return (
    <input
      className={cn(
        "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#67BC2A] focus:ring-4 focus:ring-[#67BC2A]/15",
        error ? "border-red-400" : "border-gray-200",
        className,
      )}
      {...props}
    />
  );
}

function SelectInput({ error, children, ...props }) {
  return (
    <select
      className={cn(
        "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#67BC2A] focus:ring-4 focus:ring-[#67BC2A]/15",
        error ? "border-red-400" : "border-gray-200",
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function CollapsibleSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-gray-50/70">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span>
          <span className="block text-sm font-black uppercase tracking-[0.14em] text-[#2E7D32]">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-xs text-gray-500">{subtitle}</span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-gray-500 transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>
      {open ? <div className="space-y-4 px-5 pb-5">{children}</div> : null}
    </section>
  );
}

/**
 * Zeefit pricing application flow using one modal: profile form, OTP verification,
 * then conversion success state.
 */
export default function PricingFillDetailsModal({
  open,
  onOpenChange,
  currency,
  onSubmit,
  title = "Apply to Zeefit",
  submitLabel = "Apply & Get Listed →",
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(initialTouched);
  const [stage, setStage] = useState(FORM_STEP);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(23);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpUser, setOtpUser] = useState(null);
  const [coachToken, setCoachToken] = useState("");
  const verifyingRef = useRef(false);
  const formRef = useRef(null);

  const isIndianPricing = currency === "INR";
  const defaultCountry = currency === "USD" ? "US" : "IN";

  const phonePayload = useMemo(
    () => ({
      mobileNumber: digitsOnly(form.mobileNumber),
      countryCode: form.countryCode || defaultCountry,
    }),
    [form.mobileNumber, form.countryCode, defaultCountry],
  );

  const phoneDialCode = useMemo(() => {
    const country = countryCodes.find(
      (item) => item.code === phonePayload.countryCode,
    );
    return String(country?.dial_code || "+91").replace(/\s/g, "");
  }, [phonePayload.countryCode]);

  const validationOptions = useMemo(
    () => ({
      professions: PROFESSIONS,
      experienceValues: EXPERIENCE_OPTIONS.map((option) => option.value),
    }),
    [],
  );

  useEffect(() => {
    let interval;
    if (open && stage === OTP_STEP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, stage, timer]);

  useEffect(() => {
    if (!open) {
      setForm({ ...initialForm, countryCode: defaultCountry });
      setErrors({});
      setTouched(initialTouched);
      setStage(FORM_STEP);
      setCredentialsOpen(false);
      setOptionalOpen(false);
      setLoading(false);
      setOtp("");
      setTimer(23);
      setVerifyingOtp(false);
      setOtpUser(null);
      setCoachToken("");
      verifyingRef.current = false;
    }
  }, [open, defaultCountry]);

  const scrollToField = function (field) {
    if (!field || !formRef.current) return;
    const target = formRef.current.querySelector(`[data-field="${field}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const validate = function () {
    const result = validatePricingApplyForm(form, validationOptions);
    setErrors(result.errors);
    setTouched(
      ALL_FORM_FIELDS.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    );
    if (result.openCredentials) setCredentialsOpen(true);
    if (result.openOptional) setOptionalOpen(true);
    if (!result.ok) {
      requestAnimationFrame(() => scrollToField(result.firstErrorField));
    }
    return result.ok;
  };

  const handleBlur = function (field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const message = validatePricingApplyField(field, form, validationOptions);
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleInputChange = function (field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (touched[field] || errors[field]) {
        const message = validatePricingApplyField(
          field,
          next,
          validationOptions,
        );
        setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
      } else if (errors[field]) {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
      }
      return next;
    });
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await onSubmit({
        ...form,
        name: fullName(form),
        countryCode: phonePayload.countryCode,
        nationalMobileNumber: phonePayload.mobileNumber,
      });

      const token =
        response?.token ||
        response?.refreshToken ||
        response?.data?.user?.refreshToken ||
        response?.data?.user?.webRefreshTokenList?.[
          response?.data?.user?.webRefreshTokenList.length - 1
        ] ||
        "";

      setCoachToken(token);
      setOtpUser(response?.data?.user || response?.user || null);
      setOtp("");
      setTimer(23);
      setStage(OTP_STEP);
    } catch {
      /* errors are handled inside onSubmit */
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async function () {
    try {
      const data = await postJson(
        "app/signin?authMode=mob&clientType=web",
        {
          credential: phonePayload.mobileNumber,
          countryCode: phonePayload.countryCode,
          fcmToken: "",
        },
      );
      const user = data?.data?.user || null;
      const token =
        user?.refreshToken ||
        user?.webRefreshTokenList?.[user.webRefreshTokenList.length - 1] ||
        "";
      setOtpUser(user);
      setCoachToken(token);
      setTimer(23);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp: error?.message || "Could not resend OTP",
      }));
    }
  };

  const completeExpertListing = async function (token) {
    const certUploads = [];
    if (form.certificateFile) {
      const presign = await postJson(
        "experts/uploads/presign",
        {
          files: [
            {
              name: form.certificateFile.name,
              type: form.certificateFile.type,
              size: form.certificateFile.size,
              category: "certificate",
            },
          ],
        },
        token,
      );
      const upload = presign?.uploads?.[0];
      if (!upload?.uploadUrl) {
        throw new Error("Could not prepare certificate upload");
      }
      await uploadFileToPresignedUrl(upload.uploadUrl, form.certificateFile);
      certUploads.push(upload);
    }

    const certNames = form.certificationName
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    await postJson(
      "experts/listing/upsert",
      {
        profession: form.profession,
        city: form.city.trim(),
        country: phonePayload.countryCode === "IN" ? "India" : "",
        yearsExperience: form.yearsExperience
          ? Number(form.yearsExperience)
          : undefined,
        certifications: {
          institute: form.certificationInstitute.trim(),
          items: certNames.map((name) => ({ name, isVerified: false })),
          names: certNames,
          pdfUrls: certUploads.map((u) => u.fileUrl),
          fileKeys: certUploads.map((u) => u.key),
        },
      },
      token,
    );
  };

  const verifyOtp = async function () {
    if (verifyingRef.current || otp.length !== 4) return;
    verifyingRef.current = true;
    setVerifyingOtp(true);
    setErrors((prev) => ({ ...prev, otp: null }));

    try {
      const response = await postJson("app/verifyOtp", {
        mobileNumber: phonePayload.mobileNumber,
        otp,
      });

      if (response?.status_code !== 200 && !response?.success) {
        throw new Error(response?.error || response?.message || "Wrong OTP");
      }

      const token =
        coachToken ||
        otpUser?.refreshToken ||
        otpUser?.webRefreshTokenList?.[otpUser.webRefreshTokenList.length - 1];
      if (!token) throw new Error("Could not start dashboard setup");

      await completeExpertListing(token);
      setStage(SUCCESS_STEP);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp: error?.message || "Verification failed. Please try again.",
      }));
    } finally {
      setVerifyingOtp(false);
      verifyingRef.current = false;
    }
  };

  useEffect(() => {
    if (stage === OTP_STEP && otp.length === 4 && !verifyingRef.current) {
      void verifyOtp();
    }
    // `verifyOtp` intentionally reads the latest form/token state when OTP completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, stage]);

  const redirectToWellnessz = function () {
    const token =
      coachToken ||
      otpUser?.refreshToken ||
      otpUser?.webRefreshTokenList?.[otpUser.webRefreshTokenList.length - 1];
    const coachId = otpUser?._id;

    if (token && coachId) {
      const params = new URLSearchParams({
        source: "zeefit",
        token,
        _id: coachId,
        phone: phonePayload.mobileNumber,
        countryCode: phonePayload.countryCode,
        name: fullName(form),
        email: form.email.trim(),
        profession: form.profession,
      });
      window.location.href = `${WELLNESSZ_APP_ORIGIN}/auth/zeefit?${params.toString()}`;
      return;
    }

    const params = new URLSearchParams({
      source: "zeefit",
      phone: phonePayload.mobileNumber,
      countryCode: phonePayload.countryCode,
      name: fullName(form),
      email: form.email.trim(),
      profession: form.profession,
    });
    window.location.href = `${WELLNESSZ_APP_ORIGIN}/login?${params.toString()}`;
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
          className="font-lato zeefit-pricing-form-modal z-50 flex max-h-[min(92vh,860px)] w-[calc(100%-2rem)] max-w-[680px] flex-col gap-0 overflow-hidden rounded-[28px] border-none bg-white p-0 text-neutral-900 shadow-2xl sm:max-w-[680px]"
          showCloseButton
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Apply to Zeefit, verify your phone, and finish expert listing setup.
          </DialogDescription>

          {stage === FORM_STEP ? (
            <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="border-b border-gray-100 bg-linear-to-br from-[#F5FBF0] to-white p-6 pr-12 md:p-8 md:pr-14">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67BC2A]">
                  Certified coaches only
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0F1F26] md:text-4xl">
                  {title}
                </h2>
              </div>

              <div className="space-y-5 p-6 md:p-8">
                <section className="space-y-4 rounded-3xl border border-[#67BC2A]/20 bg-white p-5 shadow-sm">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#2E7D32]">
                      Section 1: Quick Profile
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      The essentials to get your profile created.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div data-field="firstName">
                      <FieldLabel required>First Name</FieldLabel>
                      <TextInput
                        type="text"
                        placeholder="Ankush"
                        value={form.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        onBlur={() => handleBlur("firstName")}
                        maxLength={50}
                        error={errors.firstName}
                      />
                      <FormError>{errors.firstName}</FormError>
                    </div>
                    <div data-field="lastName">
                      <FieldLabel required>Last Name</FieldLabel>
                      <TextInput
                        type="text"
                        placeholder="Singh"
                        value={form.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        onBlur={() => handleBlur("lastName")}
                        maxLength={50}
                        error={errors.lastName}
                      />
                      <FormError>{errors.lastName}</FormError>
                    </div>
                    <div data-field="email">
                      <FieldLabel required>Email</FieldLabel>
                      <TextInput
                        type="email"
                        placeholder="coach@example.com"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleBlur("email")}
                        maxLength={254}
                        error={errors.email}
                      />
                      <FormError>{errors.email}</FormError>
                    </div>
                    <div data-field="mobileNumber">
                      <FieldLabel required>Phone</FieldLabel>
                      <InputMobileNumberWithCountryCode
                        className="mt-2"
                        phone={form.mobileNumber}
                        onChange={(value) =>
                          handleInputChange("mobileNumber", value)
                        }
                        onCountryCodeChange={(code) => {
                          setForm((prev) => ({ ...prev, countryCode: code }));
                        }}
                        defaultCountryCode={form.countryCode || defaultCountry}
                        allowedCountryCodes={
                          isIndianPricing ? ["IN"] : undefined
                        }
                        fieldError={errors.mobileNumber}
                        onBlur={() => handleBlur("mobileNumber")}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        We&apos;ll use this to verify your account.
                      </p>
                    </div>
                    <div data-field="profession">
                      <FieldLabel required>Profession</FieldLabel>
                      <SelectInput
                        value={form.profession}
                        onChange={(e) =>
                          handleInputChange("profession", e.target.value)
                        }
                        onBlur={() => handleBlur("profession")}
                        error={errors.profession}
                      >
                        <option value="">Select profession</option>
                        {PROFESSIONS.map((profession) => (
                          <option key={profession} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </SelectInput>
                      <FormError>{errors.profession}</FormError>
                    </div>
                    <div data-field="city">
                      <FieldLabel required>City / Location</FieldLabel>
                      <CityRegionAutocomplete
                        value={form.city}
                        onChange={(value) => handleInputChange("city", value)}
                        onBlur={() => handleBlur("city")}
                        maxLength={80}
                        placeholder="Mumbai"
                        error={Boolean(errors.city)}
                      />
                      <FormError>{errors.city}</FormError>
                    </div>
                  </div>
                </section>

                <CollapsibleSection
                  title="Section 2: Credentials"
                  subtitle="Helps us confirm you're legit (reviewed in 24 hrs)."
                  open={credentialsOpen}
                  onToggle={() => setCredentialsOpen((prev) => !prev)}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div data-field="certificationName">
                      <FieldLabel>Certification Name</FieldLabel>
                      <TextInput
                        type="text"
                        placeholder="K11, ACE, IFBB"
                        value={form.certificationName}
                        onChange={(e) =>
                          handleInputChange("certificationName", e.target.value)
                        }
                        onBlur={() => handleBlur("certificationName")}
                        maxLength={120}
                        error={errors.certificationName}
                      />
                      <FormError>{errors.certificationName}</FormError>
                    </div>
                    <div data-field="certificationInstitute">
                      <FieldLabel required>Certification Institute</FieldLabel>
                      <TextInput
                        type="text"
                        placeholder="ACE Fitness"
                        value={form.certificationInstitute}
                        onChange={(e) =>
                          handleInputChange(
                            "certificationInstitute",
                            e.target.value,
                          )
                        }
                        onBlur={() => handleBlur("certificationInstitute")}
                        maxLength={120}
                        error={errors.certificationInstitute}
                      />
                      <FormError>{errors.certificationInstitute}</FormError>
                      <p className="mt-1 text-xs text-gray-500">
                        We&apos;ll use this to verify your certification.
                      </p>
                    </div>
                    <div data-field="yearsExperience">
                      <FieldLabel required>Years of Experience</FieldLabel>
                      <SelectInput
                        value={form.yearsExperience}
                        onChange={(e) =>
                          handleInputChange("yearsExperience", e.target.value)
                        }
                        onBlur={() => handleBlur("yearsExperience")}
                        error={errors.yearsExperience}
                      >
                        <option value="">Select experience</option>
                        {EXPERIENCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectInput>
                      <FormError>{errors.yearsExperience}</FormError>
                    </div>
                    <div data-field="certificateFile">
                      <FieldLabel required>Certificate Upload</FieldLabel>
                      <label
                        className={cn(
                          "mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#67BC2A] hover:bg-[#F5FBF0]",
                          errors.certificateFile
                            ? "border-red-400"
                            : "border-gray-300",
                        )}
                      >
                        <UploadCloud className="h-5 w-5 text-[#67BC2A]" />
                        <span className="truncate">
                          {form.certificateFile?.name || "Upload PDF certificate"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            handleInputChange(
                              "certificateFile",
                              e.target.files?.[0] || null,
                            );
                            setTouched((prev) => ({
                              ...prev,
                              certificateFile: true,
                            }));
                          }}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF only. Required to confirm your credentials.
                      </p>
                      <FormError>{errors.certificateFile}</FormError>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Section 3: Optional"
                  subtitle="Share context we can use for better marketing copy."
                  open={optionalOpen}
                  onToggle={() => setOptionalOpen((prev) => !prev)}
                >
                  <div data-field="whyJoin">
                    <FieldLabel>Why do you want to join Zeefit?</FieldLabel>
                    <textarea
                      rows={3}
                      placeholder="Tell us what kind of clients you want to serve..."
                      value={form.whyJoin}
                      onChange={(e) =>
                        handleInputChange("whyJoin", e.target.value)
                      }
                      onBlur={() => handleBlur("whyJoin")}
                      maxLength={2000}
                      className={cn(
                        "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#67BC2A] focus:ring-4 focus:ring-[#67BC2A]/15",
                        errors.whyJoin ? "border-red-400" : "border-gray-200",
                      )}
                    />
                    <FormError>{errors.whyJoin}</FormError>
                  </div>
                </CollapsibleSection>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#67BC2A] to-[#3C9300] py-4 text-base font-black uppercase tracking-wide text-white shadow-lg shadow-green-200 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    submitLabel
                  )}
                </button>
                <p className="text-center text-xs font-medium text-gray-500">
                  Takes 60 seconds. Certified coaches only. We review & confirm
                  in 24 hrs.
                </p>
              </div>
            </form>
          ) : null}

          {stage === OTP_STEP ? (
            <div className="overflow-y-auto">
              <div className="border-b border-gray-100 bg-linear-to-br from-[#F5FBF0] to-white px-6 pb-6 pt-5 pr-12 md:px-8 md:pb-8 md:pt-6 md:pr-14">
                <button
                  type="button"
                  onClick={() => setStage(FORM_STEP)}
                  className="mb-5 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-gray-600 transition hover:bg-white/80 hover:text-gray-900"
                >
                  <MoveLeft size={16} />
                  Back to details
                </button>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67BC2A]">
                  Step 2 · Phone verification
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F1F26] md:text-3xl">
                  Enter security code
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                  We sent a 4-digit code to{" "}
                  <span className="mt-1 inline-flex items-center rounded-full bg-white px-3 py-1 font-semibold text-[#0F1F26] ring-1 ring-gray-200">
                    {phoneDialCode} {phonePayload.mobileNumber}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center px-6 py-8 md:px-10 md:py-10">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={verifyingOtp}
                  autoComplete="one-time-code"
                  containerClassName="justify-center gap-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && otp.length === 4) {
                      e.preventDefault();
                      void verifyOtp();
                    }
                  }}
                >
                  <InputOTPGroup className="gap-3">
                    {Array.from({ length: 4 }, (_, i) => i).map((index) => (
                      <InputOTPSlot
                        index={index}
                        key={index}
                        className="mr-0 h-14 w-12 rounded-xl border-2 border-gray-200 bg-white text-xl font-bold text-gray-900 shadow-sm transition-all first:rounded-xl last:rounded-xl data-[active=true]:border-[#67BC2A] data-[active=true]:ring-4 data-[active=true]:ring-[#67BC2A]/15"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <div className="mt-3 w-full max-w-md text-center">
                  <FormError>{errors.otp}</FormError>
                </div>

                <div className="mt-6 text-center text-sm">
                  {timer > 0 ? (
                    <p className="text-gray-500">
                      Resend code in{" "}
                      <span className="font-semibold tabular-nums text-gray-800">
                        {timer}s
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      Didn&apos;t receive the code?{" "}
                      <button
                        type="button"
                        className="font-bold text-[#67BC2A] transition hover:text-[#58a124] hover:underline"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </button>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void verifyOtp()}
                  disabled={verifyingOtp || otp.length !== 4}
                  className="mt-8 flex w-full max-w-md items-center justify-center rounded-2xl bg-linear-to-r from-[#67BC2A] to-[#3C9300] py-4 text-base font-black uppercase tracking-wide text-white shadow-lg shadow-green-200 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue →"
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Code expires shortly. Check SMS from your network provider.
                </p>
              </div>
            </div>
          ) : null}

          {stage === SUCCESS_STEP ? (
            <div className="p-8 text-center md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#67BC2A] text-white">
                <Check className="h-8 w-8" strokeWidth={3} />
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-[#0F1F26]">
                You&apos;re In! Welcome to Zeefit
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-600">
                Coach {form.firstName || "there"}, you&apos;re now listed on
                Zeefit. Your profile will be reviewed in 24 hours. Coaches like
                you earn 10L+/month.
              </p>
              <div className="mx-auto mt-6 max-w-md rounded-3xl bg-[#F5FBF0] p-5 text-left">
                <p className="mb-3 text-sm font-black text-[#0F1F26]">
                  Here&apos;s what happens next:
                </p>
                {[
                  "Your profile goes live on Zeefit",
                  "Clients search for you globally",
                  "Earn through bookings + partnerships",
                  "Scale with WellnessZ CRM",
                ].map((item) => (
                  <p
                    key={item}
                    className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <Check className="h-4 w-4 text-[#67BC2A]" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={redirectToWellnessz}
                  className="flex-1 rounded-2xl bg-[#67BC2A] px-5 py-3.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#58a124]"
                >
                  Checkout Dashboard →
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-black uppercase tracking-wide text-gray-700 transition hover:bg-gray-50"
                >
                  I&apos;ll Setup Later
                </button>
              </div>
            </div>
          ) : null}

          <style>{`
            .zeefit-pricing-form-modal {
              font-family: var(--font-lato), sans-serif;
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </>
  );
}
