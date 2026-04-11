import { ChevronDown, Loader2, PartyPopper, Tag } from "lucide-react";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updatePayload } from "../state/reducer";
import { buildUrlWithQueryParams } from "../utils/razorpay";
import PhoneInputWithCountrySelect, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { fetchAPI, sendData as postData } from "@/lib/api";

const CONGRATS_MODAL_DURATION_MS = 1800;

function scrollToPricingSection() {
  const el = document.getElementById("pricing-plans");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CouponCode() {
  const { appliedCoupon, dispatch } = usePricingPageContext();
  const [currentCode, setCurrentCode] = useState(appliedCoupon);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsDiscountPercent, setCongratsDiscountPercent] = useState(null);
  const isCurrentEmpty = !currentCode?.trim();
  const isAlreadyApplied = Boolean(appliedCoupon) && currentCode === appliedCoupon;

  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!showCongratsModal) return;

    // const fireConfetti = async () => {
    //   const confetti = (await import("canvas-confetti")).default;
    //   if (typeof confetti !== "function") return;
    //   const count = 200;
    //   const defaults = { origin: { y: 0.6 }, zIndex: 9999 };
    //   const fire = (particleRatio, opts) => {
    //     confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    //   };
    //   fire(0.25, { spread: 26, startVelocity: 55, colors: ["#81bc3b", "#67BC2A", "#03632C", "#3C9300"] });
    //   fire(0.2, { spread: 60, colors: ["#81bc3b", "#67BC2A"] });
    //   fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    //   fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    //   fire(0.1, { spread: 120, startVelocity: 45 });
    // };

    // fireConfetti();

    closeTimerRef.current = setTimeout(() => {
      setShowCongratsModal(false);
      scrollToPricingSection();
    }, CONGRATS_MODAL_DURATION_MS);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [showCongratsModal]);

  async function applyCouponCode() {
    try {
      const response = await postData("app/coupons/coupon/apply", { couponCode: currentCode });
      if (response.status_code !== 200) throw new Error(response.message);
      const discountPercentage = !isNaN(response?.data?.discountPercentage)
        ? response?.data?.discountPercentage
        : 0;
      dispatch(updatePayload({
        appliedCoupon: currentCode,
        discountPercentage,
      }));
      setCongratsDiscountPercent(discountPercentage);
      setShowCongratsModal(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  }

  function handleCongratsClose() {
    setShowCongratsModal(false);
    scrollToPricingSection();
  }

  return (
    <div className="mt-10 px-4">
      <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8 relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-r-2" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-l-2" />
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#81bc3b]/10 rounded-lg">
            <Tag className="text-[#81bc3b]" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Coupons & offers
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Have a coupon? Enter it below.
        </p>
        <div className="flex items-center gap-3 w-full">
          <input
            type="text"
            value={currentCode || ""}
            onChange={(e) => setCurrentCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 bg-white border border-gray-300 rounded-lg px-5 h-12 text-base font-medium tracking-wide text-gray-800 
            focus:outline-none focus:ring-2 focus:ring-[#81bc3b] focus:border-[#81bc3b] 
            transition-all duration-200"
          />
          <Button
            className="h-12 px-6 rounded-lg bg-[#81bc3b] text-white font-semibold 
            hover:bg-[#6fa52f] active:scale-95 transition-all duration-200 
            shadow-sm hover:shadow-md"
            disabled={isCurrentEmpty || isAlreadyApplied}
            onClick={applyCouponCode}
          >
            {isAlreadyApplied ? "Applied" : "Apply"}
          </Button>
        </div>
        <CouponSection
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
        />
      </div>

      <Dialog open={showCongratsModal} onOpenChange={(open) => !open && handleCongratsClose()}>
        <DialogContent className="rounded-2xl border-0 shadow-2xl text-center max-w-sm overflow-hidden bg-white" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Coupon applied</DialogTitle>
          <DialogDescription className="sr-only">You are saving {congratsDiscountPercent}% on your plan.</DialogDescription>
          <div className="py-6 px-5">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#81bc3b]/20 ring-4 ring-[#81bc3b]/10">
              <PartyPopper className="h-8 w-8 text-[#81bc3b]" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Coupon applied!</h3>
            <p className="mt-3 text-gray-600">
              You’re saving <span className="font-bold text-[#03632C]">{congratsDiscountPercent}%</span> on your plan.
            </p>
            <p className="mt-4 text-sm text-gray-500">Choosing your plan below…</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CouponSection({
  currentCode,
  setCurrentCode,
}) {
  const { coachId, currency } = usePricingPageContext();
  const isCoachIdPage = Boolean(coachId)
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [coachMobile, setCoachMobile] = useState("");
  const [error, setError] = useState("");
  const [hasRequested, setHasRequested] = useState(false);
  const [showFinder, setShowFinder] = useState(false);

  const fetchCoupons = async () => {
    try {
      setHasRequested(true);
      setLoadingCoupons(true);
      setError("");
      const parsedPhoneNumber = parsePhoneNumber(coachMobile)
      if (!isCoachIdPage && !parsedPhoneNumber) {
        setError("Please enter a valid mobile number");
        return;
      }
      const endpoint = buildUrlWithQueryParams("app/coupons/coach/coupons", {
        ...(
          !isCoachIdPage &&
          Boolean(parsedPhoneNumber) &&
          {
            mobileNumber: parsedPhoneNumber.nationalNumber,
            countryCode: parsedPhoneNumber.country
          }
        ),
        ...(isCoachIdPage && { coachId })
      })
      const response = await fetchAPI(endpoint, null, null, "GET")
      if (response.status_code !== 200) throw new Error(response.message)
      setAvailableCoupons(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load offers. Please try again.");
    } finally {
      setLoadingCoupons(false);
    }
  };

  const isIndianPricing = currency === "INR";
  const defaultCountry = currency === "USD" ? "US" : "IN";

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setShowFinder((prev) => !prev)}
        className="text-sm font-medium text-[#81bc3b] hover:underline flex items-center gap-2"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showFinder ? "rotate-180" : ""}`}
        />
        <span>
          {showFinder
            ? "Hide available offers"
            : isCoachIdPage
              ? "Find coupons for this coach"
              : "Find available offers"}
        </span>
      </button>

      {showFinder && (
        <div className="mt-4 space-y-4">
          {!isCoachIdPage && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mobile number
              </label>
              <div className="flex items-center gap-3 w-full">
                <div className="phone-input-wrapper flex-1">
                  <PhoneInputWithCountrySelect
                    international
                    country={isIndianPricing ? "IN" : undefined}
                    defaultCountry={isIndianPricing ? "IN" : defaultCountry}
                    countries={isIndianPricing ? ["IN"] : undefined}
                    value={coachMobile}
                    onChange={(value) => setCoachMobile(value || "")}
                    placeholder="Enter phone number"
                  />
                </div>
                <Button
                  type="button"
                  onClick={fetchCoupons}
                  disabled={loadingCoupons}
                  className="h-10 px-4 rounded-lg bg-[#81bc3b] text-white text-sm font-semibold hover:bg-[#6fa52f] active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
                >
                  {loadingCoupons ? (
                    <span className="flex items-center gap-1">
                      <Loader2 size={14} className="animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    "Check"
                  )}
                </Button>
              </div>
              <style>{`
                .phone-input-wrapper .PhoneInput {
                  width: 100%;
                }
                .phone-input-wrapper .PhoneInputInput {
                  width: 100%;
                  padding: 0.5rem 1rem;
                  border-radius: 10px;
                  border: 1px solid #e5e7eb;
                  outline: none;
                  transition: all 0.2s;
                }
                .phone-input-wrapper .PhoneInputInput:focus {
                  border-color: #67BC2A;
                  box-shadow: 0 0 0 2px rgba(103, 188, 42, 0.2);
                }
                .phone-input-wrapper .PhoneInputCountryIcon {
                  width: 1.5em;
                  height: 1.2em;
                }
                .phone-input-wrapper .PhoneInputCountrySelect {
                  padding: 0.5rem;
                  border: none;
                  background: transparent;
                  margin-right: 0.5rem;
                }
              `}</style>
            </div>
          )}

          {isCoachIdPage && (
            <div>
              <Button
                type="button"
                onClick={fetchCoupons}
                disabled={loadingCoupons}
                className="mt-1 h-10 px-4 rounded-lg bg-[#81bc3b] text-white text-sm font-semibold hover:bg-[#6fa52f] active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
              >
                {loadingCoupons ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={14} className="animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {hasRequested && (
            <div className="mt-2">
              {loadingCoupons ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-[#81bc3b]" />
                </div>
              ) : availableCoupons.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No offers available right now.
                </p>
              ) : (
                <div className="flex items-center flex-wrap gap-3">
                  {availableCoupons.map((coupon) => (
                    <button
                      key={coupon.code}
                      type="button"
                      onClick={() => setCurrentCode(coupon.code)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                        ${currentCode === coupon.code
                          ? "bg-[#81bc3b] text-white border-[#81bc3b]"
                          : "bg-white border-gray-300 text-gray-700 hover:border-[#81bc3b] hover:text-[#81bc3b]"
                        }`}
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
