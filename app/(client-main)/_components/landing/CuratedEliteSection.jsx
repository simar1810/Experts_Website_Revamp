"use client";
import { useMemo } from "react";
import { FEATURED_EXPERTS_STATIC } from "@/lib/data/featuredExpertsStatic";
import { featuredStaticExpertToCoachShowcase } from "@/lib/featuredExpertToShowcase";
import { curatedContent } from "@/lib/data/landingContent";
import { SectionHeading } from "./SectionHeading";
import { CoachShowcaseCard } from "./CoachShowcaseCard";

/** Same experts as `/experts` static list; original section layout/typography unchanged. */
export function CuratedEliteSection() {
  const c = curatedContent;

  const coachesToShow = useMemo(
    () =>
      FEATURED_EXPERTS_STATIC.map((e, i) =>
        featuredStaticExpertToCoachShowcase(e, i),
      ),
    [],
  );

  return (
    <section id="curated" className="relative scroll-mt-24 bg-wz-top-cream py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-wz-top-green/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <SectionHeading
            title={c.titleBefore}
            titleHighlight={c.titleHighlight}
            subtitle={c.description}
            align="center"
            className="max-w-3xl"
            headingClassName="text-4xl md:text-5xl font-black tracking-tight text-neutral-900"
            highlightClassName="text-wz-top-green"
            subtitleClassName="mt-6 text-lg text-neutral-600 font-medium leading-relaxed"
          />
        </div>

        <div className="mt-10 space-y-6 md:hidden">
          {coachesToShow.slice(0, 3).map((coach) => (
            <div key={coach.id} className="mx-auto max-w-[340px] transform transition-transform active:scale-95">
              <CoachShowcaseCard {...coach} />
            </div>
          ))}
        </div>

        <div className="hidden md:block mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coachesToShow.map((coach) => (
              <div
                key={coach.id}
                className="group/item transition-all duration-300 hover:-translate-y-2"
              >
                <CoachShowcaseCard {...coach} />
              </div>
            ))}
          </div>

          {coachesToShow.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-neutral-500">
                No experts found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}