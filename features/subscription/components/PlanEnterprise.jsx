import { cn } from "@/lib/utils";
import { selectPlanCode } from "../state/reducer";
import { usePricingPageContext } from "../state/PricingSectionContext";
import SalesContactForm from "./SalesContactForm";

export default function PlanEnterprise({ plan }) {
  const { selectedPlanCode, dispatch, coachId } = usePricingPageContext();
  
  const buttonLabel = Boolean(coachId)
    ? "Talk to sales about upgrading"
    : "Contact Us";

  return (
    <article
      className={cn(
        "w-full rounded-[40px] p-10 transition-all duration-300 select-none cursor-pointer overflow-hidden",
        "bg-gradient-to-r from-[#2D5A27] via-[#438439] to-[#67BC2A]",
        selectedPlanCode === plan.code ? "ring-4 ring-white shadow-2xl" : "hover:shadow-xl"
      )}
      onClick={() => dispatch(selectPlanCode(plan.code))}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Section: Title & Description */}
        <div className="flex-1 text-left">
          <h2 className="text-[42px] font-bold text-white mb-4">
            {plan.title}
          </h2>
          <p className="text-[18px] text-white/80 leading-snug max-w-[400px]">
            For clinics, large coaching teams & high-volume practices
          </p>
        </div>

        {/* Center Section: Features (White Dots) */}
        <div className="flex-[1.5]">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                <span className="text-[18px] font-medium text-white leading-tight">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section: Button */}
        <div className="shrink-0">
          <SalesContactForm
            plans={[plan]}
            trigger={
              <button
                type="button"
                className="min-w-[200px] rounded-full bg-white px-10 py-5 text-[20px] font-bold text-[#2D5A27] transition-all hover:bg-gray-100 active:scale-95 shadow-lg"
              >
                {buttonLabel}
              </button>
            }
          />
        </div>
      </div>
    </article>
  );
}