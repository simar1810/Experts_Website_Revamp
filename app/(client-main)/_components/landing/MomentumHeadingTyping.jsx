"use client";

import { useState } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

export function MomentumHeadingTyping({ titleWhite, titleGreen }) {
  const [firstLineDone, setFirstLineDone] = useState(false);

  return (
    <h2 className="max-w-[20ch] text-[2.2rem] sm:text-[4.4rem] font-extrabold uppercase leading-none sm:leading-[1.12] tracking-[0.02em]">
      <span className="block text-white">
        <TypingAnimation onComplete={() => setFirstLineDone(true)}>
          {titleWhite}
        </TypingAnimation>
      </span>
      <span className="mt-4 block text-[2.2rem] sm:text-[4.4rem] text-wz-trusted-lime sm:mt-1.5">
        {/* <span className="grid grid-cols-1 leading-[0.5] sm:leading-[1.12]"> */}
        <span className="block mt-4 text-[2.2rem] sm:text-[4.4rem] text-wz-trusted-lime sm:mt-1.5 whitespace-nowrap">
          <span
            className="absolute opacity-0 pointer-events-none select-none"
            aria-hidden
          >
            {titleGreen}
          </span>
          {firstLineDone ? (
            <span className="col-start-1 row-start-1">
              <TypingAnimation startOnView={false}>
                {titleGreen}
              </TypingAnimation>
            </span>
          ) : null}
        </span>
      </span>
    </h2>
  );
}
