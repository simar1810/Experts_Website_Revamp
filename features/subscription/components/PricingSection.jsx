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
      <div id="pricing-plans">
        <PlanDurationSelection />
      <div
        className={cn(
          "grid grid-cols-1 gap-2 mb-8",
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
