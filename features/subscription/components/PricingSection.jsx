import { cn } from "@/lib/utils";
import {
  PricingSectionContext,
  usePricingPageContext,
} from "../state/PricingSectionContext";
import PlanBasic from "./PlanBasic";
import PlanEnterprise from "./PlanEnterprise";
import PlanPro from "./PlanPro";
import PlanSales from "./PlanSales";
import PlanFreeTier from "./PlanFreeTier";
import { enterprisePlan } from "../utils/config";
import PlanDurationSelection from "./PlanDurationSelection";
import { Suspense } from "react";
import CouponCode from "./CouponCode";

export default function PricingSection({ skipPlan, currentPlanCode }) {
  return (
    <Suspense>
      <PricingSectionContext skipPlan={skipPlan} currentPlanCode={currentPlanCode}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <Container />
        </div>
      </PricingSectionContext>
    </Suspense>
  );
}

function Container() {
  const { plans, noOfMonths } = usePricingPageContext();
  return (
    <div>
      {/* <CouponCode /> */}
      <div id="pricing-plans" className="scroll-mt-6 md:scroll-mt-10">
        <div className="px-2 pb-6 text-center md:px-0 md:pb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F1F26] md:text-4xl">
            Pricing
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-gray-600 md:text-lg">
            Choose the plan that fits your coaching.{" "}
            <a
              className="font-semibold text-[#2E7D32] underline decoration-[#2E7D32]/30 underline-offset-2 hover:decoration-[#2E7D32]"
              href="mailto:support@wellnessz.in?subject=ZeeFit%20Basic%20—%20question"
            >
            </a>
          </p>
        </div>
        <PlanDurationSelection />
      <div
        className={cn(
          "mb-8 grid grid-cols-1 items-stretch gap-6 md:gap-6",
          plans.length === 2 ? "md:grid-cols-3" : "md:grid-cols-4",
        )}
      >
        <PlanFreeTier />
        {/* <div className="border-1">plans section</div> */}
        {plans.map((plan) => {
          const Component = getPlanCardComponent(plan.code);
          if (Component)
            return (
              <Component key={plan.code} plan={plan} months={noOfMonths} />
            );
        })}
      </div>
      </div>
      <div className="mb-8">
        <div className="w-full">
          <PlanEnterprise plan={enterprisePlan} months={noOfMonths} />
        </div>
      </div>
    </div>
  );
}

function getPlanCardComponent(planCode) {
  switch (planCode) {
    case "basic":
      return PlanBasic;
    case "pro":
      return PlanPro;
    case "sales":
      return PlanSales;
    case "iosBranded":
      return PlanSales;
    case "enterprise":
      return PlanEnterprise;
    default:
      break;
  }
}
