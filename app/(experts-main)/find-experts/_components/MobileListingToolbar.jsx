"use client";

import { Filter } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";

function formatResultCount(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return "0";
  return num.toLocaleString("en-IN");
}

export default function MobileListingToolbar({
  resultsCount = 0,
  selectedSpecialities,
  setSelectedSpecialities,
  locationQuery,
  setLocationQuery,
  setLocationFilter,
  clientLocation,
  setClientLocation,
  specialityOptions,
  nameQuery,
  setNameQuery,
  onSearch,
  onOpenFilters,
}) {
  return (
    <>
      {/*
        z-20: match desktop hero / listing stacking so dropdowns sit above the expert list
      */}
      <div className="lg:hidden relative z-20 w-full bg-[#F1F8E9] px-4 pt-4 pb-5 border-b border-[#E8F5E0]">
        <SearchFilters
          selectedSpecialities={selectedSpecialities}
          setSelectedSpecialities={setSelectedSpecialities}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          setLocationFilter={setLocationFilter}
          setClientLocation={setClientLocation}
          clientLocation={clientLocation}
          nameQuery={nameQuery}
          setNameQuery={setNameQuery}
          onSearch={onSearch}
          specialityOptions={specialityOptions}
          theme="light"
          containerClassName="!flex !flex-col !items-stretch gap-3 w-full !bg-transparent p-0 !overflow-visible"
          inputWrapperClassName="rounded-full border border-gray-200/90 bg-white px-4 py-2.5 min-h-12 w-full !border-solid shadow-sm"
          buttonClassName="self-center px-10 sm:px-14 bg-[#70C136] hover:bg-[#5fa82f] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm"
          buttonText="Search Experts"
          specialityIconColor="text-gray-400"
          locationIconColor="text-gray-400"
          placeholderSpeciality="Speciality"
          placeholderLocation="Location"
        />
      </div>
      <div className="lg:hidden w-full bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-400 text-xs leading-tight">Total Results</p>
            <p className="text-[15px] font-bold text-gray-900 tabular-nums">
              {formatResultCount(resultsCount)} Results
            </p>
          </div>
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
    </>
  );
}
