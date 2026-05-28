"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

const SLOT_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

const SIDE_CARD_W = "w-12 sm:w-14 md:w-36";
const SLOT_SIZE = {
  "-3": { h: "h-[142px] sm:h-[168px] md:h-[212px]", w: SIDE_CARD_W },
  "-2": { h: "h-[197px] sm:h-[233px] md:h-[356px]", w: SIDE_CARD_W },
  "-1": { h: "h-[252px] sm:h-[298px] md:h-[542px]", w: SIDE_CARD_W },
  0: { h: "aspect-[9/16]", w: "w-[min(88vw,420px)]" },
  1: { h: "h-[252px] sm:h-[298px] md:h-[542px]", w: SIDE_CARD_W },
  2: { h: "h-[197px] sm:h-[233px] md:h-[356px]", w: SIDE_CARD_W },
  3: { h: "h-[142px] sm:h-[168px] md:h-[212px]", w: SIDE_CARD_W },
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function getTestimonialKey(testimonial, fallback) {
  return testimonial?.src || String(fallback);
}

export default function TestimonialShowcase({
  testimonials,
  videos,
  testimonialsHref = "/testimonials",
  testimonialsLabel = "View all testimonials",
}) {
  const items = testimonials ?? videos ?? [];
  const { displayName } = useBrandingContext();
  const n = items.length;
  const [active, setActive] = useState(() => {
    const l = items.length;
    return l > 0 ? Math.min(Math.floor(l / 2), l - 1) : 0;
  });
  const activeIndex = n > 0 ? mod(active, n) : 0;

  const selectTestimonial = useCallback(
    (index) => {
      if (!n) return;
      setActive(mod(index, n));
    },
    [n],
  );

  const goPrev = useCallback(() => {
    setActive((a) => mod(a - 1, n));
  }, [n]);

  const goNext = useCallback(() => {
    setActive((a) => mod(a + 1, n));
  }, [n]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (!n) {
    return null;
  }

  return (
    <section className="relative mt-24 w-full overflow-hidden bg-[#1f7a34] p-6 pb-12 pt-10 md:mt-32 md:p-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />

      <h2 className="relative z-10 text-center text-2xl font-semibold text-white sm:text-3xl md:text-5xl">
        {"Don't Just Take Our Word for It"}
      </h2>
      <p className="relative z-10 mx-auto mt-4 max-w-[50ch] text-center text-sm text-white/90 md:mt-5 md:text-lg">
        Hear from coaches who are building stronger visibility and bigger client base
        {` with ${displayName}.`}
      </p>
      <p className="relative z-10 mt-4 text-center">
        {/* <Link
          href={testimonialsHref}
          className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white md:text-base"
        >
          {testimonialsLabel}
        </Link> */}
      </p>
      <h3 className="sr-only">Coach testimonials</h3>

      <div className="relative z-10 mx-auto mt-10 max-w-[1200px] md:mt-16">
        <LayoutGroup>
          <div className="flex min-h-0 max-w-full items-center justify-center gap-0.5 overflow-hidden px-1 sm:gap-1 md:gap-2 md:overflow-visible">
            {SLOT_OFFSETS.map((offset) => {
              const itemIndex = mod(activeIndex + offset, n);
              const testimonial = items[itemIndex];
              const isCenter = offset === 0;
              const size = SLOT_SIZE[String(offset)];
              const itemKey = getTestimonialKey(testimonial, itemIndex);
              const layoutId = `testimonial-card-${itemKey}`;
              const alt =
                testimonial.alt ||
                testimonial.name ||
                `Coach testimonial ${itemIndex + 1}`;

              if (isCenter) {
                return (
                  <motion.div
                    key={itemKey}
                    layout
                    layoutId={layoutId}
                    transition={{ type: "spring", stiffness: 360, damping: 34 }}
                    className={`relative z-20 mx-0.5 shrink-0 self-center ${size.w} ${size.h}`}
                  >
                    <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-white ring-1 ring-white/25 shadow-2xl transition-[box-shadow,transform] duration-300 hover:ring-2 hover:ring-white/40 md:hover:scale-[1.01]">
                      <Image
                        src={testimonial.src}
                        alt={alt}
                        fill
                        priority
                        sizes="(max-width: 768px) 88vw, 420px"
                        className="object-contain object-center"
                      />

                      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:bottom-6">
                        <div className="pointer-events-auto flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              goPrev();
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/55"
                            aria-label="Previous testimonial"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              goNext();
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/55"
                            aria-label="Next testimonial"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.button
                  key={itemKey}
                  type="button"
                  layout
                  layoutId={layoutId}
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  onClick={() => selectTestimonial(itemIndex)}
                  className={`${size.w} ${size.h} group relative z-10 shrink-0 cursor-pointer overflow-hidden self-center rounded-lg border border-white/10 bg-white shadow-md outline-none transition before:absolute before:inset-0 before:bg-linear-to-b before:from-zinc-700/20 before:to-black/50 before:content-[''] hover:border-white/30 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.99]`}
                  aria-label={`Open testimonial ${itemIndex + 1}`}
                >
                  <Image
                    src={testimonial.src}
                    alt=""
                    fill
                    sizes="144px"
                    aria-hidden
                    className="object-cover object-center opacity-70 grayscale filter-[grayscale(1)_brightness(0.7)] transition group-hover:opacity-90 group-hover:filter-[grayscale(0.35)_brightness(0.85)]"
                  />
                  <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/20" />
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
