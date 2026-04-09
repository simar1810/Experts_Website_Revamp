"use client";

import { useState } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

export function MomentumHeadingTyping({ titleWhite, titleGreen }) {
  const [firstLineDone, setFirstLineDone] = useState(false);

  return (
    <h2 className="max-w-[20ch] text-[4.4rem] font-extrabold uppercase leading-[1.12] tracking-[0.02em]">
      <span className="block text-white">
        <TypingAnimation onComplete={() => setFirstLineDone(true)}>
          {titleWhite}
        </TypingAnimation>
      </span>
      <span className="mt-1 block text-[4.4rem] text-wz-trusted-lime sm:mt-1.5">
        <span className="grid grid-cols-1">
          <span
            className="invisible col-start-1 row-start-1 select-none"
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
