"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const tagVariants = {
  lime: "bg-wz-top-green text-white",
  muted: "bg-white/25 text-white backdrop-blur-[6px]",
};

export function CoachShowcaseCard({
  name,
  title,
  tags = [],
  imageSrc,
  imageAlt,
  bioPreview,
  websiteLink,
  /** Use when `imageSrc` is not covered by `next.config` remotePatterns (e.g. API/CDN). */
  imageUnoptimized = false,
}) {
  const summaryText =
    (bioPreview || "").trim() ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const websiteHref = (() => {
    const raw = (websiteLink || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `https://${raw}`;
  })();

  return (
    <article className="group/card relative aspect-[3/4] w-full min-w-0 max-w-none [perspective:1200px]">
      <div
        className={cn(
          "relative h-full w-full rounded-[22px] shadow-lg shadow-black/10 transition-transform duration-700 [transform-style:preserve-3d] md:rounded-3xl",
          "group-hover/card:[transform:rotateY(180deg)] group-focus-within/card:[transform:rotateY(180deg)]",
        )}
      >
        {/* When flipped (hover), disable pointer events on front so the back face + link receive clicks */}
        <div className="absolute inset-0 overflow-hidden rounded-[22px] [backface-visibility:hidden] pointer-events-auto group-hover/card:pointer-events-none group-focus-within/card:pointer-events-none md:rounded-3xl">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            unoptimized={imageUnoptimized}
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <span
                key={`${t.label}-${idx}`}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]",
                  tagVariants[t.variant] ?? tagVariants.muted,
                )}
              >
                {t.label}
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <h3 className="text-lg font-extrabold uppercase tracking-[0.06em] text-white sm:text-xl">
              {name}
            </h3>
            <p className="mt-1 text-sm font-medium leading-snug text-white/85 sm:text-[0.9375rem]">
              {title}
            </p>
            <div className="mt-2 flex gap-0.5" aria-label="5 out of 5 rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-[14px] fill-wz-top-green text-wz-top-green"
                  strokeWidth={0}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-[2] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#edf9df] via-[#f7fff0] to-[#dbf3c8] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] pointer-events-none group-hover/card:pointer-events-auto group-focus-within/card:pointer-events-auto md:rounded-3xl md:p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--brand-primary)]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#4ca848]/16 blur-2xl" />

          <div className="relative h-full rounded-2xl border border-[#dff0cf] bg-gradient-to-br from-[#f9fff5] via-[#f0fae6] to-[#e7f6d8] p-4 shadow-[0_12px_28px_-14px_rgba(3,99,44,0.45)] backdrop-blur-sm sm:p-5">
            <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full ring-4 ring-white shadow-md sm:h-24 sm:w-24">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                unoptimized={imageUnoptimized}
                className="object-cover"
                sizes="96px"
              />
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-base font-black uppercase tracking-[0.06em] text-neutral-900 sm:text-lg">
                {name}
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-wz-top-green sm:text-[0.8125rem]">
                {title}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-center gap-0.5" aria-label="5 out of 5 rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-wz-top-green text-wz-top-green"
                  strokeWidth={0}
                  aria-hidden
                />
              ))}
            </div>

            {tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {tags.map((t, idx) => (
                  <span
                    key={`${t.label}-back-${idx}`}
                    className="rounded-full border border-wz-top-green/25 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[#03632C]"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="mt-4 text-center text-sm leading-relaxed text-neutral-600 sm:text-[0.9375rem]">
              {summaryText}
            </p>
            {websiteHref ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-[3] mt-4 block cursor-pointer text-center text-[11px] font-bold uppercase tracking-[0.08em] text-[#03632C] underline decoration-[var(--brand-primary)]/60 underline-offset-4 hover:decoration-[var(--brand-primary)]"
              >
                Visit Website
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
