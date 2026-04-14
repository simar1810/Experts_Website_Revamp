"use client";

import { useRef, useEffect } from "react";

export function ClientResultsSection() {
  const columns = 4;

  const scrollRef = useRef(null);

  useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const scrollToCenter = () => {
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    el.scrollLeft = (scrollWidth - clientWidth) / 2;
  };

  scrollToCenter();}, []);

  return (
    <section className="relative py-14 font-montserrat sm:py-20  overflow-hidden bg-white text-neutral-900 mx-auto">

      {/* WRAPPER */}
      <div className="relative px-6 sm:px-45 mx-auto">

        {/* ===== HEADING ===== */}
        <div className="relative z-30">
          <h2 className="text-3xl sm:text-[72px] font-extrabold uppercase leading-none">
            CLIENT
            <br />
            <span className="text-[#67BC2A]">TRANSFORMATIONS.</span>
          </h2>
        </div>

        {/* ===== BACKGROUND LAYER (TRUE CURATED STYLE) ===== */}
        <div className="absolute left-0 right-0 top-full mt-10 z-0 pointer-events-none overflow-hidden">

          <div className="flex justify-center gap-6">

            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`
                  flex flex-col gap-6
                  ${colIndex % 2 === 0 ? "animate-marquee-up" : "animate-marquee-down"}
                `}
              >
                {/* items */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-64 h-80 rounded-[32px] border border-neutral-300 bg-neutral-200/70 shrink-0"
                  />
                ))}

                {[...Array(10)].map((_, i) => (
                  <div
                    key={`dup-${i}`}
                    className="w-64 h-80 rounded-[32px] border border-neutral-300 bg-neutral-200/70 shrink-0"
                  />
                ))}
              </div>
            ))}

          </div>

          {/* 🔥 TOP MASK ONLY (THIS IS WHAT FIXES OVERLAP VISUALLY) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />

        </div>
      </div>

      {/* ===== FOREGROUND ===== */}
      <div ref={scrollRef} className="relative z-20 mt-20 overflow-x-auto overflow-y-hidden scrollbar-hide">
  <div className="flex gap-6 px-6 w-max sm:w-full sm:justify-center">
    
    <div className="-translate-y-6 shrink-0 pt-6">
      <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10 overflow-hidden">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.e6i2cbM9YUdZWO72Iu4wbQHaHa?pid=Api&P=0&h=180"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="translate-y-6 shrink-0">
      <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10 overflow-hidden">
        <img
          src="https://sophia-jung.com/wp-content/uploads/2022/01/Client-Transformation-1.jpg"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="-translate-y-6 shrink-0 pt-6">
      <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10 overflow-hidden">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.pIMf4i3W24nyHDdYKf7DRwHaGr?pid=Api&P=0&h=180"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

  </div>
</div>
    </section>
  );
}