"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import SearchFilters from "@/components/SearchFilters";
import { useValues } from "@/context/valuesContext";
import { availableSpecialities } from "@/lib/data/specialities";
import { precisionContent } from "@/lib/data/landingContent";

export function PrecisionSelectionSection() {
  const router = useRouter();
  const { values } = useValues();
  const c = precisionContent;

  const specialityOptions = useMemo(() => {
    const v = values?.expertise_categories;
    if (Array.isArray(v) && v.length > 0) {
      const merged = [...new Set(v.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
      if (merged.length > 0) return merged;
    }
    return availableSpecialities;
  }, [values?.expertise_categories]);

  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [, setLocationFilter] = useState({ mode: "none" });
  const [searchClientLocation, setSearchClientLocation] = useState(null);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedSpecialities.length > 0) {
      params.set("speciality", selectedSpecialities.join(","));
    }
    const loc = (locationQuery || "").trim();
    if (loc) params.set("location", loc);
    const q = params.toString();
    router.push(q ? `/find-experts?${q}` : "/find-experts");
  }, [router, selectedSpecialities, locationQuery]);

  return (
    <section
      id={c.id}
      className="relative z-20 scroll-mt-24 bg-wz-discover-cream py-14 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="font-lexend text-[1.575rem] font-extrabold uppercase leading-tight tracking-[0.04em] text-wz-deep-forest sm:text-[2.5rem]">
            {c.title}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[0.9375rem] font-medium italic leading-relaxed text-wz-copy-muted sm:text-[1rem]">
            {c.subtitle}
          </p>
        </header>

        <div className="mt-10 overflow-visible rounded-xl bg-white p-6 shadow-[0_10px_40px_-12px_rgba(0,77,0,0.50)] sm:mt-12 sm:p-8">
          <div className="mb-3 hidden sm:grid sm:grid-cols-2 sm:gap-x-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-wz-top-green">
              {c.field1Label}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-wz-top-green">
              {c.field2Label}
            </span>
          </div>

          <SearchFilters
            selectedSpecialities={selectedSpecialities}
            setSelectedSpecialities={setSelectedSpecialities}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            setLocationFilter={setLocationFilter}
            clientLocation={searchClientLocation}
            setClientLocation={setSearchClientLocation}
            specialityOptions={specialityOptions}
            onSearch={handleSearch}
            theme="light"
            specialityFieldLabel={c.field1Label}
            locationFieldLabel={c.field2Label}
            containerClassName="relative z-10 flex flex-col gap-3 bg-transparent sm:flex-row sm:flex-wrap sm:gap-4 w-full overflow-visible"
            inputWrapperClassName="min-h-[3rem] rounded-xl border-0 border-b-0 bg-[#A7A7A71A] py-2.5 sm:flex-1 sm:min-w-0"
            buttonClassName="basis-full w-full rounded-xl bg-gradient-to-r from-wz-lime to-wz-forest py-[1.05rem] text-[0.8125rem] font-extrabold uppercase tracking-[0.12em] text-white shadow-md hover:opacity-95 sm:text-sm sm:tracking-[0.22em]"
            buttonText={c.submitLabel}
            placeholderSpeciality={c.specialityPlaceholder}
            placeholderLocation={c.locationPlaceholder}
            specialityIconColor="text-wz-deep-forest/45"
            locationIconColor="text-wz-deep-forest/45"
          />
        </div>
      </div>
    </section>
  );
}
