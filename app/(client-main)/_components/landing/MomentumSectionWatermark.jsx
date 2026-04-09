"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function MomentumSectionWatermark({ children, className }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={cn(
        className,
        !play &&
          "translate-x-[22vw] opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100",
        play &&
          "animate-momentum-watermark-in motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100"
      )}
      aria-hidden
    >
      {children}
    </p>
  );
}
