"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Stacked images with opacity crossfade. Expects `slides` from `discoverHeroSlides`.
 */
export function DiscoverHeroSlideshow({ slides, intervalMs = 5500 }) {
  const n = slides?.length ?? 0;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (n <= 1) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [n, intervalMs]);

  if (!n) return null;

  return (
    <>
      {slides.map((slide, i) => {
        const visible = i === index;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={visible ? slide.alt : ""}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-1100 ease-in-out motion-reduce:transition-none ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 100vw, 50vw"
            aria-hidden={!visible}
          />
        );
      })}
    </>
  );
}
