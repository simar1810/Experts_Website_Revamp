"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { googleDrivePreviewUrl } from "../utils/testimonialVideos";

const SLOT_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

/* Side columns are short; outer slots shortest; all mid-aligned in the row. */
const SLOT_SIZE = {
  "-3": { h: "h-[110px] sm:h-[128px] md:h-[150px]", w: "w-7 sm:w-9 md:w-11" },
  "-2": { h: "h-[140px] sm:h-[160px] md:h-[180px]", w: "w-7 sm:w-9 md:w-11" },
  "-1": { h: "h-[180px] sm:h-[200px] md:h-[230px]", w: "w-8 sm:w-10 md:w-12" },
  0: { h: "h-[min(52vh,380px)] md:h-[480px]", w: "w-[min(88vw,420px)]" },
  1: { h: "h-[180px] sm:h-[200px] md:h-[230px]", w: "w-8 sm:w-10 md:w-12" },
  2: { h: "h-[140px] sm:h-[160px] md:h-[180px]", w: "w-7 sm:w-9 md:w-11" },
  3: { h: "h-[110px] sm:h-[128px] md:h-[150px]", w: "w-7 sm:w-9 md:w-11" },
};

function isGoogleDriveItem(video) {
  return Boolean(video?.driveId);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function TestimonialShowcase({
  videos,
  testimonialsHref = "/testimonials",
  testimonialsLabel = "View all testimonials",
}) {
  const n = videos?.length ?? 0;
  const [active, setActive] = useState(() => {
    const l = videos?.length ?? 0;
    return l > 0 ? Math.min(Math.floor(l / 2), l - 1) : 0;
  });
  const centerVideoRef = useRef(null);
  const activeIndex = n > 0 ? mod(active, n) : 0;

  const goPrev = useCallback(() => setActive((a) => mod(a - 1, n)), [n]);
  const goNext = useCallback(() => setActive((a) => mod(a + 1, n)), [n]);

  const handleCenterPointerEnter = useCallback(() => {
    const v = centerVideoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const handleCenterPointerLeave = useCallback(() => {
    const v = centerVideoRef.current;
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {
      // ignore
    }
  }, []);

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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <h2 className="relative z-10 text-center text-2xl font-semibold text-white sm:text-3xl md:text-5xl">
        {"Don't Just Take Our Word for It"}
      </h2>
      <p className="relative z-10 mx-auto mt-4 max-w-[50ch] text-center text-sm text-white/90 md:mt-5 md:text-lg">
        Hear from coaches who are building stronger visibility and bigger client base
        with ZeeFit.
      </p>
      <p className="relative z-10 mt-4 text-center">
        <Link
          href={testimonialsHref}
          className="text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white md:text-base"
        >
          {testimonialsLabel}
        </Link>
      </p>
      <h3 className="sr-only">Video testimonials from coaches</h3>

      <div className="relative z-10 mx-auto mt-10 max-w-[1200px] md:mt-16">
        <LayoutGroup>
          <div className="flex min-h-0 max-w-full items-center justify-center gap-0.5 overflow-x-auto px-1 sm:gap-1 md:gap-2 md:overflow-visible">
            {SLOT_OFFSETS.map((offset) => {
              const videoIndex = mod(activeIndex + offset, n);
              const video = videos[videoIndex];
              const isCenter = offset === 0;
              const size = SLOT_SIZE[String(offset)];
              const drive = isGoogleDriveItem(video);
              const embedSrc = drive ? googleDrivePreviewUrl(video.driveId) : null;
              const label = (video.stripLabel || video.name).slice(0, 24);

              if (isCenter) {
                return (
                  <motion.div
                    key={`c-${activeIndex}`}
                    layout
                    transition={{ type: "spring", stiffness: 360, damping: 34 }}
                    className={`relative z-20 mx-0.5 shrink-0 self-center ${size.w} ${size.h}`}
                  >
                    <div
                      className="group relative h-full w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/25 shadow-2xl transition-[box-shadow,transform] duration-300 hover:ring-2 hover:ring-white/40 md:hover:scale-[1.01]"
                      onPointerEnter={() => {
                        if (!drive && video.src) handleCenterPointerEnter();
                      }}
                      onPointerLeave={() => {
                        if (!drive && video.src) handleCenterPointerLeave();
                      }}
                    >
                      {drive && embedSrc ? (
                        <iframe
                          key={video.driveId}
                          title={video.name}
                          src={embedSrc}
                          className="h-full w-full border-0 bg-black"
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      ) : video.src ? (
                        <video
                          key={video.src}
                          ref={centerVideoRef}
                          className="h-full w-full object-cover"
                          src={video.src}
                          loop
                          muted
                          playsInline
                          preload="auto"
                          suppressHydrationWarning
                        />
                      ) : null}

                      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-3 md:p-4">
                        <p className="line-clamp-2 text-left text-sm font-semibold text-white drop-shadow md:text-base">
                          {video.name}
                        </p>
                        <p className="text-left text-xs text-white/80">Coach</p>
                        <div className="pointer-events-auto mt-3 flex items-center justify-center gap-2">
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
                  key={offset}
                  type="button"
                  layout
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  onClick={() => setActive(videoIndex)}
                  onPointerEnter={() => {
                    if (videoIndex !== activeIndex) setActive(videoIndex);
                  }}
                  className={`${size.w} ${size.h} group relative z-10 shrink-0 cursor-pointer overflow-hidden self-center rounded-lg border border-white/10 bg-zinc-900/95 shadow-md outline-none transition before:absolute before:inset-0 before:bg-gradient-to-b before:from-zinc-700/20 before:to-black/50 before:content-[''] hover:border-white/30 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.99]`}
                  aria-label={`Open testimonial: ${video.name}`}
                >
                  {video.src && !drive ? (
                    <video
                      className="h-full w-full object-cover opacity-50 grayscale [filter:grayscale(1)_brightness(0.55)]"
                      src={video.src}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-black"
                      style={{
                        backgroundImage: drive
                          ? "radial-gradient(120% 80% at 30% 20%, rgba(34, 197, 94, 0.12), transparent)"
                          : undefined,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/30" />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 w-[8rem] -translate-x-1/2 -translate-y-1/2 -rotate-90 text-center text-[0.5rem] font-bold uppercase leading-tight tracking-[0.2em] text-white/90 sm:text-[0.55rem] md:text-[0.65rem]">
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
