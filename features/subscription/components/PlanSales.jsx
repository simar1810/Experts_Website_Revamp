import { selectPlanCode } from "../state/reducer";
import { cn } from "@/lib/utils";
import CreateRazorpayOrderButton from "./CreateRazorpayOrderButton";
import { Check } from "lucide-react";
import { usePricingPageContext } from "../state/PricingSectionContext";

export default function PlanSales({ plan, months = 1 }) {
  const {
    selectedPlanCode,
    noOfMonths,
    currency,
    getCurrencySymbol,
    dispatch,
    coachId,
    currentPlanCode,
    discountPercentage,
  } = usePricingPageContext();

  const price = plan.discountedPrice(months, currency, discountPercentage);
  const isCoachFlow = Boolean(coachId && currentPlanCode);
  
  const buttonLabel = isCoachFlow
    ? (plan.id === currentPlanCode ? "Renew Now" : "Upgrade Now")
    : "Start your 14-day trial";

  const currencySymbol = getCurrencySymbol();

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-[380px] overflow-hidden rounded-[40px] bg-white transition-all duration-300 select-none cursor-pointer",
        selectedPlanCode === plan.code 
          ? "ring-2 ring-[#438439] shadow-2xl" 
          : "hover:shadow-xl border border-gray-100"
      )}
      onClick={() => dispatch(selectPlanCode(plan.code))}
    >
      <div className="bg-gradient-to-b from-[#4AA429] to-[#367a1e] p-4 py-10 relative">
        <h2 className="text-[24px] font-bold text-white mb-2 leading-tight">
          {plan.title}
        </h2>
        <p className="text-[16px] leading-tight text-white/90 mb-2 max-w-[280px]">
          {plan.description || "For established coaches building a long-term brand."}
        </p>
        
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-[48px] font-black text-white">
            {currencySymbol}{price}
          </span>
          <span className="text-[18px] font-medium text-white/80">
            /monthly
          </span>
        </div>

        <CreateRazorpayOrderButton planId={plan.code}>
          <button
            type="button"
            className="w-full rounded-full bg-white py-3 mt-2 text-[18px] font-bold text-[#367a1e] transition-transform active:scale-[0.98] shadow-md"
          >
            {buttonLabel}
          </button>
        </CreateRazorpayOrderButton>
      </div>

      <div className="p-8">
        <p className="text-[24px] font-bold text-[#1F384C] mb-6">
          This plan includes:
        </p>
        
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-4">
              <Check className="text-[#67BC2A] h-6 w-6 mt-0.5 shrink-0" strokeWidth={3} />
              <span className="text-[18px] font-medium text-[#707D8B] leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {plan.bestFor && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs font-black text-[#4AA429] uppercase tracking-[0.2em]">
              Best for: {plan.bestFor}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}