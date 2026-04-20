"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Why do I need WellnessZ as a coach?",
    a: "Managing clients manually takes too much time and effort. WellnessZ automates meal planning, client tracking, progress reporting, and reminders—helping you scale your business effortlessly.",
  },
  {
    q: "How will WellnessZ help me grow my coaching business?",
    a: "With automation, analytics, and better client engagement tools, you can handle more clients while maintaining quality.",
  },
  {
    q: "What makes WellnessZ different from other tools?",
    a: "It’s built specifically for health coaches with features like diet planning, progress tracking, and habit monitoring in one place.",
  },
  {
    q: "Can I create personalized diet plans?",
    a: "Yes, you can fully customize plans based on your clients' goals, preferences, and restrictions.",
  },
  {
    q: "How does progress tracking work?",
    a: "Clients update their data, and you get visual insights, reports, and trends automatically.",
  },
];

export default function DeliverySection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          
          <div className="relative flex justify-center">
            <div className="absolute left-10 top-10 h-[420px] w-[220px] rounded-[32px] bg-black shadow-2xl rotate-[-8deg]" />

            <div className="relative z-10 h-[460px] w-[240px] rounded-[36px] bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl border border-gray-200" />
          </div>

          <div className="rounded-2xl bg-gray-50 p-8 md:p-10">
            <h2 className="text-3xl font-semibold mb-6">
              Do you have questions?
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = i === openIndex;

                return (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-4"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? -1 : i)
                      }
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-base font-medium text-black">
                        {faq.q}
                      </span>

                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "mt-3 max-h-40" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                My question is not here.
              </p>

              <Button className="bg-black text-white hover:bg-black/90">
                CONNECT US ↗
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}