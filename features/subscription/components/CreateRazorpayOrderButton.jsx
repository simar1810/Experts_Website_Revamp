import toast from "react-hot-toast";
import { updateUIState } from "../state/reducer";
import { useState } from "react";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { postData } from "@/lib/api";
import PricingFillDetailsModal from "./PricingFillDetailsModal";

export default function CreateRazorpayOrderButton({ children }) {
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
    openLeadModal();
  };

  const registerUser = async function (form) {
    try {
      dispatch(updateUIState("order-creating"));
      const payload = {
        name: form.name,
        email: form.email,
        city: form.city,
        profession: form.profession,
        countryCode: form.countryCode || "IN",
        mobileNumber: form.nationalMobileNumber,
      };

      const freeTierResponse = await postData(
        "app/subscriptions/initialize-free-tier",
        payload,
      );
      if (
        freeTierResponse.status_code !== 200 &&
        !String(freeTierResponse.message || "")
          .toLowerCase()
          .includes("ineligible")
      ) {
        throw new Error(freeTierResponse?.message);
      }

      const otpResponse = await postData(
        "app/signin?authMode=mob&clientType=web",
        {
          credential: payload.mobileNumber,
          countryCode: payload.countryCode,
          fcmToken: "",
        },
      );
      if (otpResponse.status_code !== 200) throw new Error(otpResponse?.message);
      toast.success("OTP sent successfully!");
      return otpResponse;
    } catch (error) {
      console.error(error);
      toast.error(error.message ?? "Please try again later!");
      throw error;
    } finally {
      dispatch(updateUIState("order-created"));
    }
  };

  return (
    <>
      <div onClick={handleUserAction} className="cursor-pointer">
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
