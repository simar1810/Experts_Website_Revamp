"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

const faqs = [
  {
    q: "Why should I join Zeefit as a coach?",
    a: "Zeefit helps you get discovered by people who are already looking for a coach or a fitness program. Instead of depending only on social media or referrals, you get access to a more serious audience.",
  },
  {
    q: "How will Zeefit help me get more clients?",
    a: "Your programs are shown to people who are already exploring fitness and wellness solutions. This improves visibility and gives you a better chance of turning interest into paying clients.",
  },
  {
    q: "Do I need a big following to grow on Zeefit?",
    a: "No. Zeefit is built to help coaches grow beyond their personal audience. You do not need a large following to get discovered here.",
  },
  {
    q: "What can I offer on Zeefit?",
    a: "You can list structured programs such as weight loss, muscle gain, lifestyle transformation, detox plans, niche coaching plans, and more.",
  },
  {
    q: "How is Zeefit different from Instagram?",
    a: "Instagram gives reach. Zeefit gives intent. People on Zeefit are not just scrolling. They are actively looking to start something.",
  },
  {
    q: "Can clients contact me directly?",
    a: "Yes. Interested users can send enquiries or connect with you after viewing your profile or programs.",
  },
  {
    q: "Is Zeefit suitable for beginners?",
    a: "Yes. Whether you are just starting or already experienced, Zeefit helps you present your coaching in a more structured and professional way.",
  },
];

const appMockups = [
  {
    src: "/images/pricing/mockups/Mock-2.png",
    alt: "WellnessZ app meals and recipes screen",
  },
  {
    src: "/images/pricing/mockups/Mock-3.png",
    alt: "WellnessZ app progress screen",
  },
];

function BrandAppMockup() {
  return (
    <div className="relative -mx-8 flex min-h-[600px] w-[calc(100%+4rem)] items-center justify-center overflow-visible px-8">
      <div className="absolute h-[540px] w-[540px] rounded-full bg-[#67BC2A]/15 blur-3xl" />

      <div className="relative flex w-full max-w-[640px] items-center justify-center">
        {appMockups.map((mockup, index) => (
          <div
            key={mockup.src}
            className={`relative aspect-[9/19.5] w-[58%] max-w-[280px] sm:w-[52%] ${
              index === 0
                ? "translate-x-10 rotate-[-5deg] sm:translate-x-16"
                : "-translate-x-10 translate-y-10 rotate-[5deg] sm:-translate-x-16"
            }`}
          >
            <Image
              src={mockup.src}
              alt={mockup.alt}
              fill
              sizes="(max-width: 768px) 58vw, 280px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeliverySection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { displayName } = useBrandingContext();
  const replaceBrand = (text) => text.replaceAll("Zeefit", displayName);
  const supportHref = `mailto:support@wellnessz.in?subject=${encodeURIComponent(
    `${displayName} — question`,
  )}`;

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-10 text-center text-2xl font-semibold text-[#0F1F26] md:mb-12 md:text-3xl">
          Have questions before you get started?
        </h2>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <BrandAppMockup />

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
                        {replaceBrand(faq.q)}
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
                        {replaceBrand(faq.a)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
