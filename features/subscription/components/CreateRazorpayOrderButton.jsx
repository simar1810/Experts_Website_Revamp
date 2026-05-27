import toast from "react-hot-toast";
import { updateIsAdmin, updateUIState } from "../state/reducer";
import { buildRazorpayOptions, createRazorpayOrder, loadScript } from "../utils/razorpay";
import { useState } from "react";
import { getPlanCodeForPlanType } from "../utils/helpers";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { postData } from "@/lib/api";
import PricingFillDetailsModal from "./PricingFillDetailsModal";

export default function CreateRazorpayOrderButton({ children, planId }) {
  const { dispatch, stage, ...state } = usePricingPageContext();
  const [displayLoginUser, setDisplayLoginUser] = useState(false);
  const openLeadModal = function () {
    const scroller = document.scrollingElement;
    const scrollTop = scroller?.scrollTop ?? window.scrollY ?? 0;
    setDisplayLoginUser(true);
    requestAnimationFrame(() => {
      if (scroller) scroller.scrollTop = scrollTop;
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(() => {
        if (scroller) scroller.scrollTop = scrollTop;
        window.scrollTo(0, scrollTop);
      });
    });
  };

  const handleUserAction = async function () {
    if (stage === "order-creating") {
      return;
    }
    if (state.coachId) {
      await handleRazorpay(state.coachId, true);
    }

    if (!state.coachId) {
      openLeadModal();
    }
  };

  const handleRazorpay = async function (coachId, isAdmin) {
    try {
      dispatch(updateUIState("order-creating"));
      const order = await createRazorpayOrder({
        ...state,
        coachId,
        planId,
        isAdmin,
      });

      await Promise.resolve(loadScript());
      const redirectUrl = "https://app.wellnessz.in/login";
      const options = buildRazorpayOptions(order?.data, {
        onSuccess: async () => {
          if (state.appliedCoupon)
            await postData(
              `app/coupons/coach/coupons?coachId=${coachId}`,
              {
                code: state.appliedCoupon,
                planCode: getPlanCodeForPlanType(state.selectedPlanCode),
              },
            );
          window.location.href = `/pricing/thank-you?redirect=${encodeURIComponent(redirectUrl)}`;
        },
      });

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    }
    dispatch(updateUIState("order-created"));
  };

  const registerUser = async function (form) {
    const { coachId, referredBy } = state;
    try {
      const data = {
        name: form.name,
        credential: form.mobileNumber,
        email: form.email,
        enquiry: form.enquiry,
        ...((coachId || referredBy) && {
          referredByCoach: coachId || referredBy,
        }),
      };

      const response = await postData(
        `app/signin-pricing?authMode=mob&isFromWeb=true`,
        data,
      );

      if (response.status_code !== 200) throw new Error(response?.message);
      dispatch(updateIsAdmin(!response?.data?.isNewRegistration));

      const isAdmin = !response?.data?.isNewRegistration;

      if (response?.data?.isFirstTime === false) {
        await handleRazorpay(response?.data?.user?._id, isAdmin);
        setDisplayLoginUser(false);
        return;
      }

      if (!isAdmin) await handleRazorpay(response?.data?.user?._id, isAdmin);
      if (isAdmin) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-custom-enter" : "animate-custom-leave"} pointer-events-auto flex max-w-md w-full rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 p-5">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">
                  You’re already registered with this phone number
                </p>
                <p className="text-sm text-gray-600">
                  Your 14-day trial has already been used. Continue to purchase to
                  unlock full access.
                </p>
              </div>
            </div>

            <div className="flex border-l border-gray-200">
              <button
                type="button"
                onClick={() =>
                  handleRazorpay(response?.data?.user?._id, isAdmin)
                }
                className="rounded-r-lg px-5 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </div>
          </div>
        ));
      }
      setDisplayLoginUser(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message ?? "Please try again later!");
    }
  };

  return (
    <>
      <div onClick={handleUserAction} className="!cursor-not-allowed">
        {stage !== "order-creating" ? (
          children
        ) : (
          <div className="opacity-50">{children}</div>
        )}
      </div>
      <PricingFillDetailsModal
        open={displayLoginUser}
        onOpenChange={setDisplayLoginUser}
        currency={state.currency}
        onSubmit={registerUser}
      />
    </>
  );
}
