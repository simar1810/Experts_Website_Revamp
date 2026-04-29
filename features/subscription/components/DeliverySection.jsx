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

function ZeeFitAppMockup() {
  const stats = [
    { label: "Clients", value: "128" },
    { label: "Programs", value: "14" },
    { label: "Enquiries", value: "36" },
  ];

  return (
    <div className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden">
      <div className="absolute h-[420px] w-[420px] rounded-full bg-[#67BC2A]/15 blur-3xl" />
      <div className="absolute left-1/2 top-16 h-[410px] w-[220px] -translate-x-[62%] rotate-[-9deg] rounded-[34px] bg-[#0d1f14] shadow-2xl ring-1 ring-white/20" />

      <div className="relative z-10 h-[470px] w-[245px] overflow-hidden rounded-[38px] border-8 border-[#0d1f14] bg-[#f8faf7] shadow-[0_30px_80px_rgba(15,31,22,0.22)]">
        <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0d1f14]" />
        <div className="bg-linear-to-br from-[#1f7a34] via-[#2e7d32] to-[#67BC2A] px-5 pb-7 pt-10 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                ZeeFit
              </p>
              <h3 className="mt-1 text-xl font-bold leading-tight">
                Coach Hub
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              Z
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-xs text-white/75">This week</p>
            <p className="mt-1 text-2xl font-bold">42 new leads</p>
          </div>
        </div>

        <div className="-mt-4 space-y-4 px-4 pb-5">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white p-2 text-center shadow-sm ring-1 ring-black/5"
              >
                <p className="text-sm font-bold text-[#1f7a34]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[9px] font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Active programs</p>
              <span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[9px] font-bold text-[#1f7a34]">
                Live
              </span>
            </div>
            <div className="space-y-3">
              {["Weight Loss", "Strength Plan", "Lifestyle Reset"].map(
                (program, index) => (
                  <div key={program} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f9e8] text-xs font-bold text-[#2e7d32]">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900">
                        {program}
                      </p>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#67BC2A]"
                          style={{ width: `${70 - index * 14}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1f16] p-3 text-white">
            <p className="text-[10px] text-white/60">Next enquiry</p>
            <p className="mt-1 text-sm font-semibold">Ready to start today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeliverySection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-10 text-center text-2xl font-semibold text-[#0F1F26] md:mb-12 md:text-3xl">
          Have questions before you get started?
        </h2>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <ZeeFitAppMockup />

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
