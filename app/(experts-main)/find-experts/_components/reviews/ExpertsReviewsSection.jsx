"use client";

import ExpertsReviewCard from "./ExpertsReviewCard";
import { testimonials } from "@/lib/data/landingContent"

export default function ExpertsReviewsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#6eb832] via-[#5a9e28] to-[#2d5016] mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-400/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center text-white relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">
          Trusted by People Starting  <span className="text-lime-200">Real Journeys</span>
        </h2>
        <p className="text-lime-50/80 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          From finding the right coach to starting the right program, here’s what users are saying about ZeeFit.
        </p>
      </div>

      <div className="flex gap-6 px-6 mb-8 overflow-x-auto scrollbar-hide pb-4 snap-x">
        {[...testimonials, ...testimonials].map((review, idx) => (
          <ExpertsReviewCard 
            key={idx} 
            {...review} 
            className="snap-center"
          />
        ))}
      </div>

      <div className="animate-marqueex flex gap-6 px-6 overflow-x-auto scrollbar-hide pb-4 snap-x ml-12">
        {[...testimonials, ...testimonials].reverse().map((review, idx) => (
          <ExpertsReviewCard 
            key={idx} 
            {...review} 
            className="opacity-60 hover:opacity-100 snap-center"
          />
        ))}
      </div>
    </section>
  );
}