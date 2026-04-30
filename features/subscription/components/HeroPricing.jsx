import { buttonVariants } from "@/components/ui/button";
import { useBrandingContext } from "@/features/experts-landing/context/branding";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DRIVE_VIDEO_ID = "1uVk6JXnrRxUqNcPo8IP24tQwtJS5EVyY";
const DRIVE_PREVIEW = `https://drive.google.com/file/d/${DRIVE_VIDEO_ID}/preview`;

const HeroPricing = function () {
  const { displayName } = useBrandingContext()
  return (
    <section className="relative w-full p-4">
      <div className="relative mx-auto max-w-[1400px] rounded-[20px] bg-gradient-to-br pb-0 pt-16 text-center text-white md:rounded-[40px] md:pt-24">
        <Image
          fill
          priority
          src="/images/pricing-hero.svg"
          className="z-[0] rounded-[20px] object-cover md:rounded-[20px]"
          alt=""
        />
        <div className="relative z-[1] flex h-[60vh] flex-col items-center justify-center leading-tight md:h-[75vh]">
          <h1 className="max-w-[20ch] px-2 text-[28px] font-bold tracking-tight md:max-w-none md:text-[52px] lg:text-[60px]">
            Built for Coaches Ready to Grow Beyond Referrals
          </h1>

          <p className="mx-auto mb-6 mt-4 max-w-[100ch] px-2 text-sm text-white/90 md:mb-8 md:mt-6 md:text-lg">
            {displayName} helps you go beyond Instagram, referrals, and random leads. Get
            seen by serious users who are already looking for a coach, a program, or
            a real fitness solution.
          </p>

          <div className="mb-6 inline-block max-w-2xl rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium leading-snug backdrop-blur-md sm:px-6 md:mb-10 md:text-sm">
            Powered by the WellnessZ ecosystem • 7000+ coaches • 20000+ clients
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
        id="pricing-hero-video"
        className="w-full -translate-y-[60px] scroll-mt-24 px-4 md:translate-y-[-120px] md:scroll-mt-32"
      >
        <div
          className="
            relative mx-auto max-w-3xl aspect-video overflow-hidden rounded-2xl border-4 border-[#67BC2A] bg-black
            after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-[#D9D9D9] after:content-[''] after:rotate-[3deg] after:-z-10
          "
        >
          <iframe
            title={`${displayName} — how it works`}
            src={DRIVE_PREVIEW}
            className="h-full w-full"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default HeroPricing;
