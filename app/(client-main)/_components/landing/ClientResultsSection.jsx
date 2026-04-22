import Image from "next/image";
import { clientResultsContent } from "@/lib/data/landingContent";
import { SectionHeading } from "./SectionHeading";

const MARQUEE_ROWS = 10;
const MARQUEE_COLUMNS = 4;

/**
 * Native img for marquee tiles — avoids rare Next/Image + blur/layout blanks on
 * animated columns; keeps photos visible with a very light soften only.
 */
function MarqueeCard({ src, alt }) {
  return (
    <div className="relative z-0 h-72 w-56 shrink-0 overflow-hidden rounded-[28px] border border-stone-300/60 bg-stone-300 shadow-sm sm:h-80 sm:w-64 sm:rounded-[32px]">
      <img
        src={src}
        alt={alt}
        width={512}
        height={640}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full max-h-full max-w-full object-contain object-center blur-sm contrast-[0.97]"
      />
    </div>
  );
}

export function ClientResultsSection() {
  const c = clientResultsContent;
  const pool = c.marqueePool;
  const marqueeDurationSec = Math.max(6, c.marqueeDurationSec ?? 10);

  const sectionPad = "px-6 sm:px-8 lg:px-10";

  return (
    <section className="relative overflow-x-clip overflow-y-clip bg-wz-discover-cream py-14 text-neutral-900 sm:py-20">
      <div className={`mx-auto max-w-7xl ${sectionPad}`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-left">
            <SectionHeading
              title={c.titleLight}
              titleHighlight={c.titleHighlight}
              align="left"
              className="max-w-none space-y-4"
              headingClassName="!text-neutral-900"
              highlightClassName="!text-wz-top-green"
              subtitleClassName="!text-wz-top-subtitle max-w-xl font-medium"
            />
          </div>
        </div>
      </div>

      <div className="relative isolate mt-10 min-h-[min(90vw,28rem)] w-full min-w-0 max-w-full sm:mt-12 sm:min-h-[36rem]">
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-hidden"
          aria-hidden
        >
          <div
            className="flex h-full justify-center gap-3 sm:gap-5 lg:gap-6"
            style={{
              "--marquee-y-duration": `${marqueeDurationSec}s`,
            }}
          >
            {Array.from({ length: MARQUEE_COLUMNS }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`flex flex-col gap-3 sm:gap-5 lg:gap-6 ${
                  colIndex % 2 === 0
                    ? "animate-marquee-up"
                    : "animate-marquee-down"
                }`}
              >
                {Array.from({ length: MARQUEE_ROWS }).map((__, i) => {
                  const src = pool[(colIndex * MARQUEE_ROWS + i) % pool.length];
                  return (
                    <MarqueeCard key={`a-${colIndex}-${i}`} src={src} alt="" />
                  );
                })}
                {Array.from({ length: MARQUEE_ROWS }).map((__, i) => {
                  const src =
                    pool[
                      (colIndex * MARQUEE_ROWS + i + MARQUEE_ROWS) % pool.length
                    ];
                  return (
                    <MarqueeCard key={`b-${colIndex}-${i}`} src={src} alt="" />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-wz-discover-cream via-wz-discover-cream/85 to-transparent sm:h-32" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-wz-discover-cream via-wz-discover-cream/80 to-transparent sm:h-28" />

        <div
          className={`absolute inset-x-0 top-0 bottom-0 z-20 flex items-center justify-center ${sectionPad}`}
        >
          <div className="flex justify-center gap-3 sm:gap-6">
            {c.featured.map((item, i) => (
              <div
                key={item.src}
                className={
                  i === 1
                    ? "translate-y-6 sm:translate-y-8"
                    : "-translate-y-4 sm:-translate-y-6"
                }
              >
                <div className="relative h-[min(61vw,24.5rem)] w-[min(45vw,19.5rem)] overflow-hidden rounded-3xl border border-black/10 bg-stone-200 shadow-xl sm:h-96 sm:w-72 lg:h-100 lg:w-80">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 288px, 320px"
                    className="rounded-3xl object-contain object-center"
                    priority={i === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative mx-auto mt-12 max-w-7xl sm:mt-14 ${sectionPad}`}
      >
        <p className="mx-auto max-w-3xl text-center text-[0.625rem] font-bold uppercase leading-snug tracking-[0.18em] text-[#357200] sm:text-[0.6875rem]">
          <span className="inline-block rounded-full bg-[#3572001A] px-4 py-2.5 text-[#03632C] ring-1 ring-[#9AF45D]/45 sm:px-6">
            {c.badge}
          </span>
        </p>
      </div>
    </section>
  );
}
