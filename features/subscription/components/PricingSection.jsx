"use client";

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
import PlanDurationSelection from "./PlanDurationSelection";
import WhoCanJoinSection from "./WhoCanJoinSection";
import { Suspense } from "react";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

export default function PricingSection({ skipPlan, currentPlanCode }) {
  return (
    <Suspense>
      <PricingSectionContext skipPlan={skipPlan} currentPlanCode={currentPlanCode}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Container />
        </div>
      </PricingSectionContext>
    </Suspense>
  );
}

function Container() {
  const { plans } = usePricingPageContext();
  const { displayName } = useBrandingContext();

  return (
    <div>
      <div id="pricing-plans" className="scroll-mt-6 py-16 md:scroll-mt-10">
        <header className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            {`Your Growth Path on ${displayName}`}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            From getting discovered to building your own branded coaching
            business. Move up at your own pace.
          </p>
        </header>

        {/* <PlanDurationSelection /> */}

        <div
          className={cn(
            "mb-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-4",
            plans.length === 2 && "lg:grid-cols-3",
          )}
        >
          <PlanFreeTier />
          {plans.map((plan) => {
            const Component = getPlanCardComponent(plan.code);
            if (Component)
              return (
                <Component key={plan.code} plan={plan} />
              );
          })}
        </div>
      </div>

      <WhoCanJoinSection />
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
