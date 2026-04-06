"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { getEnquiryDefaultsFromClientUser } from "@/lib/clientUser";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
// Must match backend `RAZORPAY_KEY_ID` (expert-program orders use config/razorPay.js `razorpay`, not RAZORPAY_API_KEY).
const RAZORPAY_KEY =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

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

function ProgramCard({
  title,
  price,
  features,
  image,
  ctaMode,
  programId,
  programType,
  isAuthenticated,
  openLoginModal,
  user,
}) {
  const [busy, setBusy] = useState(false);
  const isPaid = programType !== "free";
  const primaryLabel = isPaid ? "Enroll Now" : "Join free";

  const handlePrimary = async () => {
    if (!programId) {
      toast.error("This program is not available to enroll.");
      return;
    }
    if (!isAuthenticated) {
      openLoginModal?.();
      return;
    }

    if (!isPaid) {
      setBusy(true);
      try {
        const res = await postWithAuth("/payments/expert-programs/free-join", {
          programId,
        });
        toast.success(res.message || "Joined successfully");
      } catch (e) {
        toast.error(e.message || "Could not join program");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!RAZORPAY_KEY) {
      toast.error(
        "Set NEXT_PUBLIC_RAZORPAY_KEY_ID to the same value as backend RAZORPAY_KEY_ID.",
      );
      return;
    }

    setBusy(true);
    try {
      const orderData = await postWithAuth("/payments/expert-programs/order", {
        programId,
      });

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Payment checkout failed to load");
        return;
      }

      const { paymentId, orderId } = orderData;

      const { name, email, contact } = getEnquiryDefaultsFromClientUser(user);
      const digits = contact.replace(/\D/g, "");
      const prefill = Object.fromEntries(
        [
          ["name", name],
          ["email", email],
          ["contact", digits.length >= 10 ? digits.slice(-10) : ""],
        ].filter(([, v]) => v != null && String(v).trim() !== ""),
      );

      const options = {
        key: RAZORPAY_KEY,
        // With order_id, amount/currency come from the order; passing them here often causes "Payment failed" if they drift.
        name: "WellnessZ",
        description: title || "Expert program",
        order_id: orderId,
        prefill,
        theme: { color: "#0a5b22" },
        handler: async function (rzResponse) {
          try {
            await postWithAuth("/payments/expert-programs/verify", {
              paymentId: String(paymentId),
              razorpayOrderId: rzResponse.razorpay_order_id,
              razorpayPaymentId: rzResponse.razorpay_payment_id,
              razorpaySignature: rzResponse.razorpay_signature,
            });
            toast.success("Payment successful");
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Payment verification failed");
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (response) => {
        console.error("Razorpay payment.failed", response);
        const err = response?.error || {};
        toast.error(
          [err.description, err.reason, err.code].filter(Boolean).join(" — ") ||
            "Payment failed. If this keeps happening, confirm NEXT_PUBLIC_RAZORPAY_KEY_ID matches backend RAZORPAY_KEY_ID.",
        );
      });
      rz.open();
    } catch (e) {
      toast.error(e.message || "Could not start payment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="rounded-2xl bg-[#0a5b22] border border-green-700/40 p-5 text-white grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="mt-4 space-y-2 text-sm text-green-100">
          {features.map((feature, idx) => (
            <li key={`${feature}-${idx}`} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-300" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-3xl font-extrabold">₹{price}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handlePrimary}
            className="h-9 rounded-lg px-4 bg-[#d7ffbe] text-[#0e3f1f] text-xs font-bold disabled:opacity-60"
          >
            {busy ? "Please wait…" : primaryLabel}
          </button>
          <button
            type="button"
            className="h-9 rounded-lg px-4 border border-green-300/50 text-xs font-semibold"
          >
            {ctaMode}
          </button>
        </div>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#10472b]">
        <img
          src={image || "/images/personlying.png"}
          alt="Program"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "/images/personlying.png";
          }}
        />
      </div>
    </article>
  );
}

export default function MembershipPrograms({
  details,
  programs = [],
  isAuthenticated,
  openLoginModal,
  user,
}) {
  const hasPrograms = Array.isArray(programs) && programs.length > 0;

  return (
    <section className="w-full bg-[#034b1b]  text-white  py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <p className="text-[10px] uppercase tracking-widest text-green-200">
          Membership Tiers
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold">Transformation Programs</h2>
          <p className="max-w-xl text-sm text-green-100">
            Curated recovery and performance plans with high-touch clinical
            supervision.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {hasPrograms ? (
            programs
              .slice(0, 2)
              .map((program, index) => (
                <ProgramCard
                  key={`${program.title}-${index}`}
                  programId={program._id}
                  programType={program.programType}
                  title={program.title || "Program"}
                  price={program.amount || 0}
                  features={
                    (program.tags?.length ? program.tags : null) ||
                    program.faqs?.map((f) => f.question).filter(Boolean) || [
                      program.shortDescription ||
                        program.about ||
                        "Program details available on enquiry",
                    ]
                  }
                  image={program.coverImage || program.image}
                  ctaMode={
                    details?.offersOnline
                      ? "Online"
                      : details?.offersInPerson
                        ? "In Person"
                        : "Consult"
                  }
                  isAuthenticated={isAuthenticated}
                  openLoginModal={openLoginModal}
                  user={user}
                />
              ))
          ) : (
            <article className="lg:col-span-2 rounded-2xl border border-green-700/40 bg-[#0a5b22] p-6 text-green-100">
              <p className="text-lg font-semibold text-white">
                No active programs published yet.
              </p>
              <p className="mt-2 text-sm">
                This expert is currently available for{" "}
                {details?.offersOnline && details?.offersInPerson
                  ? "online and in-person consultations"
                  : details?.offersOnline
                    ? "online consultations"
                    : details?.offersInPerson
                      ? "in-person consultations"
                      : "consultations"}
                .
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
