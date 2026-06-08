import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { heroContent } from "@/lib/data/landingContent";
import { pageHeroTypography as t } from "@/lib/pageHeroTypography";
import { LandingButton } from "./LandingButton";

export function HeroSection() {
  const c = heroContent;
  const h = c.headline;

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-6 font-manrope sm:pb-16 sm:pt-8 lg:pt-10">
      <div className="mx-auto grid max-w-7xl items-center px-4 sm:px-6 lg:grid-cols-2 lg:px-8 max-sm:gap-10">
        <div className="order-2 max-w-xl lg:order-1 lg:max-w-none">
          <h1 className={t.h1}>
            <span className={t.lineBlack}>{h.line1}</span>
            <br />
            <span className={t.lineGreen}>{h.line2}</span>
            <br />
            <span className={t.lineBlack}>
              {h.line3Prefix}
              <span className={t.lineGreenEmphasis}>{h.line3Highlight}</span>
            </span>
          </h1>

          <p className={`${t.descriptionSpacing} ${t.description}`}>
            {c.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <LandingButton
              variant="hero"
              size="lg"
              href={c.primaryCtaHref}
              className="gap-2 rounded-lg px-7 py-5 text-xs font-bold sm:px-12 sm:text-sm"
            >
              {c.primaryCta}
              <TrendingUp
                className="size-4 shrink-0 stroke-[2.5]"
                aria-hidden
              />
            </LandingButton>
            <LandingButton
              variant="secondary"
              size="lg"
              href={c.secondaryCtaHref}
              className="rounded-lg border border-[#03632C]/20 px-7 py-5 text-xs font-bold text-[#03632C] sm:px-12 sm:text-sm"
            >
              {c.secondaryCta}
            </LandingButton>
          </div>
        </div>

        <div className="order-1 flex justify-center max-sm:p-6 lg:order-2 lg:justify-end">
          <div className="relative w-full max-w-[520px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={c.heroImageSrc}
                alt={c.heroImageAlt}
                fill
                priority
                fetchPriority="high"
                quality={82}
                className="object-cover"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 52vw, 560px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
