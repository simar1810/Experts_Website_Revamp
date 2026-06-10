"use client";

import { buttonVariants } from "@/components/ui/button";
import { useBrandingContext } from "@/features/experts-landing/context/branding";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Hanken_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const STAT_CARDS = [
  {
    icon: Target,
    title: "High-Intent User Traffic",
    description: "Connect with people ready to start.",
  },
  {
    icon: User,
    title: "1000+ Profile Reach",
    description: "Get discovered by more right-fit clients.",
  },
  {
    icon: TrendingUp,
    title: "1500+ Daily Reach",
    description: "Increase your visibility every single day.",
  },
  {
    icon: Users,
    title: "Up to 80 Clients Managed",
    description: "Manage and grow your client base effortlessly.",
  },
];

function HeroGreenHills() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1400 320"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[44%] w-full lg:block"
    >
      <defs>
        <linearGradient
          id="hill-left-fill"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#3d7a18" />
          <stop offset="100%" stopColor="#4a9e22" />
        </linearGradient>
      </defs>
      {/* Left hill — inner edge drops to bottom at center seam (x=700) */}
      <path
        fill="url(#hill-left-fill)"
        d="M0 320V92C210 258 455 258 700 238L700 320H0Z"
      />
      {/* Right hill — inner edge drops to bottom at center seam (x=700) */}
      <path
        fill="#C3EFB3"
        d="M1400 320V28C1190 242 945 242 700 212L700 320H1400Z"
      />
    </svg>
  );
}

function DotGrid({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute opacity-40",
        "bg-[radial-gradient(circle,#cbd5e1_1.5px,transparent_1.5px)]",
        "bg-size-[10px_10px]",
        className,
      )}
    />
  );
}

function StatCard({ icon: Icon, title, description, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-5",
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
        <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </div>
      <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
        {description}
      </p>
    </div>
  );
}

function HeroPricing() {
  const { displayName } = useBrandingContext();

  return (
    <>
      <section className={cn(hankenGrotesk.className, "relative w-full")}>
        <div
          className={cn(
            "relative w-full overflow-hidden",
            "bg-[#fcf9f8] bg-[radial-gradient(circle_at_50%_0%,rgba(74,179,37,0.08)_0%,transparent_70%)]",
            "lg:bg-[#f7faf5] lg:bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(74,179,37,0.08)_0%,transparent_65%)]",
          )}
        >
          <HeroGreenHills />

          <DotGrid className="left-0 top-28 hidden h-40 w-28 opacity-30 lg:block" />

          <div className="relative z-10 px-4 pb-0 pt-4 text-center lg:px-10 lg:pt-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-2 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#1c1b1b] lg:hidden">
                Built for <span className="text-[#1f6d00]">Coaches</span>
                <br />
                Ready to Grow
                <br />
                <span className="text-[#1f6d00]">Beyond Referrals</span>
              </h1>

              <h1 className="hidden text-[56px] font-extrabold leading-[1] tracking-tight text-slate-900 lg:block">
                Built for Coaches
                <br />
                <span className="text-[#298900]">
                  Ready to Grow Beyond Referrals
                </span>
              </h1>

              <p className="mx-auto mb-3 max-w-xs text-base leading-6 text-[#3f4a39] lg:mt-2 lg:max-w-2xl lg:text-lg lg:text-slate-600">
                {displayName} helps your coaching get seen by people who are
                ready to start — so you attract serious, high-intent,
                higher-paying clients.
              </p>

              <div className="mx-auto mb-6 inline-flex max-w-xs items-center gap-1.5 max-lg:gap-0 rounded-full border border-[#4ab325]/20 bg-[#4ab325]/10 px-3 py-1.5 lg:mt-6 lg:max-w-3xl lg:gap-2 lg:px-5 lg:py-2">
                <ShieldCheck
                  className="h-5 w-5 shrink-0 text-white fill-[#2E7D32]"
                  aria-hidden
                />
                <p className="text-[11px] font-semibold leading-snug text-[#1f6d00] lg:text-sm lg:font-medium lg:text-[#1B5E20]">
                  <span className="lg:hidden">
                    Powered by the WellnessZ ecosystem • 7000+ coaches
                  </span>
                  <span className="hidden lg:inline">
                    Powered by the WellnessZ ecosystem • 7000+ coaches • 25000+
                    clients served
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 lg:hidden">
                <a
                  href="#pricing-plans"
                  className={cn(
                    "inline-flex h-14 w-[200px] max-sm:w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#298900] text-lg font-bold text-white shadow-lg shadow-[#1f6d00]/20 transition-transform active:scale-95",
                  )}
                >
                  Join {displayName}
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>

            {/* Desktop: stat cards in one row, CTAs centered, image below */}
            <div className="relative mx-auto mt-8 hidden w-full max-w-[1320px] lg:mt-4 lg:block">
              <div className="flex items-center justify-center gap-2 px-2 lg:gap-3 xl:gap-5">
                <div className="flex shrink-0 flex-row items-center gap-3 px-2 xl:px-4">
                  <a
                    href="#pricing-plans"
                    className={cn(
                      "inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-[#298900] px-8 text-base font-bold text-white shadow-lg shadow-lime-500/20 transition-transform hover:bg-[#5cad24]",
                    )}
                  >
                    Join {displayName}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href="#pricing-plans"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "inline-flex h-14 items-center justify-center rounded-3xl border-2 border-[#67BC2A] bg-white px-8 text-base font-bold text-[#1B5E20] hover:bg-[#E8F5E9]",
                    )}
                  >
                    View Pricing
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between absolute w-full -z-10">
                <div className="flex gap-x-5">
                  <StatCard
                    {...STAT_CARDS[0]}
                    className="w-[150px] shrink-0 text-left lg:w-[160px] xl:w-[160px]"
                  />
                  <StatCard
                    {...STAT_CARDS[1]}
                    className="w-[150px] shrink-0 text-left lg:w-[160px] xl:w-[160px]"
                  />
                </div>
                <div className="flex gap-x-5">
                  <StatCard
                    {...STAT_CARDS[2]}
                    className="w-[150px] shrink-0 text-left lg:w-[160px] xl:w-[160px]"
                  />
                  <StatCard
                    {...STAT_CARDS[3]}
                    className="w-[150px] shrink-0 text-left lg:w-[160px] xl:w-[160px]"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-center xl:mt-16">
                <Image
                  src="/images/pricing/zeefit-hero-coaches.png"
                  alt="Fitness trainers, nutrition coaches, dietitians, and strength coaches on Zeefit"
                  width={1536}
                  height={1024}
                  priority
                  className="mx-auto block h-auto w-full max-h-[390px] max-w-[600px] object-contain object-bottom xl:max-h-[430px] xl:max-w-[660px]"
                  sizes="(min-width: 1280px) 660px, (min-width: 1024px) 600px, 92vw"
                />
              </div>
            </div>

            <div className="relative mx-auto mt-8 max-w-md lg:hidden">
              <div className="relative flex justify-center">
                <div
                  aria-hidden
                  className="absolute bottom-0 left-1/2 -z-10 h-1/2 w-[150%] -translate-x-1/2 rounded-[100%] bg-[#1f6d00]/5 blur-3xl"
                />
                <Image
                  src="/images/pricing/zeefit-hero-coaches.png"
                  alt="Fitness trainers, nutrition coaches, dietitians, and strength coaches on Zeefit"
                  width={1536}
                  height={1024}
                  priority
                  className="relative z-10 mx-auto block h-auto w-full max-h-[300px] max-w-md object-contain object-bottom"
                  sizes="(max-width: 1024px) 92vw, 900px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroPricing;
