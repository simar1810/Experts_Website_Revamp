import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { usePricingPageContext } from "../state/PricingSectionContext";
import { sendData as postData } from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SalesContactForm({ plans = [], trigger }) {
  const [step, setStep] = useState("contact-form"); // plan-selection, contact-form, thank-you
  const [selectedPlanCode, setSelectedPlanCode] = useState("enterprise");
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    enquiry: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plans.length === 1) {
      setSelectedPlanCode(plans[0].code);
      setStep("contact-form");
    } else {
      setStep("plan-selection");
      setSelectedPlanCode(null);
    }
  }, [plans]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
      newErrors.mobileNumber = "Invalid mobile number (10 digits)";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // For mobile number, only allow digits and limit to 10 characters
    if (field === "mobileNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setForm({ ...form, [field]: digitsOnly });
      }
    } else {
      setForm({ ...form, [field]: value });
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        name: form.name,
        email: form.email,
        phone: form.mobileNumber,
        plan: selectedPlanCode,
        enquiry: form.enquiry,
      };
      const response = await postData("app/purchase-page/contact", data);
      if (!response.success) throw new Error(response?.message);
      setStep("thank-you");
    } catch (error) {
      toast.error(error.message ?? "Please try again later!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog className="!bg-transparent">
      <DialogTrigger asChild={!!trigger}>
        {trigger || (
          <button className="text-[#67BC2A] font-semibold hover:underline">Contact Us</button>
        )}
      </DialogTrigger>
      <DialogContent className="background-blur-0 max-w-[840px] p-0 gap-y-0">
        <DialogTitle className="p-4 text-[28px] !font-semibold text-center border-b border-gray-100">
          {step === "thank-you" && "Success!"}
          {step === "contact-us" && "Contact Us!"}
        </DialogTitle>

        {step === "plan-selection" && (
          <div className="grid grid-cols-2 gap-4 p-8">
            {plans.map((plan) => (
              <PlanDescription
                key={plan.id}
                plan={plan}
                onSelection={() => {
                  setSelectedPlanCode(plan.code);
                  setStep("contact-form");
                }}
              />
            ))}
          </div>
        )}

        {step === "contact-form" && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              {plans.length > 1 && (
                <button
                  onClick={() => setStep("plan-selection")}
                  className="text-[#67BC2A] font-semibold flex items-center gap-2 hover:underline"
                >
                  <span>&larr;</span> Back to plans
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-2 mt-2 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-2/3 -translate-y-2/3 text-gray-400 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    maxLength={10}
                    inputMode="numeric"
                    className={`w-full px-4 py-2 mt-2 pl-14 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.mobileNumber ? "border-red-500" : "border-gray-200"
                      }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-2 mt-2 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Enquiry</label>
                <textarea
                  placeholder="What is you enquiry?"
                  value={form.enquiry}
                  onChange={(e) => handleInputChange("enquiry", e.target.value)}
                  className={`w-full h-[100px] px-4 py-2 mt-2 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-[#67BC2A] transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="max-w-[400px] mx-auto flex items-center justify-center w-full py-3 mt-4 bg-gradient-to-r from-[#67BC2A] to-[#3C9300] text-white font-bold text-lg rounded-[10px] shadow-lg shadow-green-200 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Started Now"
              )}
            </button>
          </div>
        )}

        {step === "thank-you" && (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-[#67BC2A] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">Thank You!</h3>
            <p className="text-lg text-gray-600 max-w-[400px] mx-auto">
              We've received your request and will contact you within the next 24 hours to discuss
              your personalized plan.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PlanDescription({ plan, onSelection }) {
  const { noOfMonths, currency } = usePricingPageContext();
  const currencySymbol = currency === "INR" ? "₹" : "$";
  const duration = noOfMonths === 1 ? "month" : "year";
  return (
    <div
      onClick={onSelection}
      className="p-4 rounded-[10px] text-white bg-linear-to-tl from-green-800 to-[#67BC2A] cursor-pointer"
    >
      <p className="text-[28px] font-semibold text-center">
        {currencySymbol} {plan.originalPrice(noOfMonths)}&nbsp;/&nbsp;{duration}
      </p>
      <p className="text-center text-gray-200 mt-4">{plan.title}</p>
    </div>
  );
}
