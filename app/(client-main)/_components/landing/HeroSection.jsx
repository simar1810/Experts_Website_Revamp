import Image from "next/image";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { heroContent } from "@/lib/data/landingContent";
import { LandingButton } from "./LandingButton";

export function HeroSection() {
  const c = heroContent;
  const h = c.headline;

  /** Fixed scale at all breakpoints (matches prior ~lg sizes) */
  const headlineLight =
    "text-[4rem] max-sm:text-[2.4rem] font-light leading-[1.12] text-neutral-900";
  const headlineExpert =
    "text-[4.6rem] max-sm:text-[2.8rem] font-bold leading-[1.12] text-[#03632C]";
  const headlineGoals =
    "text-[4.6rem] max-sm:text-[2.8rem]  font-extrabold leading-[1.05] text-[#03632C]";

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-6 font-manrope sm:pb-16 sm:pt-8 lg:pt-10">
      <div className="mx-auto grid max-w-7xl items-center  px-4 sm:px-6  lg:grid-cols-2  lg:px-8 max-sm:gap-10">
        <div className="order-2 lg:order-1  grid-cols-2 max-w-xl lg:max-w-none">
          <h1 className="font-lexend tracking-tight">
            <span className={headlineLight}>{h.leanBefore}</span>
            <br />
            <span className={headlineExpert}>{h.highlightExpert}</span>
            <br />
            <span className={headlineLight}>{h.leanMid}</span>
            <span className={headlineGoals}> {h.highlightGoals}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-neutral-500 sm:text-[1.125rem]">
            {c.descriptionSegments.map((seg, i) =>
              seg.emphasize ? (
                <span key={i} className="font-semibold text-neutral-700">
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <LandingButton
              variant="hero"
              size="lg"
              href={c.primaryCtaHref}
              className="gap-2 rounded-lg sm:px-12 px-7 py-5 sm:text-sm text-xs font-bold"
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
              className="rounded-lg sm:px-12 px-7 py-5 border border-[#03632C]/20 sm:text-sm text-xs font-bold text-[#03632C]"
            >
              {c.secondaryCta}
            </LandingButton>
          </div>
        </div>

        <div className=" order-1 lg:order-2 relative grid-cols-1 flex justify-center lg:justify-end max-sm:p-6">
          <div className="relative w-full max-w-md">
            <div className="relative aspect-[3/4] rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.40)] [-webkit-transform:rotate(4deg)] [transform:rotate(-3deg)]">
              <Image
                src={c.heroImageSrc}
                alt={c.heroImageAlt}
                fill
                priority
                className="object-cover rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 448px"
              />

              <div className="absolute -bottom-10 sm:-left-10 -left-3 flex size-30 flex-col items-center justify-center rounded-full bg-wz-lime p-2 text-center shadow-[0_12px_30px_-8px_rgba(0,0,0,0.40)] sm:size-40 -rotate-[20deg]">
                {c.digitalBadgeLines.map((line) => (
                  <span
                    key={line}
                    className="text-sm font-black uppercase leading-tight tracking-wide text-white sm:text-base"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
