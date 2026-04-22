import { cn } from "@/lib/utils";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { updateNoOfMonths } from "../state/reducer";
import { Switch } from "@/components/ui/switch";

const BASE_YEARLY_SAVINGS_PERCENTAGE = 42;

export default function PlanDurationSelection() {
  const { dispatch, noOfMonths } = usePricingPageContext();

  const setMonths = function (months) {
    dispatch(updateNoOfMonths(months));
  };

  return (
    <div className="relative mb-8 mt-4 md:mt-8">
      <div className="relative mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-white py-1.5 font-semibold">
        <button
          type="button"
          onClick={() => setMonths(1)}
          className="z-10 w-[5.5rem] text-center text-sm text-gray-900 md:w-24 md:text-base"
        >
          Monthly
        </button>
        <Switch
          checked={noOfMonths === 12}
          onCheckedChange={() => setMonths(noOfMonths === 1 ? 12 : 1)}
          className={cn(
            "!h-8 !w-14 cursor-pointer bg-[#82C04F] data-[state=checked]:bg-[#82C04F] data-[state=unchecked]:bg-[#82C04F]",
            "[&>span]:!h-6 [&>span]:!w-6 [&>span]:bg-white [&>span]:transition-transform",
            "data-[state=checked]:[&>span]:translate-x-7 data-[state=unchecked]:[&>span]:translate-x-1",
          )}
        />
        <button
          type="button"
          onClick={() => setMonths(12)}
          className="z-10 w-[5.5rem] text-center text-sm text-gray-900 md:w-24 md:text-base"
        >
          Yearly
        </button>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-[#82C04F] md:text-sm">
        Save up to {BASE_YEARLY_SAVINGS_PERCENTAGE}% with yearly billing
      </p>
    </div>
  );
}
