"use client";

import { useState } from "react";
import { MapPin, Clock3 } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEnquiryForm(state) {
  const errors = { name: "", email: "", contact: "", message: "" };

  const name = state.name?.trim() || "";
  if (!name) errors.name = "Full name is required";
  else if (name.length < 2) errors.name = "Please enter at least 2 characters";

  const email = state.email?.trim() || "";
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";

  const contact = state.contact?.trim() || "";
  const digits = contact.replace(/\D/g, "");
  if (!contact) errors.contact = "Phone is required";
  else if (digits.length < 8 || digits.length > 15)
    errors.contact = "Enter a valid phone number (8–15 digits)";

  const message = state.message?.trim() || "";
  if (!message) errors.message = "Please describe your enquiry";
  else if (message.length < 10)
    errors.message = "Please add a bit more detail (at least 10 characters)";

  return errors;
}

const inputClass = (hasError) =>
  [
    "h-11 w-full rounded-lg border px-3 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-[#065a23]/25",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "border-[#e7ece8] focus:border-[#0d3b1f]",
  ].join(" ");

const textareaClass = (hasError) =>
  [
    "h-24 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-[#065a23]/25",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "border-[#e7ece8] focus:border-[#0d3b1f]",
  ].join(" ");

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

export default function StoriesContact({
  details,
  reviews = [],
  formState,
  onFormChange,
  onSubmit,
}) {
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const mapQuery = encodeURIComponent(formState.location || "Mumbai, India");
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const handleFieldChange = (event) => {
    const { name } = event.target;
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    onFormChange(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = validateEnquiryForm(formState);
    setFieldErrors(next);
    if (Object.values(next).some(Boolean)) return;
    await Promise.resolve(onSubmit(event));
  };

  return (
    <section className="w-full sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-y-20">
        {reviews.length > 0 && (
          <div className="flex flex-col gap-y-5 py-7 sm:py-9 lg:py-10">
            <h2 className="text-center text-3xl font-extrabold text-[#0d3b1f]">
              Patient Stories
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review, index) => (
                <article
                  key={`${review.clientName}-${index}`}
                  className="rounded-2xl border border-[#e8ece9] bg-white p-4"
                >
                  <p className="text-xs leading-5 text-[#5c6d64]">
                    "{review.text}"
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#0d3b1f]">
                    {review.clientName || "Patient"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <form
            id="quick-enquiry"
            onSubmit={handleSubmit}
            className="space-y-3 rounded-2xl border border-[#e8ece9] bg-white p-5 scroll-mt-24"
            noValidate
          >
            <h3 className="text-2xl font-extrabold text-[#0d3b1f]">
              Quick Enquiry
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleFieldChange}
                  placeholder="Full name"
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={
                    fieldErrors.name ? "quick-enquiry-name-error" : undefined
                  }
                  className={inputClass(!!fieldErrors.name)}
                />
                <FieldError
                  message={fieldErrors.name}
                  id="quick-enquiry-name-error"
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleFieldChange}
                  placeholder="email@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? "quick-enquiry-email-error" : undefined
                  }
                  className={inputClass(!!fieldErrors.email)}
                />
                <FieldError
                  message={fieldErrors.email}
                  id="quick-enquiry-email-error"
                />
              </div>
            </div>
            <div>
              <input
                name="contact"
                type="tel"
                value={formState.contact}
                onChange={handleFieldChange}
                placeholder="Phone"
                autoComplete="tel"
                aria-invalid={Boolean(fieldErrors.contact)}
                aria-describedby={
                  fieldErrors.contact ? "quick-enquiry-contact-error" : undefined
                }
                className={inputClass(!!fieldErrors.contact)}
              />
              <FieldError
                message={fieldErrors.contact}
                id="quick-enquiry-contact-error"
              />
            </div>
            <div>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleFieldChange}
                placeholder="Briefly describe your condition"
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={
                  fieldErrors.message ? "quick-enquiry-message-error" : undefined
                }
                className={textareaClass(!!fieldErrors.message)}
              />
              <FieldError
                message={fieldErrors.message}
                id="quick-enquiry-message-error"
              />
            </div>
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-[#065a23] text-sm font-semibold text-white transition-colors hover:bg-[#04481c]"
            >
              Submit Secure Enquiry
            </button>
          </form>

          <aside className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#004F11] p-7 text-white sm:p-8">
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#8fd97a]/30 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-5">
              <span className="inline-flex w-fit rounded-full bg-[#c3eebb] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#002204]">
                Now available
              </span>
              <h3 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2rem]">
                Download WellnessZ App
                <br />
                Today!
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Manage your recovery, schedule appointments, and access
                exclusive patient resources directly from your device.
              </p>
              <div className="flex flex-wrap items-center gap-10 pt-1">
                <a
                  href="#"
                  className="block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/images/app-store.png"
                    alt="Download on the App Store"
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="#"
                  className="block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/images/google-play.png"
                    alt="Get it on Google Play"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </aside>
        </div>

        <article className="mb-6 grid grid-cols-1 items-center gap-5 rounded-[1.8rem] bg-[#f2f4f3] p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-4xl font-extrabold text-[#0d3b1f]">
              Visit the Sanctuary
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#1d3327]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {formState.location}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />{" "}
                {details?.availabilityHours || "Hours shared on enquiry"}
              </p>
            </div>
            <button
              type="button"
              className="mt-5 rounded-lg bg-[#065a23] px-4 py-2 text-xs font-semibold text-white"
            >
              Get Directions
            </button>
          </div>
          <div className="min-h-[180px] overflow-hidden rounded-2xl border border-[#d7e8dc] bg-[#b8d9c0]">
            <iframe
              title="Location map"
              src={mapEmbedUrl}
              className="min-h-[180px] h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="bg-white/90 px-3 py-2 text-[11px] text-[#1d3327]">
              <a
                href={mapOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                Open full map
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
