"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function MomentumSectionVisual({ children, className }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const revealed = prefersReducedMotion || isInView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 56 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
