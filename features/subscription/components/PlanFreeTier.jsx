import { postData } from "@/lib/api";
import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { freeTier } from "../utils/config";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";

export default function PlanFreeTier() {
  return (
    <article
      className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[40px] bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl select-none"
    >
      <div className="bg-[#F8FAFC] px-8 py-10 text-center">
        <h2 className="text-[32px] font-black text-[#0F1F26] mb-2">
          Trial Plan
        </h2>
        <p className="text-[16px] font-medium text-[#5F6571] mb-2">
          Experience the full power of WellnessZ for 14 days.
        </p>

        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-[48px] font-black text-[#0F1F26]">
            Free
          </span>
          <span className="text-[18px] font-medium text-[#5F6571]">
            /14 days
          </span>
        </div>

        <CreateFreeTier />
      </div>

      <div className="p-8">
        <p className="text-[20px] font-bold text-[#1F384C] mb-6">
          Everything to get started:
        </p>

        <ul className="space-y-4">
          {(Array.isArray(freeTier?.features) ? freeTier.features : [])
            .map((feature, index) => (
              <li key={index} className="flex items-start gap-4">
                <Check className="text-[#67BC2A] h-5 w-5 mt-1 shrink-0" strokeWidth={3} />
                <span className="text-[17px] font-medium text-[#707D8B] leading-tight">
                  {feature}
                </span>
              </li>
            ))}
        </ul>

        <div className="mt-10 pt-6 border-t border-gray-50 text-center">
          <p className="text-[13px] font-bold text-[#67BC2A] uppercase tracking-[0.15em]">
            No Credit Card Required
          </p>
        </div>
      </div>
    </article>
  );
}



function CreateFreeTier() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "IN",
    mobileNumber: "",
  })
  const [errors, setErrors] = useState([])

  const createFreeTier = async function () {
    try {
      setLoading(true);
      const response = await postData("app/subscriptions/initialize-free-tier", formData);
      console.log(response)
      if (response.status_code !== 200) throw new Error(response.message);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const isIndianPricing = formData.countryCode === "IN"

  return <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className="w-full rounded-full bg-[#67BC2A] py-4 cursor-pointer text-[18px] font-bold text-white transition-all hover:bg-[#58a124] active:scale-[0.98] shadow-lg shadow-green-100 uppercase tracking-wider"
      // onClick={createFreeTier}
      >
        Start Your Free Trial
      </button>
    </DialogTrigger>
    <DialogContent className="!w-full !max-w-[550px] gap-0 space-y-0 p-0 max-h-[70vh] overflow-y-auto">
      <DialogTitle className="p-4 border-b-1">Register</DialogTitle>
      <div className="p-4">
        <label className="font-bold mb-1 text-[16px] block">
          Name
          <input
            value={formData.name}
            onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="w-full font-light text-[15px] mt-1 px-4 py-2 border-1 focus:outline-none bg-slate-50 rounded-[6px]"
            placeholder="Name"
          />
        </label>
        <label className="font-bold mb-1 mt-4 text-[16px] block">
          Mobile Number
          <input
            value={formData.mobileNumber}
            onChange={e => setFormData(prev => ({
              ...prev,
              mobileNumber: e.target.value
            }))}
            className="w-full font-light text-[15px] mt-1 px-4 py-2 border-1 focus:outline-none bg-slate-50 rounded-[6px]"
            placeholder="Mobile Number"
            type="number"
          />
        </label>
        <div className="grid grid-cols-2 mt-4 gap-2">
          <DialogClose asChild>
            <Button variant="destructive" className="font-bold uppercase cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-green-600 text-white font-bold uppercase cursor-pointer"
            onClick={createFreeTier}
          >
            Apply
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}