"use client";

import { buttonVariants } from "@/components/ui/button";
import { useBrandingContext } from "@/features/experts-landing/context/branding";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";

function pauseAndMuteVideos(root) {
  root?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.muted = true;
  });
}

const HeroPricing = function () {
  const { displayName } = useBrandingContext()
  const videoSectionRef = useRef(null);

  useEffect(() => {
    const section = videoSectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseAndMuteVideos(section);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full p-4">
      <div className="relative mx-auto max-w-[1400px] rounded-[20px] bg-linear-to-br pb-0 pt-16 text-center text-white md:rounded-[40px] md:pt-24">
        <Image
          fill
          priority
          src="/images/pricing-hero.svg"
          className="z-0 rounded-[20px] object-cover md:rounded-[20px]"
          alt=""
        />
        <div className="relative z-1 flex h-[60vh] -translate-y-8 flex-col items-center justify-center leading-tight md:h-[75vh] md:-translate-y-14">
          <h1 className="max-w-[20ch] px-2 text-[28px] font-bold tracking-tight md:max-w-none md:text-[52px] lg:text-[60px]">
            Built for Coaches Ready to Grow Beyond Referrals
          </h1>
          <p className="mx-auto mb-6 mt-4 max-w-[100ch] px-2 text-sm text-white/90 md:mb-8 md:mt-6 md:text-lg">
            Instagram views do not always become paying clients. {displayName} helps your coaching get seen by people who are looking to start and are ready to commit.
          </p>
          <div className="mb-6 inline-block max-w-2xl rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium leading-snug backdrop-blur-md sm:px-6 md:mb-10 md:text-sm mx-5">
            Powered by the WellnessZ ecosystem • 7000+ coaches • 25000+ clients
            served
          </div>

          <a
            href="#pricing-plans"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "h-12 rounded-xl bg-white px-8 text-sm font-semibold text-[#1B5E20] hover:bg-white/90 hover:text-[#1B5E20] sm:w-auto md:h-14 md:text-base"
            )}
          >
            Join Zeefit
          </a>
        </div>
      </div>
      <div
        ref={videoSectionRef}
        id="pricing-hero-video"
        className="w-full -translate-y-[80px] scroll-mt-24 px-4 md:translate-y-[-150px] md:scroll-mt-32"
      >
        <div
          className="
            relative mx-auto max-w-3xl aspect-video overflow-hidden rounded-2xl border-4 border-[#67BC2A] bg-black
            after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-[#D9D9D9] after:content-[''] after:rotate-3 after:-z-10
          "
        >
          <video
            className="h-full w-full object-cover"
            src="/mp4/pricing/pricing-hero.mp4"
            controls
            controlsList="nodownload"
            playsInline
            preload="auto"
            suppressHydrationWarning
          />
        </div>
      </div>
    </section>
  );
};

export default HeroPricing;
