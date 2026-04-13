import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { momentumContent } from "@/lib/data/landingContent";
import { MomentumSectionWatermark } from "./MomentumSectionWatermark";
import { MomentumHeadingTyping } from "./MomentumHeadingTyping";
import { MomentumSectionVisual } from "./MomentumSectionVisual";
import { NumberTicker } from "@/components/ui/number-ticker";

export function MomentumSection() {
  const c = momentumContent;
  const [a, b, stat3] = c.stats;

  return (
    <section className="relative overflow-hidden bg-[#03632C] py-14 font-montserrat sm:py-20">
      <MomentumSectionWatermark className="pointer-events-none absolute left-0 top-7 select-none font-black uppercase leading-none text-white/[0.08] text-[28vw] sm:top-12 sm:text-[min(42vw,280px)] min-[480px]:text-[min(36vw,320px)] lg:text-[340px]">
        {c.watermark}
      </MomentumSectionWatermark>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <MomentumHeadingTyping
              titleWhite={c.titleWhite}
              titleGreen={c.titleGreen}
            />

            <div className="mt-10 grid max-w-md grid-cols-2 gap-x-10 gap-y-9 sm:gap-x-12">
              <div>
                <div className="flex ">
                  <NumberTicker
                    value={a.value}
                    startValue={0}
                    className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]"
                  />
                  <p className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]">
                    k+
                  </p>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-white sm:text-[11px]">
                  {a.label}
                </p>
              </div>
              <div>
                <div className="flex">
                  <NumberTicker
                    value={b.value}
                    startValue={0}
                    className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]"
                  />
                  <p className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]">
                    k+
                  </p>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-white sm:text-[11px]">
                  {b.label}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="flex">
                  <NumberTicker
                    value={stat3.value}
                    startValue={0}
                    className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]"
                  />
                  <p className="text-[clamp(1.75rem,3.2vw,2.25rem)] font-semibold leading-none text-[#9AF45D]">
                    %
                  </p>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-white sm:text-[11px]">
                  {stat3.label}
                </p>
              </div>
            </div>
          </div>

          <MomentumSectionVisual className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(137,255,91,0.4),0_0_32px_rgba(137,255,91,0.15),0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src={c.imageSrc}
                alt={c.imageAlt}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute -bottom-8 right-1 max-w-[min(100%,300px)] rounded-2xl bg-white/[0.12] p-4 shadow-2xl backdrop-blur-[12px] sm:right-3 sm:max-w-[320px] sm:p-5">
              <div className="flex gap-1.5">
                <BadgeCheck
                  className="size-7 shrink-0 text-wz-trusted-lime"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <blockquote className="font-playfair text-[0.9375rem] italic leading-relaxed text-white sm:text-[1rem]">
                  &ldquo;{c.testimonial.quote}&rdquo;
                </blockquote>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-white/15 pt-4">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-wz-trusted-lime/60">
                  <Image
                    src={c.testimonial.avatarSrc}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.9375rem] font-bold text-white">
                    {c.testimonial.authorName}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/90">
                    {c.testimonial.authorRole}
                  </p>
                </div>
              </div>
            </div>
          </MomentumSectionVisual>
        </div>
      </div>
    </section>
  );
}
