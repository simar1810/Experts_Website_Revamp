"use client";

import Link from "next/link";
import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Background Image Overlay - Simulated */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content Container */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
            The Best online <span className="text-lime-500">Marketplace</span>{" "}
            for <br className="hidden md:block" />
            Wellness Experts
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto md:mx-0">
            For Individuals seeking to improve their fitness level and creators
            of lifestyle & wellness seeking to grow their business with us. Get
            started today!
          </p>

          <div className="max-w-xl mx-auto md:mx-0">
            <Link
              href="/experts/pricing"
              className="inline-flex w-full items-center justify-center rounded-lg bg-lime-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-lime-600 sm:w-auto"
            >
              Register now
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Image & Overlay Card */}
        <div className="relative h-full min-h-[300px] md:min-h-[400px] flex justify-center items-center mt-6 md:mt-0">
          {/* Placeholder for Hero Image */}
          <div className="bg-gray-800 rounded-2xl md:rounded-3xl w-full h-[300px] md:h-[500px] object-cover relative overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
              alt="Hero"
              className="w-full h-full object-cover opacity-70"
            />
          </div>

          {/* Success Story Card Overlay */}
          <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[-40px] bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-5 rounded-xl md:rounded-3xl w-[92%] sm:w-auto max-w-[260px] md:max-w-sm shadow-2xl z-20">
            <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-lg md:rounded-2xl overflow-hidden shrink-0 border border-white/20">
                <img
                  src="/images/man-123abc.png"
                  alt="Simarpreet Singh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-white text-[12px] md:text-base leading-tight">
                  Dhruv Rathi
                </h4>
                <span className="text-gray-400 text-[9px] md:text-xs"></span>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 md:w-4 md:h-4 text-lime-400 fill-current"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <h5 className="font-bold text-white text-[11px] md:text-lg leading-tight">
                Affordable options too!!
              </h5>
              <p className="text-[9px] md:text-xs text-gray-300 leading-relaxed opacity-80">
                I was struggling to find a fitness coach of my budget and got
                one here who really is good and affordable
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
