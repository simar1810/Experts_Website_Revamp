"use client";

import ExpertsReviewCard from "./ExpertsReviewCard";

export default function ExpertsReviewsSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#6eb832] via-[#5a9e28] to-[#2d5016] mt-20">
      <div className="max-w-7xl mx-auto px-6 mb-10 sm:mb-14 text-center text-white relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 tracking-tight">
          Our Reviews Speaks for Itself
        </h2>
        <p className="text-lime-50/95 text-[10px] sm:text-sm max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 px-6 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-4 md:pb-0">
        <ExpertsReviewCard />
        <ExpertsReviewCard />
        <ExpertsReviewCard />
        <ExpertsReviewCard />
        <ExpertsReviewCard />
      </div>
      <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 px-6 overflow-x-auto scrollbar-hide pb-4 md:pb-0">
        <ExpertsReviewCard className="opacity-40" />
        <ExpertsReviewCard />
        <ExpertsReviewCard />
        <ExpertsReviewCard />
        <ExpertsReviewCard className="opacity-40" />
      </div>
    </section>
  );
}
