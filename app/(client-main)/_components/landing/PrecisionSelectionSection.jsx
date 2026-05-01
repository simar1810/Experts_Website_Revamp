"use client";

import Image from "next/image";
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
      className="relative z-20 scroll-mt-24 bg-wz-discover-cream py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="font-lexend text-[1.575rem] font-extrabold uppercase leading-tight tracking-[0.04em] text-wz-deep-forest sm:text-[2.5rem]">
            {c.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[0.9375rem] font-medium italic leading-relaxed text-wz-copy-muted sm:mt-5 sm:text-[1rem]">
            {c.subtitle}
          </p>
        </header>

        <div className="relative mt-14 pb-10 sm:mt-16 sm:pb-12">
          <div className="relative z-10 overflow-visible rounded-xl bg-white px-6 pb-8 pt-16 shadow-[0_10px_40px_-12px_rgba(0,77,0,0.50)] sm:px-14 sm:pb-20 sm:pt-20">
            <aside
              aria-label="Fun fact"
              className="pointer-events-none absolute left-2 -top-1 z-30 max-w-[min(12.5rem,calc(100%-2rem))] -translate-y-[55%] -rotate-[7deg] sm:left-4 sm:-top-2 sm:max-w-58 sm:-translate-y-[50%]"
            >
              <div className="flex items-start gap-2.5 rounded-2xl rounded-bl-none bg-[#67BC2A] px-3.5 py-3 pr-4 shadow-[0_12px_28px_-8px_rgba(0,77,0,0.35)] ring-1 ring-white/30 sm:gap-3 sm:rounded-[1.35rem] sm:rounded-bl-none sm:px-5 sm:py-3 border-b-4 border-[#4b8820]">
                <span
                  className="size-4 shrink-0 rounded-full  bg-white/40 sm:size-6"
                  aria-hidden
                />
                <div className="min-w-0 text-left">
                  <p className="font-lexend text-[0.8125rem] font-extrabold leading-tight text-[#005523] sm:text-[0.9375rem] italic">
                    {c.didYouKnow.title}
                  </p>
                  <p className="mt-0.5 text-[0.65rem] font-medium leading-snug text-white sm:text-[0.7rem]">
                    {c.didYouKnow.subtitle}
                  </p>
                </div>
              </div>
            </aside>

            <aside
              aria-label={`${c.campaignSuccess.label}: ${c.campaignSuccess.value} ${c.campaignSuccess.status}`}
              className="pointer-events-none absolute bottom-0 right-2 z-30 max-w-[min(17rem,calc(100%-1rem))] translate-y-[35%] sm:right-4 sm:translate-y-1/2"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-wz-deep-forest/8 bg-wz-mint/90 px-3 py-2.5 shadow-[0_10px_28px_-10px_rgba(0,77,0,0.28)] backdrop-blur-[2px] sm:gap-3 sm:rounded-2xl sm:px-3.5 sm:py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366] sm:size-11">
                  <Image
                    src="/icons/campaign.png"
                    alt=""
                    width={27}
                    height={21}
                    className="h-5 w-auto object-contain sm:h-4 sm:w-auto"
                    sizes="27px"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-600 sm:text-[10px] italic">
                    {c.campaignSuccess.label}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5 gap-y-0">
                    <span className="font-lexend text-xl font-extrabold leading-none tracking-tight text-neutral-900 sm:text-2xl italic">
                      {c.campaignSuccess.value}
                    </span>
                    <span className="text-[11px] font-semibold text-wz-top-green sm:text-xs">
                      {c.campaignSuccess.status}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

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
              containerClassName="relative z-10 flex w-full flex-col gap-3 overflow-visible bg-transparent sm:flex-row sm:flex-wrap sm:gap-4"
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
      </div>
    </section>
  );
}
