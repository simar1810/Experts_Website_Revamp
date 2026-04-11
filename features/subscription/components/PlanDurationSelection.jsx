import { cn } from "@/lib/utils";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { updateNoOfMonths } from "../state/reducer";
import { Switch } from "@/components/ui/switch"

export default function PlanDurationSelection() {
  const { dispatch, discountPercentage, noOfMonths } = usePricingPageContext();

  const setMonths = function (months) {
    dispatch(updateNoOfMonths(months));
  };

  const BASE_YEARLY_SAVINGS_PERCENTAGE = 42;

  const hasCouponDiscount = discountPercentage > 0;
  return (
    <div className="mb-8 mt-4 md:mt-8 relative">
      <div className="w-fit bg-white font-bold mx-auto py-2 flex items-center justify-center gap-2 rounded-full relative">
        {/* <div
          className={`absolute w-24 h-full bg-[#67BC2A] rounded-full transition-all ease-linear duration-350`}
        /> */}
        <button
          onClick={() => setMonths(1)}
          className={`w-24 text-[20px] text-center z-10 ${false && "text-white"}`}
        >
          Monthly
        </button>
        <Switch
          checked={noOfMonths === 12}
          onCheckedChange={() => setMonths(noOfMonths === 1 ? 12 : 1)}
          className={cn(
            "!h-8 !w-14 bg-[#82C04F] data-[state=checked]:bg-[#82C04F] data-[state=unchecked]:bg-[#82C04F] cursor-pointer",
            "[&>span]:!h-6 [&>span]:!w-6 [&>span]:bg-white [&>span]:transition-transform",
            "data-[state=checked]:[&>span]:translate-x-7 [calc(100%-4px)] data-[state=unchecked]:[&>span]:translate-x-1"
          )}
        />
        <button
          onClick={() => setMonths(12)}
          className={`w-24 text-[20px] text-center z-10 ${false && "text-white"}`}
        >
          Yearly
        </button>
      </div>
    </div>
  );
}
