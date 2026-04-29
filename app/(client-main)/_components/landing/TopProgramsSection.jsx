"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { topProgramsContent } from "@/lib/data/landingContent";
import { TopProgramCard } from "./TopProgramCard";

/** Horizontal “TOP PROGRAMS” strip (forest panel) — separate from THE TOP EXPERTS. */
export function TopProgramsSection({ programs: programsFromApi = null }) {
  const c = topProgramsContent;
  const programs =
    Array.isArray(programsFromApi) && programsFromApi.length > 0
      ? programsFromApi
      : c.programs;
  const stripRef = useRef(null);

  const scrollStrip = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.querySelector("[data-program-card]");
    const gap = 24;
    const step = (card?.offsetWidth ?? 552) + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const getProgramHref = (program) => {
    const params = new URLSearchParams();
    if (program?.programId || program?.id) {
      params.set("programId", String(program.programId || program.id));
    }
    if (program?.name) params.set("search", program.name);
    return `/discover-programs?${params.toString()}#top-selling-programs`;
  };

  return (
    <section
      id="top-programs"
      className="scroll-mt-24 bg-[#03632C] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-4 sm:items-end">
          <h2 className="text-2xl sm:text-3xl lg:text-[3.6rem] font-extrabold uppercase leading-none tracking-[0.02em] space-x-3">
            <span className="text-white">{c.titleLight}</span>
            <span className="text-[#9AF45D]">{c.titleHighlight}</span>
          </h2>
          <div className="hidden sm:flex shrink-0 justify-end gap-2 sm:pb-0.5">
            <button
              type="button"
              aria-label="Previous programs"
              onClick={() => scrollStrip(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-transparent text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next programs"
              onClick={() => scrollStrip(1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-transparent text-white transition-colors hover:bg-white/10"
            >
              <ArrowRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          ref={stripRef}
          // className="scrollbar-hide mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pl-0.5 sm:mt-12 sm:-mx-2 sm:px-2"
          className=" scrollbar-hide mt-10 flex flex-col gap-6 sm:flex-row sm:snap-x sm:snap-mandatory sm:overflow-x-auto sm:pb-2 sm:pl-0.5 sm:mt-12 sm:-mx-2 sm:px-2"
        >
          {programs.map((p) => (
            <TopProgramCard
              key={p.id}
              {...p}
              enrollLabel="VIEW PROGRAM"
              enrollHref={getProgramHref(p)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={c.seeMoreHref}
            className="rounded-xl bg-white/10 px-10 py-4 text-[0.9375rem] font-semibold text-[#7ED957] transition-colors hover:bg-wz-program-card/90"
          >
            {c.seeMoreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
