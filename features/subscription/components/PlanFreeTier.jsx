"use client";

import { postData } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { parsePhoneNumber } from "react-phone-number-input";
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
      const parsed = form.mobileNumber
        ? parsePhoneNumber(form.mobileNumber)
        : undefined;
      const payload = {
        name: form.name,
        countryCode: parsed?.country ?? "IN",
        mobileNumber:
          parsed?.nationalNumber ??
          String(form.mobileNumber).replace(/\D/g, ""),
      };

      const response = await postData(
        "app/subscriptions/initialize-free-tier",
        payload,
      );
      if (response.status_code !== 200) throw new Error(response.message);
      toast.success(response.message);
      setDetailsOpen(false);
    } catch (error) {
      toast.error(error.message ?? "Please try again later.");
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
