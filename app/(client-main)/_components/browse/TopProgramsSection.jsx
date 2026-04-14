"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TopProgramCard } from "../landing";
import { BrowseProgramCard } from "./BrowseProgramCard";


export function TopProgramsSection() {
  const c = {
    titleLight: "TOP",
    titleHighlight: "PROGRAMS",
    seeMoreLabel: "See More",
    seeMoreHref: "/find-experts",
    programs: [
      {
        id: "pt-lite",
        badgeLabel: "TOP RATED",
        name: "PT Lite Monthly Package",
        features: [
          "Weekly Neuro-Muscular Tuning",
          "Bespoke Joint Mobility Protocol",
          "24/7 Digital Concierge Access",
        ],
        price: "₹2999",
        enrollLabel: "ENROLL NOW",
        enrollHref: "/experts",
        deliveryTags: ["ONLINE", "IN-CLINIC"],
        authorName: "Naresh Verma",
        enrollmentLine: "100k+ People Enrolled in this Program",
        authorAvatarSrc:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&q=80",
        imageSrc:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
        imageAlt: "Training and wellness program",
      },
      {
        id: "strength-elite",
        badgeLabel: "TOP RATED",
        name: "Strength Elite Quarterly",
        features: [
          "Monthly Performance Testing",
          "Custom Mesocycle Programming",
          "Priority Coach Messaging",
        ],
        price: "₹7999",
        enrollLabel: "ENROLL NOW",
        enrollHref: "/experts",
        deliveryTags: ["ONLINE", "IN-CLINIC"],
        authorName: "Priya Nair",
        enrollmentLine: "50k+ Athletes Trust This Program",
        authorAvatarSrc:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80",
        imageSrc:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        imageAlt: "Strength training session",
      },
      {
        id: "strength-elite1",
        badgeLabel: "TOP RATED",
        name: "Strength Elite Quarterly",
        features: [
          "Monthly Performance Testing",
          "Custom Mesocycle Programming",
          "Priority Coach Messaging",
        ],
        price: "₹7999",
        enrollLabel: "ENROLL NOW",
        enrollHref: "/experts",
        deliveryTags: ["ONLINE", "IN-CLINIC"],
        authorName: "Priya Nair",
        enrollmentLine: "50k+ Athletes Trust This Program",
        authorAvatarSrc:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80",
        imageSrc:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        imageAlt: "Strength training session",
      },
      {
        id: "strength-elite2",
        badgeLabel: "TOP RATED",
        name: "Strength Elite Quarterly",
        features: [
          "Monthly Performance Testing",
          "Custom Mesocycle Programming",
          "Priority Coach Messaging",
        ],
        price: "₹7999",
        enrollLabel: "ENROLL NOW",
        enrollHref: "/experts",
        deliveryTags: ["ONLINE", "IN-CLINIC"],
        authorName: "Priya Nair",
        enrollmentLine: "50k+ Athletes Trust This Program",
        authorAvatarSrc:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80",
        imageSrc:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        imageAlt: "Strength training session",
      },
      {
        id: "strength-elite3",
        badgeLabel: "TOP RATED",
        name: "Strength Elite Quarterly",
        features: [
          "Monthly Performance Testing",
          "Custom Mesocycle Programming",
          "Priority Coach Messaging",
        ],
        price: "₹7999",
        enrollLabel: "ENROLL NOW",
        enrollHref: "/experts",
        deliveryTags: ["ONLINE", "IN-CLINIC"],
        authorName: "Priya Nair",
        enrollmentLine: "50k+ Athletes Trust This Program",
        authorAvatarSrc:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80",
        imageSrc:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        imageAlt: "Strength training session",
      },
    ],
  };

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(c.programs.length / ITEMS_PER_PAGE);

  const [page, setPage] = useState(0);

  const handleNext = () => {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

  const visiblePrograms = c.programs.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section
      id="top-programs"
      className="scroll-mt-24 bg-[#03632C] py-14 font-montserrat sm:py-20"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-15">

        {/* HEADER */}
        <div className="flex flex-row mx-auto items-center justify-between gap-4 sm:items-end">
          <h2 className="text-2xl mx-auto sm:text-3xl lg:text-[3.6rem] text-center font-extrabold uppercase leading-none tracking-[0.02em] space-x-3">
            <span className="text-[#9AF45D]">Our</span>
            <span className="text-white">Top Selling</span>
            <span className="text-[#9AF45D]">Programs</span>
          </h2>
        </div>

        {/* MOBILE + DESKTOP SAFE GRID */}
         <div className=" mt-10 hidden sm:grid sm:grid-cols-2 gap-6 transition-all duration-500 ease-in-out">
          {visiblePrograms.map((p) => (
            <div key={p.id} className="w-full h-full">
              <BrowseProgramCard {...p} />
            </div>
          ))}
        </div>

        {/* CHEVRONS (UNCHANGED UI) */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white disabled:opacity-30 hover:bg-white/10"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white disabled:opacity-30 hover:bg-white/10"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* SEE MORE */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={c.seeMoreHref}
            className="rounded-xl bg-white/10 px-10 py-4 text-[0.9375rem] font-semibold text-[#7ED957] transition-colors hover:bg-wz-program-card/90"
          >
            {c.seeMoreLabel}
          </Link>
        </div>

      </div>
    </section>
  );
}