"use client";

import { postData } from "@/lib/api";
import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { freeTier } from "../utils/config";
import { usePricingPageContext } from "../state/PricingSectionContext";
import PricingFillDetailsModal from "./PricingFillDetailsModal";

export default function PlanFreeTier() {
  const { currency } = usePricingPageContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const openDetailsModal = function () {
    const scroller = document.scrollingElement;
    const scrollTop = scroller?.scrollTop ?? window.scrollY ?? 0;
    setDetailsOpen(true);
    requestAnimationFrame(() => {
      if (scroller) scroller.scrollTop = scrollTop;
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(() => {
        if (scroller) scroller.scrollTop = scrollTop;
        window.scrollTo(0, scrollTop);
      });
    });
  };

  const submitFreeTier = async function (form) {
    try {
      const payload = {
        name: form.name,
        email: form.email,
        city: form.city,
        profession: form.profession,
        countryCode: form.countryCode || "IN",
        mobileNumber: form.nationalMobileNumber,
      };

      const freeTierResponse = await postData(
        "app/subscriptions/initialize-free-tier",
        payload,
      );
      if (
        freeTierResponse.status_code !== 200 &&
        !String(freeTierResponse.message || "")
          .toLowerCase()
          .includes("ineligible")
      ) {
        throw new Error(freeTierResponse.message);
      }

      const otpResponse = await postData(
        "app/signin?authMode=mob&clientType=web",
        {
          credential: payload.mobileNumber,
          countryCode: payload.countryCode,
          fcmToken: "",
        },
      );
      if (otpResponse.status_code !== 200) throw new Error(otpResponse.message);
      toast.success("OTP sent successfully!");
      return otpResponse;
    } catch (error) {
      toast.error(error.message ?? "Please try again later.");
      throw error;
    }
  };

  return (
    <article className="mx-auto flex h-full w-full max-w-[380px] select-none flex-col overflow-hidden rounded-[40px] border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl">
      <div className="bg-[#F8FAFC] px-6 py-8 text-center md:px-8">
        <h2 className="mb-1.5 text-xl font-black tracking-tight text-[#0F1F26] md:text-2xl">
          Free Expert List
        </h2>
        <p className="mb-2 text-sm font-medium text-[#5F6571]">
          Start your journey on Zeefit and get discovered by fitness-focused users.
        </p>

        <div className="mb-3 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-black tabular-nums text-[#0F1F26] md:text-4xl">
            ₹0
          </span>
          <span className="text-sm font-medium text-[#5F6571]">/month</span>
        </div>

        <button
          type="button"
          className="w-full cursor-pointer rounded-full bg-[#67BC2A] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-green-100 transition-all hover:bg-[#58a124] active:scale-[0.98] md:text-base"
          onClick={openDetailsModal}
        >
          Get Listed for Free
        </button>

        <PricingFillDetailsModal
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          currency={currency}
          onSubmit={submitFreeTier}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="mb-4 text-lg font-bold text-[#1F384C]">This plan includes:</p>

        <ul className="flex-1 space-y-3">
          {(Array.isArray(freeTier?.features) ? freeTier.features : []).map(
            (feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#67BC2A]"
                  strokeWidth={3}
                />
                <span className="text-sm font-medium leading-snug text-[#707D8B]">
                  {feature}
                </span>
              </li>
            ),
          )}
        </ul>

        <div className="mt-8 border-t border-gray-50 pt-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#67BC2A]">Start Free on Zeefit</p>
        </div>
      </div>
    </article>
  );
}
