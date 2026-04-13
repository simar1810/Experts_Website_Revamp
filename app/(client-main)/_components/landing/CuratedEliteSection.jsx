"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { curatedContent } from "@/lib/data/landingContent";
import {
  interleaveCoachColumns,
  partitionCoachPropsIntoColumns,
} from "@/lib/curatedShowcaseFromListing";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "./SectionHeading";
import { CoachShowcaseCard } from "./CoachShowcaseCard";

const COLUMN_COUNT = 3;

/** Scroll directions: outer cols up, middle down. */
const COLUMN_SCROLL = [
  { reverse: false },
  { reverse: true },
  { reverse: false },
];

/**
 * @param {{ coachColumns?: Array<Array<Record<string, unknown>>> | null }} props
 * Each inner array is one marquee column (no duplicate expert within a column).
 * When null/empty, falls back to static coaches from `curatedContent`.
 */
export function CuratedEliteSection({
  coachColumns: coachColumnsFromApi = null,
}) {
  const c = curatedContent;

  const columns = useMemo(() => {
    const hasApi =
      Array.isArray(coachColumnsFromApi) &&
      coachColumnsFromApi.length === COLUMN_COUNT &&
      coachColumnsFromApi.some((col) => col.length > 0);
    if (hasApi) return coachColumnsFromApi;
    return partitionCoachPropsIntoColumns(c.coaches, COLUMN_COUNT);
  }, [coachColumnsFromApi, c.coaches]);

  const mobileCoaches = useMemo(
    () => interleaveCoachColumns(columns),
    [columns],
  );

  const [index, setIndex] = useState(0);
  const n = mobileCoaches.length;

  const go = (dir) => {
    if (n === 0) return;
    setIndex((i) => (i + dir + n) % n);
  };

  const maxColLen = Math.max(1, ...columns.map((col) => col.length));
  const marqueeDurationSec = Math.min(120, 22 + maxColLen * 14);

  return (
    <section
      id="curated"
      className="scroll-mt-24 bg-wz-top-cream py-14 font-montserrat sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-left">
            <SectionHeading
              title={c.titleBefore}
              titleHighlight={c.titleHighlight}
              subtitle={c.description}
              align="left"
              className="max-w-none space-y-4"
              headingClassName="!text-neutral-900"
              highlightClassName="!text-wz-top-green"
              subtitleClassName="!text-wz-top-subtitle max-w-xl font-medium"
            />
          </div>
        </div>

        <div className="mt-10 md:hidden">
          <div className="mx-auto w-full max-w-[min(100%,420px)] px-1">
            {/* {n > 0 ? <CoachShowcaseCard {...mobileCoaches[index]} /> : null} */}
            {mobileCoaches.slice(index, index + 3).map((coach,i) => (
            <div key={coach.id} className={i !== 0 ? "mt-4" : ""}><CoachShowcaseCard key={coach.id} {...coach} /></div>
            ))}
          </div>
        </div>

        <div className="mt-10 hidden h-[min(34rem,calc(100vh-12rem))] gap-3 overflow-hidden md:flex md:gap-6 lg:h-[min(50rem,calc(100vh-10rem))]">
          {columns.map((columnCoaches, colIndex) => {
            if (columnCoaches.length === 0) return null;
            const { reverse } = COLUMN_SCROLL[colIndex] ?? { reverse: false };
            return (
              <div
                key={`marquee-col-${colIndex}`}
                className="relative isolate min-h-0 min-w-0 flex-1 overflow-hidden"
              >
                <Marquee
                  vertical
                  reverse={reverse}
                  pauseOnHover
                  className="relative z-0 h-full p-0 [--gap:1.5rem]"
                  style={{
                    ["--duration"]: `${marqueeDurationSec}s`,
                  }}
                >
                  {columnCoaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="flex w-full min-w-0 shrink-0"
                    >
                      <CoachShowcaseCard {...coach} />
                    </div>
                  ))}
                </Marquee>
                {/* Solid gradients (not mask-image): masks often drop out when children use transform (marquee). */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[min(28%,8rem)] bg-gradient-to-b from-wz-top-cream from-30% to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[min(28%,8rem)] bg-gradient-to-t from-wz-top-cream from-30% to-transparent"
                  aria-hidden
                />
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={c.seeMoreHref}
            className="rounded-xl bg-wz-see-more-bg px-10 py-3 text-[0.9375rem] font-semibold text-wz-see-more-text transition-colors hover:bg-wz-see-more-bg/85"
          >
            See More
          </Link>
        </div>
      </div>
    </section>
  );
}
