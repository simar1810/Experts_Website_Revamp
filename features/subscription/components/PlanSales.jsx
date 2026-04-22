import { selectPlanCode } from "../state/reducer";
import { cn } from "@/lib/utils";
import CreateRazorpayOrderButton from "./CreateRazorpayOrderButton";
import { Check } from "lucide-react";
import { usePricingPageContext } from "../state/PricingSectionContext";

export default function PlanSales({ plan, months = 1 }) {
  const {
    selectedPlanCode,
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
    ? plan.id === currentPlanCode
      ? "Renew Now"
      : "Upgrade Now"
    : typeof plan.buttonText === "function"
      ? plan.buttonText(false)
      : "Start your 14 day free trial";

  const currencySymbol = getCurrencySymbol();
  const originalRaw = plan.originalPrice?.(months, currency);
  const original = originalRaw != null ? originalRaw : null;
  const priceNum = Number(price);
  const showStrike =
    months === 12 &&
    original != null &&
    !Number.isNaN(priceNum) &&
    original > priceNum;

  return (
    <article
      className={cn(
        "mx-auto flex h-full w-full max-w-[380px] cursor-pointer flex-col overflow-hidden rounded-[40px] bg-white transition-all duration-300 select-none",
        selectedPlanCode === plan.code
          ? "ring-2 ring-[#438439] shadow-2xl"
          : "border border-gray-100 hover:shadow-xl",
      )}
      onClick={() => dispatch(selectPlanCode(plan.code))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dispatch(selectPlanCode(plan.code));
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative bg-gradient-to-b from-[#4AA429] to-[#367a1e] p-4 py-8 md:px-6">
        <h2 className="mb-1.5 text-lg font-bold leading-snug text-white md:text-xl">
          {plan.title}
        </h2>
        <p className="mb-2 max-w-[280px] text-sm leading-snug text-white/90 md:max-w-none">
          {plan.description ||
            "For established coaches building a long-term brand."}
        </p>

        <div className="mb-6 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {showStrike && (
            <span className="text-sm font-medium text-white/45 line-through">
              {currencySymbol}
              {original}
            </span>
          )}
          <span className="text-3xl font-black tabular-nums tracking-tight text-white md:text-4xl">
            {currencySymbol}
            {price}
          </span>
          <span className="text-sm font-medium text-white/80">
            {months === 12 ? "/year" : "/monthly"}
          </span>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CreateRazorpayOrderButton planId={plan.code}>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-white py-3 text-sm font-bold text-[#367a1e] shadow-md transition-transform active:scale-[0.98] md:text-base"
            >
              {buttonLabel}
            </button>
          </CreateRazorpayOrderButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="mb-4 text-lg font-bold text-[#1F384C]">
          This plan includes:
        </p>
        <ul className="flex-1 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-[#67BC2A]"
                strokeWidth={3}
              />
              <span className="text-sm font-medium leading-snug text-[#707D8B]">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {plan.bestFor ? (
          <div className="mt-8 border-t border-gray-100 pt-5">
            <p className="text-[11px] font-black uppercase leading-snug tracking-[0.12em] text-[#4AA429]">
              Best for: {plan.bestFor}
            </p>
          </div>
        ) : null}

        <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          {plan.billingText(months)}
        </p>
      </div>
    </article>
  );
}
