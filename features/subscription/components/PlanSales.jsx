"use client";

import { cn } from "@/lib/utils";
import CreateRazorpayOrderButton from "./CreateRazorpayOrderButton";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { selectPlanCode } from "../state/reducer";
import GrowthPathCardShell, {
  GrowthPathCtaButton,
} from "./GrowthPathCardShell";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

export default function PlanSales({ plan }) {
  const {
    selectedPlanCode,
    dispatch,
    coachId,
    currentPlanCode,
  } = usePricingPageContext();
  const { displayName } = useBrandingContext();

  const isCoachFlow = Boolean(coachId && currentPlanCode);

  const buttonLabel = isCoachFlow
    ? plan.id === currentPlanCode
      ? "Renew Now"
      : "Upgrade Now"
    : `Join ${displayName} →`;

  const replaceBrand = (text) =>
    typeof text === "string" ? text.replaceAll("Zeefit", displayName) : text;

  return (
    <GrowthPathCardShell
      className={cn(
        "cursor-pointer select-none",
        selectedPlanCode === plan.code && "ring-2 ring-[#43901a]",
      )}
      headerVariant="branded"
      title={plan.title}
      description={replaceBrand(plan.description)}
      features={plan.features.map(replaceBrand)}
      selected={selectedPlanCode === plan.code}
      role="button"
      tabIndex={0}
      onClick={() => dispatch(selectPlanCode(plan.code))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dispatch(selectPlanCode(plan.code));
        }
      }}
      cta={
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <CreateRazorpayOrderButton planId={plan.code}>
            <GrowthPathCtaButton variant="white">{buttonLabel}</GrowthPathCtaButton>
          </CreateRazorpayOrderButton>
        </div>
      }
    />
  );
}
