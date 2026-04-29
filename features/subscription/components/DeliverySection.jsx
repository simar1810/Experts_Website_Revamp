"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Why should I join ZeeFit as a coach?",
    a: "ZeeFit helps you get discovered by people who are already looking for a coach or a fitness program. Instead of depending only on social media or referrals, you get access to a more serious audience.",
  },
  {
    q: "How will ZeeFit help me get more clients?",
    a: "Your programs are shown to people who are already exploring fitness and wellness solutions. This improves visibility and gives you a better chance of turning interest into paying clients.",
  },
  {
    q: "Do I need a big following to grow on ZeeFit?",
    a: "No. ZeeFit is built to help coaches grow beyond their personal audience. You do not need a large following to get discovered here.",
  },
  {
    q: "What can I offer on ZeeFit?",
    a: "You can list structured programs such as weight loss, muscle gain, lifestyle transformation, detox plans, niche coaching plans, and more.",
  },
  {
    q: "How is ZeeFit different from Instagram?",
    a: "Instagram gives reach. ZeeFit gives intent. People on ZeeFit are not just scrolling. They are actively looking to start something.",
  },
  {
    q: "Can clients contact me directly?",
    a: "Yes. Interested users can send enquiries or connect with you after viewing your profile or programs.",
  },
  {
    q: "Is ZeeFit suitable for beginners?",
    a: "Yes. Whether you are just starting or already experienced, ZeeFit helps you present your coaching in a more structured and professional way.",
  },
];

export default function DeliverySection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-10 text-center text-2xl font-semibold text-[#0F1F26] md:mb-12 md:text-3xl">
          Have questions before you get started?
        </h2>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative flex justify-center">
            <div className="absolute left-10 top-10 h-[420px] w-[220px] rotate-[-8deg] rounded-[32px] bg-black shadow-2xl" />

            <div className="relative z-10 h-[460px] w-[240px] rounded-[36px] border border-gray-200 bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl" />
          </div>

          <div className="rounded-2xl bg-gray-50 p-8 md:p-10">
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = i === openIndex;

                return (
                  <div key={faq.q} className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                      type="button"
                    >
                      <span className="text-base font-medium text-black">
                        {faq.q}
                      </span>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "mt-3 max-h-96" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-gray-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                My question is not here.
              </p>

              <Button
                asChild
                className="w-full bg-black text-white hover:bg-black/90 sm:w-auto"
              >
                <a
                  href="mailto:support@wellnessz.in?subject=ZeeFit%20—%20question"
                >
                  CONNECT US ↗
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
