"use client";

import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features } from "../utils/config";
import { cn } from "@/lib/utils";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

const VISUALS = [
  { variant: "discovery", accent: "from-[#0d4f1c]/90 via-[#1b5e20] to-[#2e7d32]" },
  { variant: "programs", accent: "from-[#14532d] via-[#166534] to-[#22c55e]/80" },
  { variant: "connect", accent: "from-[#0f3d1a] to-[#4ade80]/60" },
];

function FeatureVisual({ index }) {
  const { displayName } = useBrandingContext()
  console.log({ displayName })
  const n = String(index + 1).padStart(2, "0");
  const style = VISUALS[index % VISUALS.length];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl md:rounded-3xl",
        "aspect-[4/3] min-h-[220px] sm:aspect-[5/4] md:min-h-0 md:aspect-[3/4]",
        "ring-1 ring-black/[0.04] ring-inset"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          style.accent
        )}
      />
      {/* Soft light bloom */}
      <div className="absolute -right-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-[#bbf7d0]/30 blur-3xl" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 32V0h32' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Large step number */}
      <div className="absolute left-4 top-4 md:left-6 md:top-6">
        <span
          className="text-[4.5rem] font-black leading-none tracking-tighter text-white/[0.12] sm:text-7xl md:text-8xl"
          aria-hidden
        >
          {n}
        </span>
      </div>
      {/* Center mark — abstract Z / brand shape */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {style.variant === "discovery" && (
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm md:h-32 md:w-32">
            <svg viewBox="0 0 40 40" className="h-14 w-14 text-white/90 md:h-16 md:w-16" fill="currentColor" aria-hidden>
              <path d="M8 8h24l-8 10h6L12 32h8l10-12h-5l3-4H8V8z" opacity="0.95" />
            </svg>
          </div>
        )}
        {style.variant === "programs" && (
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 w-12 rounded-lg border border-white/25 bg-white/10 shadow-lg backdrop-blur-sm md:h-14 md:w-14"
              />
            ))}
          </div>
        )}
        {style.variant === "connect" && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-20 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-white/90" />
              <div className="h-0.5 w-12 bg-white/40" />
              <div className="h-3 w-3 rounded-full border-2 border-white/60 bg-white/20" />
            </div>
            <div className="h-2 w-16 rounded-full bg-white/20" />
          </div>
        )}
      </div>
      <p className="absolute bottom-4 right-4 max-w-[10rem] text-right text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 md:bottom-6 md:right-6 md:text-xs">
        {displayName} for coaches
      </p>
    </div>
  );
}

export default function FeatureSection() {
  return (
    <section className="w-full bg-[#f4f6f8]">
      <div className="relative mx-auto max-w-[1200px] space-y-8 px-4 py-6 md:space-y-0 md:px-6 md:py-0 md:pb-16">
        {features.map((feature, index) => {
          const isReversed = feature.imageSide === "right";
          return (
            <div
              key={feature.title}
              className="md:sticky md:top-0 flex min-h-0 items-stretch py-3 md:min-h-screen md:items-center md:py-8"
              style={{ zIndex: index + 1 }}
            >
              <div
                className={cn(
                  "w-full overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_20px_50px_-12px_rgba(0,0,0,0.12)]",
                  "md:rounded-3xl"
                )}
              >
                <div
                  className={cn(
                    "grid gap-0 md:grid-cols-2",
                    isReversed && "md:[&>div:first-child]:order-2"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 sm:p-6 md:p-0",
                      isReversed ? "md:pr-8 md:pl-10" : "md:pl-8 md:pr-6"
                    )}
                  >
                    <div className="h-full min-h-0">
                      <FeatureVisual index={index} />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex flex-col justify-center px-5 py-8 sm:px-8 md:py-12 md:pr-10 md:pl-8",
                      isReversed && "md:pl-10 md:pr-6"
                    )}
                  >
                    {feature.kicker ? (
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2e7d32]">
                        {feature.kicker}
                      </p>
                    ) : null}

                    <h3 className="text-balance text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl md:leading-[1.15] lg:text-[2rem]">
                      {feature.title}
                    </h3>

                    <div className="mt-4 max-w-prose space-y-3.5 text-[15px] leading-relaxed text-gray-600 md:mt-5 md:text-base md:leading-7">
                      {Array.isArray(feature.description) ? (
                        feature.description.map((line, d) => (
                          <p key={d}>{line}</p>
                        ))
                      ) : (
                        <p>{feature.description}</p>
                      )}
                    </div>

                    <ul className="mt-6 flex flex-col gap-2.5 sm:mt-7">
                      {feature.subFeatures.map((sub) => (
                        <li
                          key={sub}
                          className="flex items-center gap-3 rounded-xl border border-[#e8f5e9] bg-gradient-to-r from-[#f1f8e9]/80 to-white px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:border-[#c8e6c9] md:py-3 md:text-[15px]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                          <span className="leading-snug">{sub}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 sm:mt-8">
                      <Button
                        asChild
                        size="lg"
                        className="h-12 rounded-xl bg-[#2E7D32] px-7 text-sm font-semibold text-white shadow-md transition hover:bg-[#256628] md:h-12 md:px-8"
                      >
                        <a href="#pricing-hero-video" className="inline-flex items-center gap-2">
                          See How It Works
                          <ArrowRight className="h-4 w-4 opacity-90" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
