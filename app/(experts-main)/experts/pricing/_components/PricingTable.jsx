import { Check } from "lucide-react";
import DiscountBadge from "./DiscountBadge";

export default function PricingTable() {
  const plans = [
    {
      name: "Free",
      price: "Free",
      period: "/Lifetime",
      buttonText: "Current Plan",
      buttonClass:
        "bg-[#E5E7EB] border border-black text-black hover:bg-gray-300",
    },
    {
      name: "$25",
      price: "$25",
      period: "/Month",
      buttonText: "Choose This Plan",
      buttonClass: "bg-[#21212B] text-white hover:bg-black",
    },
    {
      name: "$40",
      price: "$40",
      period: "/Month",
      buttonText: "Choose This Plan",
      buttonClass: "bg-[#71BC2B] text-white hover:bg-[#63a525]",
    },
  ];

  const features = [
    {
      title: "Number of Users",
      values: [
        "20 Pages",
        { main: "600 Pages", sub: "Pages Add-ons on Demand" },
        { main: "Unlimited", sub: "Pages Add-ons on Demand" },
      ],
    },
    {
      title: "Users Per Page",
      values: [
        "5 Pages",
        "50 Pages",
        { main: "Unlimited", sub: "Pages Add-ons on Demand" },
      ],
    },
    {
      title: "Includes essential features to get started",
      values: [true, true, true],
    },
    {
      title: "More advanced features for increased productivity",
      values: [true, true, true],
    },
    {
      title: "Designing & Development",
      values: [null, true, true],
    },
    {
      title: "Customizable options to meet your specific needs",
      values: [null, true, true],
    },
    {
      title: "Secure data storage",
      values: [null, null, true],
    },
    {
      title: "Email Support",
      values: [null, null, true],
    },
    {
      title: "24/7 customer support",
      values: [null, null, true],
    },
    {
      title: "Analytics and reporting",
      values: [null, true, true],
    },
    {
      title: "Account Management",
      values: [true, true, true],
    },
  ];

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Mobile: Plan cards stacked */}
      <div className="md:hidden space-y-6">
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">
          Compare plans
        </h2>
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-6">
          Choose your workspace plan according to your organisational plan
        </p>
        {plans.map((plan, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <div className="mb-4">
              <span className="text-2xl font-black text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-400 text-[10px] font-medium ml-1">
                {plan.period}
              </span>
            </div>
            <button
              className={`w-full py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>
            <ul className="mt-4 space-y-3 text-left">
              {features.slice(0, 5).map((feature, fi) => (
                <li
                  key={fi}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  {feature.values[i] === true ? (
                    <Check
                      size={14}
                      className="text-[#71BC2B] shrink-0 mt-0.5"
                      strokeWidth={3}
                    />
                  ) : typeof feature.values[i] === "object" &&
                    feature.values[i] !== null ? (
                    <span className="text-gray-700 font-medium shrink-0">
                      {feature.values[i].main}
                    </span>
                  ) : feature.values[i] ? (
                    <span className="shrink-0">{feature.values[i]}</span>
                  ) : (
                    <span className="text-gray-300 shrink-0">—</span>
                  )}
                  <span className="text-gray-500 font-normal">
                    {feature.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Desktop: Full comparison table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[1000px] bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-6 text-left w-1/4 border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex w-full items-center justify-between">
                      <h2 className="text-xl text-gray-900 tracking-tight">
                        Compare plans
                      </h2>
                      <DiscountBadge discountValue={40} />
                    </div>
                    {/* <span className="bg-[#E9F7E9] text-[#71BC2B] text-[9px] text-center font-black px-6 py-0.5 rounded-xl uppercase tracking-wider">
                                        40% Off
                                    </span> */}
                  </div>
                  <p className="text-[11px] text-[#858BA0] font-medium w-full">
                    Choose your workspace plan according to your organisational
                    plan
                  </p>
                </th>
                {plans.map((plan, i) => (
                  <th
                    key={i}
                    className={`p-8 text-center border-gray-100 ${i < plans.length - 1 ? "border-r" : ""}`}
                  >
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex justify-center items-center">
                        <span className="text-3xl font-black text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-gray-400 text-[10px] font-medium ml-1">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`w-full py-3.5 rounded-xl text-xs transition-all ${plan.buttonClass}`}
                    >
                      {plan.buttonText}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 group transition-colors hover:bg-gray-50/50"
                >
                  <td className="p-6 text-sm text-black border-r border-gray-100">
                    {feature.title}
                  </td>
                  {feature.values.map((val, idx) => (
                    <td
                      key={idx}
                      className={`p-6 text-center border-gray-100 ${idx < 2 ? "border-r" : ""}`}
                    >
                      {val === true ? (
                        <div className="flex justify-center">
                          <div className="w-5 h-5 bg-[#71BC2B] rounded-full flex items-center justify-center">
                            <Check
                              size={12}
                              className="text-white"
                              strokeWidth={5}
                            />
                          </div>
                        </div>
                      ) : typeof val === "object" && val !== null ? (
                        <div>
                          <div className="text-xs text-gray-700 leading-tight">
                            {val.main}
                          </div>
                          <div className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                            {val.sub}
                          </div>
                        </div>
                      ) : val ? (
                        <span className="text-xs  text-gray-700">{val}</span>
                      ) : (
                        <div className="h-5"></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
