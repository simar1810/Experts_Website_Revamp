"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  googleDrivePreviewUrl,
  googleDriveThumbnailUrl,
} from "../utils/testimonialVideos";

const SLOT_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

/* Side cards: shared width; height steps down from the main card toward the outer edges. */
const SIDE_CARD_W = "w-12 sm:w-14 md:w-36";
const SLOT_SIZE = {
  "-3": { h: "h-[142px] sm:h-[168px] md:h-[212px]", w: SIDE_CARD_W },
  "-2": { h: "h-[197px] sm:h-[233px] md:h-[356px]", w: SIDE_CARD_W },
  "-1": { h: "h-[252px] sm:h-[298px] md:h-[542px]", w: SIDE_CARD_W },
  0:   { h: "aspect-[9/16]", w: "w-[min(88vw,420px)]" },
  1:  { h: "h-[252px] sm:h-[298px] md:h-[542px]", w: SIDE_CARD_W },
  2:  { h: "h-[197px] sm:h-[233px] md:h-[356px]", w: SIDE_CARD_W },
  3:  { h: "h-[142px] sm:h-[168px] md:h-[212px]", w: SIDE_CARD_W },
};

function isGoogleDriveItem(video) {
  return Boolean(video?.driveId);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function getVideoKey(video, fallback) {
  return video?.src || video?.driveId || String(fallback);
}

function pauseAndMuteVideos(root) {
  root?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.muted = true;
  });
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
  const sectionRef = useRef(null);
  const sectionInViewRef = useRef(true);
  const centerVideoRef = useRef(null);
  const playSelectedRef = useRef(false);
  const activeIndex = n > 0 ? mod(active, n) : 0;

  const selectVideo = useCallback(
    (index, { play = true } = {}) => {
      if (!n) return;
      playSelectedRef.current = play;
      setActive(mod(index, n));
    },
    [n],
  );

  const goPrev = useCallback(() => {
    playSelectedRef.current = true;
    setActive((a) => mod(a - 1, n));
  }, [n]);
  const goNext = useCallback(() => {
    playSelectedRef.current = true;
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

  useEffect(() => {
    const v = centerVideoRef.current;
    if (!v) {
      playSelectedRef.current = false;
      return undefined;
    }

    if (!sectionInViewRef.current) {
      pauseAndMuteVideos(sectionRef.current);
      playSelectedRef.current = false;
      return undefined;
    }

    v.muted = false;
    v.defaultMuted = false;
    try {
      v.currentTime = 0;
    } catch {
      // Some browsers can reject currentTime before metadata is ready.
    }

    if (!playSelectedRef.current) {
      return undefined;
    }

    const raf = window.requestAnimationFrame(() => {
      v.play().catch(() => {});
      playSelectedRef.current = false;
    });

    return () => window.cancelAnimationFrame(raf);
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        sectionInViewRef.current = inView;

        if (!inView) {
          playSelectedRef.current = false;
          pauseAndMuteVideos(section);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (!n) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative mt-24 w-full overflow-hidden bg-[#1f7a34] p-6 pb-12 pt-10 md:mt-32 md:p-16"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />

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
          <div className="flex min-h-0 max-w-full items-center justify-center gap-0.5 overflow-hidden px-1 sm:gap-1 md:gap-2 md:overflow-visible">
            {SLOT_OFFSETS.map((offset) => {
              const videoIndex = mod(activeIndex + offset, n);
              const video = videos[videoIndex];
              const isCenter = offset === 0;
              const size = SLOT_SIZE[String(offset)];
              const drive = isGoogleDriveItem(video);
              const embedSrc = drive ? googleDrivePreviewUrl(video.driveId) : null;
              const thumbnailSrc = drive
                ? googleDriveThumbnailUrl(video.driveId)
                : null;
              const label = (video.stripLabel || video.name).slice(0, 24);
              const videoKey = getVideoKey(video, videoIndex);
              const layoutId = `testimonial-card-${videoKey}`;

              if (isCenter) {
                return (
                  <motion.div
                    key={videoKey}
                    layout
                    layoutId={layoutId}
                    transition={{ type: "spring", stiffness: 360, damping: 34 }}
                    className={`relative z-20 mx-0.5 shrink-0 self-center ${size.w} ${size.h}`}
                  >
                    <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/25 shadow-2xl transition-[box-shadow,transform] duration-300 hover:ring-2 hover:ring-white/40 md:hover:scale-[1.01]">
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
                          className="h-full w-full object-contain object-top"
                          src={video.src}
                          loop
                          controls
                          controlsList="nodownload"
                          playsInline
                          preload="auto"
                          suppressHydrationWarning
                        />
                      ) : null}

                      <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-black/75 via-black/25 to-transparent p-3 md:p-4">
                        <p className="line-clamp-2 text-left text-sm font-semibold text-white drop-shadow md:text-base">
                          {video.name}
                        </p>
                        <p className="text-left text-xs text-white/80">Coach</p>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center md:bottom-14">
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
                  key={videoKey}
                  type="button"
                  layout
                  layoutId={layoutId}
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  onClick={() => selectVideo(videoIndex)}
                  className={`${size.w} ${size.h} group relative z-10 shrink-0 cursor-pointer overflow-hidden self-center rounded-lg border border-white/10 bg-zinc-900/95 shadow-md outline-none transition before:absolute before:inset-0 before:bg-linear-to-b before:from-zinc-700/20 before:to-black/50 before:content-[''] hover:border-white/30 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.99]`}
                  aria-label={`Open testimonial: ${video.name}`}
                >
                  {video.src && !drive ? (
                    <video
                      className="h-full w-full object-cover object-center opacity-50 grayscale filter-[grayscale(1)_brightness(0.55)]"
                      src={video.src}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : thumbnailSrc ? (
                    <div
                      className="h-full w-full bg-cover bg-center bg-no-repeat opacity-70 grayscale filter-[grayscale(1)_brightness(0.7)] transition group-hover:opacity-90 group-hover:filter-[grayscale(0.35)_brightness(0.85)]"
                      style={{ backgroundImage: `url("${thumbnailSrc}")` }}
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-linear-to-b from-emerald-800 via-zinc-900 to-black"
                    />
                  )}
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
