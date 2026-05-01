"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features } from "../utils/config";
import { cn } from "@/lib/utils";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

const VISUALS = [
  { src: "/images/Brand-1.png", alt: "ZeeFit brand discovery visual" },
  { src: "/images/Brand-2.png", alt: "ZeeFit brand reach visual" },
  { src: "/images/Brand-3.png", alt: "ZeeFit brand join visual" },
];

function FeatureVisual({ index }) {
const visual = VISUALS[index % VISUALS.length];
  const { displayName } = useBrandingContext()
  console.log({ displayName })
  const n = String(index + 1).padStart(2, "0");
  const style = VISUALS[index % VISUALS.length];


  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-[#a6cf88] md:rounded-3xl",
        "aspect-4/5 min-h-[260px] md:min-h-0",
        "ring-1 ring-black/4 ring-inset"
      )}
    >
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        priority={index === 0}
      />
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
                      "p-4 sm:p-6 md:p-6",
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
