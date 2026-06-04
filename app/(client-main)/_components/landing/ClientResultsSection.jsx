"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { clientResultsContent } from "@/lib/data/landingContent";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const MARQUEE_ROWS = 10;
const MARQUEE_COLUMNS = 4;
const AUTO_SCROLL_MS = 4500;

function FeaturedResultImage({ item, className, priority, loading, fetchPriority }) {
  const width = item.width ?? 1080;
  const height = item.height ?? 1080;

  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      fetchPriority={fetchPriority}
      sizes="(max-width: 1024px) 320px, 320px"
      className={cn("block size-auto max-w-full", className)}
      style={{ width: "100%", height: "auto" }}
    />
  );
}

/**
 * Native img for marquee tiles — avoids rare Next/Image + blur/layout blanks on
 * animated columns; keeps photos visible with a very light soften only.
 */
function MarqueeCard({ src, alt }) {
  return (
    <div className="relative z-0 h-56 w-44 shrink-0 overflow-hidden rounded-[24px] border border-stone-300/60 bg-stone-300 shadow-sm sm:h-72 sm:w-56 sm:rounded-[28px] md:h-80 md:w-64 md:rounded-[32px]">
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

function ClientResultsMobileCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const slideRefs = useRef([]);
  const pauseRef = useRef(false);
  const count = items.length;

  const goTo = useCallback(
    (index) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
      slideRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        slideRefs.current[next]?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
        return next;
      });
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(id);
  }, [count]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || count === 0) return;

    const onScroll = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const slideCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(slideCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      setActiveIndex(closest);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      className="md:hidden"
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
      onTouchStart={() => {
        pauseRef.current = true;
      }}
      onTouchEnd={() => {
        pauseRef.current = false;
      }}
    >
      <div
        ref={scrollRef}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto scroll-px-4 pb-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((item, i) => (
          <div
            key={item.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="flex min-w-full shrink-0 snap-center justify-center px-2"
          >
            <img
              src={item.src}
              alt={item.alt}
              decoding="async"
              draggable={false}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
              className="block h-auto max-h-none max-w-[min(85vw,20rem)] w-auto rounded-3xl border border-black/10"
            />
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Transformation slides"
      >
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Slide ${i + 1} of ${count}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-7 bg-[#67BC2A]"
                : "w-1.5 bg-neutral-300/90 hover:bg-neutral-400",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ClientResultsSection() {
  const c = clientResultsContent;
  const pool = c.marqueePool;
  const marqueeDurationSec = Math.max(6, c.marqueeDurationSec ?? 10);

  const sectionPad = "px-4 sm:px-6 lg:px-10";

  return (
    <section className="relative overflow-x-clip overflow-y-clip bg-wz-discover-cream py-14 text-neutral-900 sm:py-20">
      <div className={`mx-auto max-w-7xl ${sectionPad}`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-left">
            <SectionHeading
              title={c.titleLight}
              titleHighlight={c.titleHighlight}
              subtitle={c.subtitle}
              align="left"
              className="max-w-none space-y-4"
              headingClassName="!text-neutral-900 !normal-case !text-[1.65rem] sm:!text-[2.25rem] md:!text-[2.75rem]"
              highlightClassName="!text-wz-top-green"
              subtitleClassName="!text-wz-top-subtitle max-w-xl font-medium"
            />
          </div>
        </div>
      </div>

      <ClientResultsMobileCarousel items={c.featured} />

      <div className="relative isolate mt-10 hidden min-h-[28rem] w-full min-w-0 max-w-full sm:mt-12 md:block md:min-h-[36rem]">
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-hidden"
          aria-hidden
        >
          <div
            className="flex h-full justify-center gap-5 lg:gap-6"
            style={{
              "--marquee-y-duration": `${marqueeDurationSec}s`,
            }}
          >
            {Array.from({ length: MARQUEE_COLUMNS }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  "flex flex-col gap-5 lg:gap-6",
                  colIndex % 2 === 0
                    ? "animate-marquee-up motion-reduce:animate-none"
                    : "animate-marquee-down motion-reduce:animate-none",
                )}
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

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-wz-discover-cream via-wz-discover-cream/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-wz-discover-cream via-wz-discover-cream/80 to-transparent" />

        <div
          className={`absolute inset-x-0 top-0 bottom-0 z-20 flex items-center ${sectionPad}`}
        >
          <div className="flex w-full justify-center gap-4 overflow-visible">
            {c.featured.map((item, i) => (
              <div
                key={item.src}
                className={cn(
                  "shrink-0",
                  i === 1
                    ? "translate-y-8"
                    : "-translate-y-6",
                )}
              >
                <div className="w-72 leading-[0] lg:w-80">
                  <FeaturedResultImage
                    item={item}
                    className="rounded-3xl border border-black/10 shadow-xl"
                    priority={i === 1}
                    loading={i === 1 ? undefined : "lazy"}
                    fetchPriority={i === 1 ? "high" : "low"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative mx-auto mt-8 max-w-7xl sm:mt-14 md:mt-12 ${sectionPad}`}
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
