"use client";

import WellnessZLogoLink from "@/components/WellnessZLogoLink";
import { buttonVariants } from "@/components/ui/button";
import { useBrandingContext } from "@/features/experts-landing/context/branding";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Home,
  Menu,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Hanken_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Find Experts", href: "/find-experts" },
  { name: "Browse Programs", href: "/discover-programs" },
  { name: "Resources", href: "/discover-programs" },
  { name: "Pricing", href: "/experts/pricing" },
];

function HeroGreenHills() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1400 320"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[48%] w-full lg:block"
    >
      <defs>
        <linearGradient
          id="hill-left"
          x1="0%"
          y1="100%"
          x2="85%"
          y2="15%"
        >
          <stop offset="0%" stopColor="#67BC2A" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#67BC2A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E8F5E9" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="hill-right"
          x1="100%"
          y1="100%"
          x2="15%"
          y2="15%"
        >
          <stop offset="0%" stopColor="#67BC2A" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#67BC2A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E8F5E9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#hill-left)"
        d="M0 320V72C0 28 260 0 520 96C580 120 620 168 640 220L640 320H0Z"
      />
      <path
        fill="url(#hill-right)"
        d="M760 220C780 168 820 120 880 96C1140 0 1400 28 1400 72V320H760Z"
      />
    </svg>
  );
}

function HeroCenterGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="absolute left-1/2 top-[28%] h-[55%] w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(232,245,233,0.35)_42%,rgba(103,188,42,0.06)_68%,transparent_85%)]" />
    </div>
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
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
        <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </div>
      <h3 className="text-sm font-bold leading-snug text-[#1c1b1b] sm:text-[15px]">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[#4b5563] sm:text-[13px]">
        {description}
      </p>
    </div>
  );
}

function HeroNavbar({ displayName }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/" || pathname === "/home";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-[#becab4]/30 bg-[#fcf9f8]/80 backdrop-blur-md transition-shadow lg:relative lg:z-20 lg:border-slate-100/80 lg:bg-transparent lg:backdrop-blur-none",
          hasScrolled && "shadow-md lg:shadow-none",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-4 lg:h-auto lg:px-8 lg:py-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="-ml-2 p-2 text-[#1c1b1b]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="pricing-hero-mobile-nav"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden />
              ) : (
                <Menu className="h-6 w-6" aria-hidden />
              )}
            </button>
            <Link
              href="/"
              className="text-2xl font-black italic tracking-tighter text-[#67BC2A]"
            >
              {displayName?.toUpperCase() || "ZEEFIT"}
            </Link>
          </div>

          <div className="hidden lg:block">
            <WellnessZLogoLink href="/" compact />
          </div>

          <div className="hidden items-center justify-center gap-6 lg:flex xl:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-sm tracking-wide transition-colors",
                  isActive(link.href)
                    ? "font-bold text-[#1B5E20]"
                    : "font-medium text-[#4b5563] hover:text-[#1c1b1b]",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#pricing-plans"
              className={cn(
                "inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#7ed63f] to-[#67BC2A] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow-md shadow-[#67BC2A]/20 transition-transform active:scale-95 lg:hidden",
              )}
            >
              Join
            </a>

            <a
              href="#pricing-plans"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden h-10 rounded-xl border-0 bg-gradient-to-b from-[#7ed63f] to-[#67BC2A] px-5 text-sm font-bold text-white shadow-md shadow-[#67BC2A]/25 hover:from-[#72c933] hover:to-[#5cad24] lg:inline-flex",
              )}
            >
              Join Zeefit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div
            id="pricing-hero-mobile-nav"
            className="border-t border-[#becab4]/30 bg-[#fcf9f8] px-4 py-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(link.href)
                      ? "bg-[#E8F5E9] font-bold text-[#1B5E20]"
                      : "font-medium text-[#4b5563] hover:bg-[#E8F5E9]/60",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="#pricing-plans"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#7ed63f] to-[#67BC2A] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#67BC2A]/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join {displayName}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

function MobileBottomNav() {
  return (
    <nav
      aria-label="Pricing quick actions"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center border-t border-[#becab4]/20 bg-[#fcf9f8]/90 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-lg lg:hidden"
    >
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="p-3 text-[#3f4a39]"
          aria-label="Home"
        >
          <Home className="h-6 w-6" aria-hidden />
        </Link>
        <a
          href="#pricing-plans"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#7ed63f] to-[#67BC2A] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#67BC2A]/25 transition-transform active:scale-[0.98] hover:from-[#72c933] hover:to-[#5cad24]"
        >
          <UserPlus className="h-5 w-5" aria-hidden />
          Join Zeefit
        </a>
      </div>
    </nav>
  );
}

export default function HeroPricing() {
  const { displayName } = useBrandingContext();

  return (
    <>
      <section
        className={cn(
          hankenGrotesk.className,
          "relative w-full lg:p-4",
        )}
      >
        <div
          className={cn(
            "relative mx-auto overflow-hidden lg:max-w-[1400px]",
            "bg-white lg:rounded-[40px] lg:border lg:border-slate-100 lg:bg-white lg:shadow-[0_20px_60px_rgba(15,23,42,0.06)]",
            "bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(103,188,42,0.1)_0%,rgba(232,245,233,0.15)_35%,transparent_70%)]",
            "lg:bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,#ffffff_0%,rgba(232,245,233,0.25)_45%,rgba(255,255,255,0.98)_100%)]",
          )}
        >
          <HeroCenterGlow />
          <HeroGreenHills />

          <DotGrid className="left-0 top-28 hidden h-40 w-28 opacity-30 lg:block" />

          <div className="relative z-10 px-4 pb-0 pt-6 text-center lg:px-10 lg:pt-12">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-2 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#1c1b1b] lg:hidden">
                Built for{" "}
                <span className="text-[#67BC2A]">Coaches</span>
                <br />
                Ready to Grow
                <br />
                <span className="text-[#67BC2A]">Beyond Referrals</span>
              </h1>

              <h1 className="hidden text-[56px] font-extrabold leading-[1] tracking-tight text-[#1c1b1b] lg:block">
                Built for Coaches
                <br />
                <span className="text-[#67BC2A]">
                  Ready to Grow Beyond Referrals
                </span>
              </h1>

              <p className="mx-auto mb-3 max-w-xs text-base leading-6 text-[#4b5563] lg:mt-2 lg:max-w-2xl lg:text-lg">
                {displayName} helps your coaching get seen by people who are
                ready to start — so you attract serious, high-intent,
                higher-paying clients.
              </p>

              <div className="mx-auto mb-6 inline-flex max-w-xs items-center gap-1.5 rounded-full border border-[#67BC2A]/20 bg-[#E8F5E9] px-3 py-1.5 lg:mt-6 lg:max-w-3xl lg:gap-2 lg:px-5 lg:py-2">
                <CheckCircle2
                  className="h-[18px] w-[18px] shrink-0 text-[#1B5E20] lg:hidden"
                  aria-hidden
                />
                <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F5E9] ring-1 ring-[#67BC2A]/15 lg:flex">
                  <ShieldCheck
                    className="h-4 w-4 text-[#1B5E20]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                <p className="text-[11px] font-semibold leading-snug text-[#1B5E20] lg:text-sm lg:font-medium">
                  <span className="lg:hidden">
                    Powered by the WellnessZ ecosystem • 7000+ coaches
                  </span>
                  <span className="hidden lg:inline">
                    Powered by the WellnessZ ecosystem • 7000+ coaches • 25000+
                    clients served
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center lg:mt-8">
                <a
                  href="#pricing-plans"
                  className={cn(
                    "inline-flex h-14 w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#7ed63f] to-[#67BC2A] text-lg font-bold text-white shadow-lg shadow-[#67BC2A]/25 transition-transform active:scale-95 lg:h-14 lg:rounded-3xl lg:px-8 lg:text-base lg:hover:from-[#72c933] lg:hover:to-[#5cad24]",
                  )}
                >
                  Join Zeefit
                  <ArrowRight className="h-5 w-5 lg:h-4 lg:w-4" aria-hidden />
                </a>
              </div>
            </div>

            <div className="relative mx-auto mt-8 max-w-md lg:mt-0 lg:max-w-[1280px]">
              <div className="relative hidden grid-cols-[minmax(0,1fr)_minmax(280px,560px)_minmax(0,1fr)] grid-rows-2 items-start gap-x-4 gap-y-3 px-2 lg:grid xl:gap-x-8 xl:px-6">
                <StatCard
                  {...STAT_CARDS[0]}
                  className="col-start-1 row-start-1 max-w-[240px] justify-self-end xl:max-w-[250px]"
                />
                <StatCard
                  {...STAT_CARDS[1]}
                  className="col-start-1 row-start-2 max-w-[240px] justify-self-end xl:max-w-[250px]"
                />

                <div className="relative col-start-2 row-span-2 row-start-1 flex items-end justify-center self-stretch">
                  <Image
                    src="/images/pricing/zeefit-hero-coacheswebsite.png"
                    alt="Fitness trainers, nutrition coaches, dietitians, and strength coaches on Zeefit"
                    width={1536}
                    height={1024}
                    priority
                    className="mx-auto block h-auto w-full max-h-[460px] object-contain object-bottom xl:max-h-[500px]"
                    sizes="560px"
                  />
                </div>

                <StatCard
                  {...STAT_CARDS[2]}
                  className="col-start-3 row-start-1 max-w-[240px] xl:max-w-[250px]"
                />
                <StatCard
                  {...STAT_CARDS[3]}
                  className="col-start-3 row-start-2 max-w-[240px] xl:max-w-[250px]"
                />
              </div>

              <div className="relative flex justify-center lg:hidden">
                <div
                  aria-hidden
                  className="absolute bottom-0 left-1/2 -z-10 h-1/2 w-[150%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(103,188,42,0.18)_0%,rgba(232,245,233,0.12)_40%,transparent_70%)] blur-2xl"
                />
                <Image
                  src="/images/pricing/zeefit-hero-coachesmobile.png"
                  alt="Fitness trainers, nutrition coaches, dietitians, and strength coaches on Zeefit"
                  width={1536}
                  height={1024}
                  priority
                  className="relative z-10 mx-auto block h-auto w-full max-h-[300px] max-w-md object-contain object-bottom"
                  sizes="92vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </>
  );
}
