"use client";

import { Filter } from "lucide-react";
import { LocationSearchField } from "@/components/SearchFilters";

function formatResultCount(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return "0";
  return num.toLocaleString("en-IN");
}

export default function MobileListingToolbar({
  resultsCount = 0,
  locationQuery,
  setLocationQuery,
  setLocationFilter,
  setClientLocation,
  onSearch,
  onOpenFilters,
}) {
  return (
    <div className="lg:hidden w-full bg-[#F1F8E9] px-4 py-3 border-b border-[#E8F5E0]">
      <div className="flex items-stretch gap-2">
        <div className="flex flex-col items-start justify-center gap-0 mr-10">
          <p className="text-gray-400 text-[12px] leading-2">Total Results</p>
          <p className="text-[15px] font-bold text-gray-900">
            {formatResultCount(resultsCount)} Results
          </p>
        </div>
        <LocationSearchField
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          setLocationFilter={setLocationFilter}
          setClientLocation={setClientLocation}
          onSearch={onSearch}
          theme="light"
          placeholderLocation="Location"
          locationIconColor="text-gray-400"
          className="min-w-0 flex-1 rounded-xl border border-gray-200/80 bg-white px-3 py-2.5 shadow-sm"
        />
        <button
          type="button"
          onClick={onOpenFilters}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B5E20] text-white px-4 py-2.5 text-sm font-bold shadow-sm active:scale-[0.98] transition-transform"
        >
          <Filter className="w-4 h-4" aria-hidden />
          Filter
        </button>
      </div>
    </div>
  );
}
