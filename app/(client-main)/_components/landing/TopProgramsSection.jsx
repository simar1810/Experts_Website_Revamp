"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { topProgramsContent } from "@/lib/data/landingContent";
import { cn } from "@/lib/utils";
import { TopProgramCard } from "./TopProgramCard";

/** Horizontal “TOP PROGRAMS” strip (forest panel) — separate from THE TOP EXPERTS. */
export function TopProgramsSection({ programs: programsFromApi = null }) {
  const c = topProgramsContent;
  const programs =
    Array.isArray(programsFromApi) && programsFromApi.length > 0
      ? programsFromApi
      : c.programs;

  const [marqueePaused, setMarqueePaused] = useState(false);
  const marqueeHoverDepth = useRef(0);

  const onMarqueeCardEnter = useCallback(() => {
    marqueeHoverDepth.current += 1;
    setMarqueePaused(true);
  }, []);

  const onMarqueeCardLeave = useCallback(() => {
    marqueeHoverDepth.current -= 1;
    if (marqueeHoverDepth.current <= 0) {
      marqueeHoverDepth.current = 0;
      setMarqueePaused(false);
    }
  }, []);

  const getProgramHref = (program) => {
    const params = new URLSearchParams();
    if (program?.programId || program?.id) {
      params.set("programId", String(program.programId || program.id));
    }
    if (program?.name) params.set("search", program.name);
    return `/discover-programs?${params.toString()}#top-selling-programs`;
  };

  const marqueePrograms = [...programs, ...programs];

  return (
    <section
      id="top-programs"
      className="scroll-mt-24 bg-[#03632C] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-[3.6rem] font-extrabold uppercase leading-none tracking-[0.02em] space-x-3">
          <span className="text-white">{c.titleLight}</span>
          <span className="text-[#9AF45D]">{c.titleHighlight}</span>
        </h2>

        <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:hidden">
          {programs.map((p) => (
            <TopProgramCard
              key={p.id}
              {...p}
              emphasizeHover
              enrollLabel="VIEW PROGRAM"
              enrollHref={getProgramHref(p)}
            />
          ))}
        </div>

        <div className="relative mt-10 hidden sm:mt-12 sm:block sm:overflow-hidden sm:pb-2 sm:-mx-2 sm:px-2">
          <div
            className={cn(
              "flex w-max gap-6 animate-top-programs-marquee motion-reduce:animate-none",
            )}
            style={{
              animationPlayState: marqueePaused ? "paused" : "running",
            }}
          >
            {marqueePrograms.map((p, i) => (
              <TopProgramCard
                key={`${p.id}-marquee-${i}`}
                {...p}
                emphasizeHover
                enrollLabel="VIEW PROGRAM"
                enrollHref={getProgramHref(p)}
                onMarqueeHoverEnter={onMarqueeCardEnter}
                onMarqueeHoverLeave={onMarqueeCardLeave}
              />
            ))}
          </div>
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
