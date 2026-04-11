import { useContext, createContext, useReducer, Suspense } from "react";
import { reducer } from "./reducer";
import { buildInitialState } from "./initialState";
import { useParams, useSearchParams } from "next/navigation";

const PricingPageContext = createContext();

export const PricingSectionContext = function ({ children, skipPlan, currentPlanCode }) {
  const params = useParams();
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(
    reducer,
    buildInitialState(
      {
        referredBy: searchParams.get("referredBy"),
        coachId: params.id || params.coachId || searchParams.get("coachId"),
        currentPlanCode,
      },
      skipPlan,
    ),
  );

  return (
    <Suspense>
      <PricingPageContext.Provider
        value={{
          ...state,
          getCurrencySymbol: () => state.currency === "INR" ? "₹" : "$",
          dispatch,
        }}
      >
        {children}
      </PricingPageContext.Provider>
    </Suspense>
  );
};

export const usePricingPageContext = function () {
  const context = useContext(PricingPageContext);
  return context;
};
