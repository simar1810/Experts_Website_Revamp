"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { availableSpecialities } from "@/lib/data/specialities";
import { availableCities } from "@/lib/data/locations";
import { precisionContent } from "@/lib/data/landingContent";
import { LandingButton } from "./LandingButton";

export function PrecisionSelectionSection() {
  const router = useRouter();
  const c = precisionContent;
  const [speciality, setSpeciality] = useState("");
  const [location, setLocation] = useState("");

  const specOptions = useMemo(() => ["", ...availableSpecialities], []);
  const cityOptions = useMemo(() => ["", ...availableCities], []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (speciality.trim()) params.set("speciality", speciality.trim());
    if (location.trim()) params.set("location", location.trim());
    const q = params.toString();
    router.push(q ? `/experts?${q}` : "/experts");
  };

  const selectCls =
    "w-full appearance-none rounded-xl border-0 bg-wz-input-grey py-3.5 pl-4 pr-10 text-[0.9375rem] font-medium text-wz-deep-forest focus:ring-2 focus:ring-wz-lime focus:outline-none";

  return (
    <section
      id={c.id}
      className="scroll-mt-24 bg-wz-discover-cream py-14 font-montserrat sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="font-lexend text-[1.375rem] font-extrabold uppercase leading-tight tracking-[0.04em] text-wz-deep-forest sm:text-[2.5rem]">
            {c.title}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[0.9375rem] font-medium italic leading-relaxed text-wz-copy-muted sm:text-[1rem]">
            {c.subtitle}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl bg-white p-6 shadow-[0_10px_40px_-12px_rgba(0,77,0,0.50)] sm:p-8 sm:mt-12"
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            <label className="block space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-wz-copy-muted">
                {c.field1Label}
              </span>
              <div className="relative">
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className={selectCls}
                >
                  <option value="">{c.specialityPlaceholder}</option>
                  {specOptions.slice(1).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-[1.125rem] -translate-y-1/2 text-wz-deep-forest/50"
                  aria-hidden
                  strokeWidth={2.25}
                />
              </div>
            </label>

            <label className="block space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-wz-copy-muted">
                {c.field2Label}
              </span>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={selectCls}
                >
                  <option value="">{c.locationPlaceholder}</option>
                  {cityOptions.slice(1).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-[1.125rem] -translate-y-1/2 text-wz-deep-forest/50"
                  aria-hidden
                  strokeWidth={2.25}
                />
              </div>
            </label>
          </div>

          <div className="mt-10">
            <LandingButton
              type="submit"
              variant="gradient"
              size="full"
              className="rounded-xl py-[1.05rem] text-[0.8125rem] font-extrabold tracking-[0.22em] sm:text-sm from-[#67BC2A] to-[#03632C] shadow-md"
            >
              {c.submitLabel}
            </LandingButton>
          </div>
        </form>
      </div>
    </section>
  );
}
