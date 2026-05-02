"use client";
import { useEffect, useMemo, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

function coerceNumeric(v) {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const m = v.match(/^([\d.]+)/);
    if (m) return Number(m[1]);
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}) {
  const ref = useRef(null);
  const numericStart = useMemo(() => coerceNumeric(startValue), [startValue]);
  const numericTarget = useMemo(() => coerceNumeric(value), [value]);

  const motionValue = useMotionValue(
    direction === "down" ? numericTarget : numericStart,
  );
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    let timer = null;

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(
          direction === "down" ? numericStart : numericTarget,
        );
      }, delay * 1000);
    }

    return () => {
      if (timer !== null) clearTimeout(timer);
    };
  }, [
    motionValue,
    isInView,
    delay,
    numericTarget,
    numericStart,
    direction,
  ]);

  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted) return;
      const target =
        direction === "down" ? numericStart : numericTarget;
      motionValue.set(target);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [motionValue, numericTarget, numericStart, direction]);

  useEffect(() => {
    const unsub = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [springValue, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className,
      )}
      {...props}
    >
      {numericStart}
    </span>
  );
}
