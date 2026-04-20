"use client";

import { useState } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

export function MomentumHeadingTyping({ titleTrusted, titleExperts, titleGreen }) {
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);

  return (
    <h2 className="max-w-[20ch] text-[2.2rem] sm:text-[4.4rem] font-extrabold uppercase leading-none sm:leading-[1.12] tracking-[0.02em]">
      <span className="block text-white">
        <TypingAnimation onComplete={() => setLine1Done(true)}>
          {titleTrusted}
        </TypingAnimation>
      </span>

      <span className="relative mt-4 block text-white sm:mt-1.5">
        <span className="invisible block select-none" aria-hidden>
          {titleExperts}
        </span>
        {line1Done ? (
          <span className="absolute left-0 top-0 block">
            <TypingAnimation
              startOnView={false}
              onComplete={() => setLine2Done(true)}
            >
              {titleExperts}
            </TypingAnimation>
          </span>
        ) : null}
      </span>

      <span className="mt-4 block text-[2.2rem] sm:text-[4.4rem] text-wz-trusted-lime sm:mt-1.5">
        <span className="grid grid-cols-1 leading-[0.5] sm:leading-[1.12]">
          <span
            className="absolute opacity-0 pointer-events-none select-none"
            aria-hidden
          >
            {titleGreen}
          </span>
          {line2Done ? (
            <span className="col-start-1 row-start-1">
              <TypingAnimation startOnView={false}>{titleGreen}</TypingAnimation>
            </span>
          ) : null}
        </span>
      </span>
    </h2>
  );
}
