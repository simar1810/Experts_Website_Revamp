"use client";

import SearchFilters from "@/components/SearchFilters";

/**
 * Hero search: single rounded bar (speciality | location | CTA) wrapping shared SearchFilters.
 */
export default function HeroSearchBar(props) {
  return (
    <div className="relative z-50 max-w-6xl mx-auto mt-4 md:mt-6 w-full min-w-0 isolate">
      {/*
        Do not wrap in overflow-x-auto: per CSS, that forces overflow-y to "auto" and clips
        absolutely positioned dropdowns (location/speciality), leaving a thin strip + stray scrollbar.
        Use flex-wrap on large screens so fields move to a second row when needed instead.
      */}
      <SearchFilters
        {...props}
        theme="light"
        containerClassName="bg-white rounded-2xl p-1 sm:p-1.5 shadow-2xl w-full border border-white/20 flex flex-col lg:flex-row lg:flex-wrap items-stretch gap-0 overflow-visible"
        inputWrapperClassName="border-b lg:border-b-0 lg:border-r border-gray-100/90 py-2.5 sm:py-3 px-1"
        buttonClassName="bg-[#70C136] hover:bg-[#5fa82f] text-white px-6 sm:px-10 py-3 rounded-xl sm:rounded-xl font-black text-xs sm:text-sm w-full lg:w-auto shrink-0 transition-transform active:scale-[0.99] lg:min-h-[3rem]"
        buttonText="Search Experts"
        specialityIconColor="text-gray-400"
        locationIconColor="text-gray-400"
      />
    </div>
  );
}
