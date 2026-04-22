import { plans } from "../utils/config";

export const initialState = {};

const PRICING_PLAN_DISCOUNT = 0

export const buildInitialState = function (state, skipPlan = false) {
  const plans = buildPlans(state.coachId, skipPlan);
  const currency = detectCurrency();
  return {
    noOfMonths: 1,
    selectedPlanCode: "",
    currency,
    plans,
    referredBy: state.referredBy,
    coachId: state.coachId,
    currentPlanCode: state.currentPlanCode ?? null,
    discountPercentage: state.coachId ? PRICING_PLAN_DISCOUNT : PRICING_PLAN_DISCOUNT,
    stage: "plans-displayed",
    isAdmin: true,
    appliedCoupon: ""
  };
};

const buildPlans = function (coachId, skipPlan) {
  if (coachId) {
    return plans.filter((item) => (skipPlan ? item.id !== 1 : true));
  }
  return plans;
};

const detectCurrency = function () {
  const href =
    typeof window !== "undefined" ? window.location.href : "";
  // USD only on explicit international routes — "expert" appears in many INR pages (e.g. /experts/pricing, find-experts).
  if (/\/intl(\/|$|\?|#)/i.test(href) || /\bcurrency=usd\b/i.test(href)) {
    return "USD";
  }
  return "INR";
};
