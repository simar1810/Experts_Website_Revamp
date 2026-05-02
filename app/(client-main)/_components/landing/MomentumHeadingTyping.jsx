"use client";

import { useState } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

/** Two-line momentum heading: white line types first, then lime line (matches `momentumContent`). */
export function MomentumHeadingTyping({ titleTrusted, titleGreen }) {
  const [showGreen, setShowGreen] = useState(false);

  return (
    <h2 className="max-w-[20ch] text-[2.2rem] font-extrabold uppercase leading-none tracking-[0.02em] sm:text-[4.4rem] sm:leading-[1.12]">
      <span className="block text-white">
        <TypingAnimation onComplete={() => setShowGreen(true)}>
          {titleTrusted}
        </TypingAnimation>
      </span>

      <span className="relative mt-4 block sm:mt-1.5">
        <span
          className="invisible block text-[2.2rem] sm:text-[4.4rem]"
          aria-hidden
        >
          {titleGreen}
        </span>
        {showGreen ? (
          <span className="absolute left-0 top-0 block text-[2.2rem] text-wz-trusted-lime sm:text-[4.4rem]">
            <TypingAnimation startOnView={false}>{titleGreen}</TypingAnimation>
          </span>
        ) : null}
      </span>
    </h2>
  );
}
