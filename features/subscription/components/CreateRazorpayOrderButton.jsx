import toast from "react-hot-toast";
import { updateIsAdmin, updateUIState } from "../state/reducer";
import { buildRazorpayOptions, createRazorpayOrder, loadScript } from "../utils/razorpay";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { postData } from "@/helpers/api";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getPlanCodeForPlanType } from "../utils/helpers";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { postData } from "@/lib/api";

export default function CreateRazorpayOrderButton({ children, planId }) {
  const { dispatch, stage, ...state } = usePricingPageContext();
  const [displayLoginUser, setDisplayLoginUser] = useState(false);

  const handleUserAction = async function () {
    if (stage === "order-creating") {
      return;
    }
    if (state.coachId) {
      await handleRazorpay(state.coachId, true);
    }

    if (!state.coachId) {
      setDisplayLoginUser(true);
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

      await Promise.resolve(loadScript())
      const redirectUrl = "https://app.wellnessz.in/login";
      const options = buildRazorpayOptions(order?.data, {
        onSuccess: async () => {
          if (state.appliedCoupon) await postData(`app/coupons/coach/coupons?coachId=${coachId}`, {
            code: state.appliedCoupon,
            planCode: getPlanCodeForPlanType(state.selectedPlanCode)
          })
          window.location.href = `/pricing/thank-you?redirect=${encodeURIComponent(redirectUrl)}`;
        }
      })

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error(error.message);
    }
    dispatch(updateUIState("order-created"));
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
      {displayLoginUser && (
        <DisplayLoginUserModal
          open={displayLoginUser}
          onOpenChange={setDisplayLoginUser}
          openRazorpay={handleRazorpay}
        />
      )}
    </>
  );
}

function DisplayLoginUserModal({ onOpenChange, open, openRazorpay }) {
  const { dispatch, currency, coachId, referredBy } = usePricingPageContext();
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    enquiry: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Set country based on currency - lock to India for INR, allow selection for USD
  const isIndianPricing = currency === "INR";
  const defaultCountry = currency === "USD" ? "US" : "IN";

  const validate = function () {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!isValidPhoneNumber(form.mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = function (field, value) {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const registerUser = async function (e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        name: form.name,
        credential: form.mobileNumber,
        email: form.email,
        enquiry: form.enquiry,
        ...((coachId || referredBy) && { referredByCoach: coachId || referredBy }),
      };

      const response = await postData(
        `app/signin-pricing?authMode=mob&isFromWeb=true`,
        data,
      );

      console.log("response",response, response.status_code)

      if (response.status_code !== 200) throw new Error(response?.message);
      dispatch(updateIsAdmin(!response?.data?.isNewRegistration));

      const isAdmin = !response?.data?.isNewRegistration;

      if (response?.data?.isFirstTime === false) {
        openRazorpay(response?.data?.user?._id, isAdmin);
        onOpenChange(false);
        return;
      }

      if (!isAdmin) openRazorpay(response?.data?.user?._id, isAdmin);
      if (isAdmin) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-custom-enter" : "animate-custom-leave"
              } max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
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
                onClick={() => openRazorpay(response?.data?.user?._id, isAdmin)}
                className="px-5 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-r-lg"
              >
                Continue
              </button>
            </div>
          </div>
        ));
      }
      // toast.success(response.message || "Registration successful!");
      onOpenChange(false);
    } catch (error) {
      console.error(error)
      toast.error(error.message ?? "Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-0 overflow-hidden rounded-[20px] bg-white border-none shadow-2xl">
        <DialogTitle className="p-6 text-[28px] md:text-[28px] !font-bold text-center border-b border-gray-100">
          Fill Details
        </DialogTitle>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-2 mt-2 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  international
                  country={isIndianPricing ? "IN" : undefined}
                  defaultCountry={isIndianPricing ? "IN" : defaultCountry}
                  countries={isIndianPricing ? ["IN"] : undefined}
                  value={form.mobileNumber}
                  onChange={(value) => handleInputChange("mobileNumber", value || "")}
                  placeholder="Enter phone number"
                  className={errors.mobileNumber ? "phone-input-error" : ""}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNumber}
                </p>
              )}
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
                .phone-input-wrapper .phone-input-error .PhoneInputInput,
                .phone-input-wrapper .PhoneInputInput.phone-input-error {
                  border-color: #ef4444;
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-2 mt-2 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <button
            onClick={registerUser}
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#67BC2A] to-[#3C9300] text-white font-bold text-lg rounded-[10px] shadow-lg shadow-green-200 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
