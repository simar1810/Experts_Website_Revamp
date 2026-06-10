import Link from "next/link";
import { topProgramsContent } from "@/lib/data/landingContent";
import { cn } from "@/lib/utils";
import { TopProgramCard } from "./TopProgramCard";

/** Horizontal “Top Performing Programs” strip (forest panel). */
export function TopProgramsSection({ programs: programsFromApi = null }) {
  const c = topProgramsContent;
  const programs =
    Array.isArray(programsFromApi) && programsFromApi.length > 0
      ? programsFromApi
      : c.programs;

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
        <h2 className="space-x-3 text-2xl font-extrabold uppercase leading-none tracking-[0.02em] sm:text-3xl lg:text-[3.6rem]">
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

        <div className="relative mt-10 hidden overflow-hidden pb-2 sm:mt-12 sm:block sm:-mx-2 sm:overflow-x-hidden sm:overflow-y-visible sm:px-2 sm:py-4 sm:-my-4">
          <div
            className={cn(
              "flex w-max gap-4 py-2 animate-top-programs-marquee motion-reduce:animate-none sm:gap-6",
              "[&:has(article:hover)]:paused",
              "[&:has(article:focus-within)]:paused",
            )}
          >
            {marqueePrograms.map((p, i) => (
              <TopProgramCard
                key={`${p.id}-marquee-${i}`}
                {...p}
                emphasizeHover
                enrollLabel="VIEW PROGRAM"
                enrollHref={getProgramHref(p)}
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
