"use client";

import { postData } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { freeTier } from "../utils/config";
import { usePricingPageContext } from "../state/PricingSectionContext";
import PricingFillDetailsModal from "./PricingFillDetailsModal";
import GrowthPathCardShell, {
  GrowthPathCtaButton,
} from "./GrowthPathCardShell";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

export default function PlanFreeTier() {
  const { currency } = usePricingPageContext();
  const { displayName } = useBrandingContext();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const replaceBrand = (text) => text.replaceAll("Zeefit", displayName);

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
    <>
      <GrowthPathCardShell
        title={freeTier.title}
        description={replaceBrand(freeTier.description)}
        features={freeTier.features.map(replaceBrand)}
        cta={
          <GrowthPathCtaButton variant="green" onClick={openDetailsModal}>
            {`Join ${displayName} →`}
          </GrowthPathCtaButton>
        }
      />

      <PricingFillDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        currency={currency}
        onSubmit={submitFreeTier}
      />
    </>
  );
}
