import Image from "next/image";
import Link from "next/link";
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
  listingHref = "/experts",
  /** Use when `imageSrc` is not covered by `next.config` remotePatterns (e.g. API/CDN). */
  imageUnoptimized = false,
}) {
  const detailsHover =
    "group-hover/card:opacity-0 group-hover/card:translate-y-2 group-hover/card:pointer-events-none group-focus-within/card:opacity-0 group-focus-within/card:translate-y-2 group-focus-within/card:pointer-events-none";

  return (
    <article
      tabIndex={0}
      className="group/card relative aspect-[3/4] w-full min-w-0 max-w-none overflow-hidden rounded-[22px] shadow-lg shadow-black/10 outline-none focus-visible:ring-2 focus-visible:ring-wz-top-green focus-visible:ring-offset-2 focus-visible:ring-offset-wz-top-cream md:rounded-3xl"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        unoptimized={imageUnoptimized}
        className="object-cover transition-[transform,filter,opacity] duration-500 ease-out scale-[1.02] group-hover/card:scale-105 group-hover/card:blur-xs group-hover/card:brightness-[0.9] group-focus-within/card:scale-105 group-focus-within/card:blur-md group-focus-within/card:brightness-[0.55]"
        sizes="(max-width: 768px) 90vw, 320px"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-500",
          "group-hover/card:from-black/92 group-hover/card:via-black/20 group-focus-within/card:from-black/92 group-focus-within/card:via-black/45",
        )}
      />

      <div
        className={cn(
          "absolute left-3 top-3 z-10 flex flex-wrap gap-2 transition-all duration-300",
          detailsHover,
        )}
      >
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

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 p-4 transition-all duration-300 ease-out",
          detailsHover,
        )}
      >
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

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-4 pb-6 pt-10 opacity-0 translate-y-10 pointer-events-none transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
          "group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:pointer-events-auto",
          "group-focus-within/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:pointer-events-auto",
        )}
      >
        <div className="relative w-full translate-y-8 transition-transform duration-500 ease-out motion-reduce:translate-y-0 group-hover/card:translate-y-0 group-focus-within/card:translate-y-0">
          <h3 className="text-lg font-extrabold uppercase tracking-[0.06em] text-white sm:text-xl">
            {name}
          </h3>
          <Link
            href={listingHref}
            className="mt-4 block w-full mx-auto rounded-xl bg-white py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-wz-top-green shadow-md transition-colors hover:bg-white/95 sm:py-3.5 sm:text-[0.8125rem]"
          >
            VIEW&nbsp;BIO
          </Link>
        </div>
      </div>
    </article>
  );
}
