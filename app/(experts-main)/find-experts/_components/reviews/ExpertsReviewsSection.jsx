"use client";

import { useState } from "react";
import ExpertsReviewCard from "./ExpertsReviewCard";
import { testimonials } from "@/lib/data/landingContent";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

export default function ExpertsReviewsSection() {
  const { displayName } = useBrandingContext();
  const marqueeReviews = [...testimonials, ...testimonials];
  const [isRowOnePaused, setIsRowOnePaused] = useState(false);
  const [isRowTwoPaused, setIsRowTwoPaused] = useState(false);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-linear-to-b from-[#6eb832] via-[#5a9e28] to-[#2d5016] mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-400/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center text-white relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">
          Trusted by People Starting  <span className="text-lime-200">Real Journeys</span>
        </h2>
        <p className="text-lime-50/80 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          From finding the right coach to starting the right program, here’s what users are saying about {displayName}.
        </p>
      </div>

      <div className="overflow-hidden mb-8">
        <div
          className="flex w-max gap-6 px-6 pb-4 animate-marqueex"
          style={{
            animationDuration: "55s",
            animationPlayState: isRowOnePaused ? "paused" : "running",
          }}
        >
          {marqueeReviews.map((review, idx) => (
            <div
              key={`row-1-wrap-${idx}`}
              onMouseEnter={() => setIsRowOnePaused(true)}
              onMouseLeave={() => setIsRowOnePaused(false)}
            >
              <ExpertsReviewCard key={`row-1-${idx}`} {...review} />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex w-max gap-6 px-6 pb-4 animate-marqueex"
          style={{
            animationDuration: "55s",
            animationDirection: "reverse",
            animationPlayState: isRowTwoPaused ? "paused" : "running",
          }}
        >
          {marqueeReviews.map((review, idx) => (
            <div
              key={`row-2-wrap-${idx}`}
              onMouseEnter={() => setIsRowTwoPaused(true)}
              onMouseLeave={() => setIsRowTwoPaused(false)}
            >
              <ExpertsReviewCard
                key={`row-2-${idx}`}
                {...review}
                className="opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}