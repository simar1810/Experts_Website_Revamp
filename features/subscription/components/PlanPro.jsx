import { cn } from "@/lib/utils";
import CreateRazorpayOrderButton from "./CreateRazorpayOrderButton";
import { Check } from "lucide-react";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { selectPlanCode } from "../state/reducer";

export default function PlanBasic({ plan, months = 1 }) {
  const {
    discountPercentage,
    selectedPlanCode,
    noOfMonths,
    currency,
    getCurrencySymbol,
    dispatch,
    coachId,
    currentPlanCode,
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
        "mx-auto max-w-[380px] border-1 overflow-hidden rounded-[40px] bg-white transition-all duration-300 select-none cursor-pointer",
        selectedPlanCode === plan.code 
          ? "ring-2 ring-[#67BC2A] shadow-2xl" 
          : "hover:shadow-xl"
      )}
      onClick={() => dispatch(selectPlanCode(plan.code))}
    >
      <div className="bg-[#F1F8EC] p-4 py-10">
        <h2 className="text-[32px] font-bold text-[#0F1F26]">
          {plan.title}
        </h2>
        <p className="text-[16px] leading-tight text-[#5F6571] mb-4 max-w-[280px]">
          For solo coaches starting structured coaching. Run your coaching practice cleanly without advanced automation.
        </p>
        
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[48px] font-black text-[#0F1F26]">
            {currencySymbol}{price}
          </span>
          <span className="text-[18px] font-medium text-[#5F6571]">
            /monthly
          </span>
        </div>

        <CreateRazorpayOrderButton planId={plan.code}>
          <button
            type="button"
            className="w-full rounded-full bg-black py-4 text-[18px] font-bold text-white transition-transform active:scale-[0.98]"
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
      </div>
    </article>
  );
}