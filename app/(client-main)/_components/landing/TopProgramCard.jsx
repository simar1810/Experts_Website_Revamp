import Image from "next/image";
import Link from "next/link";
import { Check, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopProgramCard({
  badgeLabel,
  name,
  features,
  price,
  enrollLabel,
  enrollHref,
  deliveryTags,
  authorName,
  enrollmentLine,
  authorAvatarSrc,
  imageSrc,
  imageAlt,
  className,
}) {
  return (
    <article
      data-program-card
      className={cn(
        "flex w-full max-h-none shrink-0 flex-col overflow-visible rounded-3xl bg-white/5 p-4 font-lato sm:max-h-[80vh] sm:overflow-y-auto sm:rounded-4xl sm:p-8 sm:w-[min(92vw,34.5rem)] sm:snap-center lg:w-[42.5rem]",
        className,
      )}
    >
      <div className="flex w-full flex-1 flex-col gap-3 sm:gap-4">
        {/* Main row: copy left, image right (all breakpoints — matches mobile design) */}
        <div className="flex w-full flex-row items-start justify-between gap-3 sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-md bg-[#67BC2A] px-2 py-1 sm:px-2.5 sm:py-1.5">
              <Trophy
                className="size-3 text-white sm:size-4"
                aria-hidden
                strokeWidth={2}
              />
              <span className="text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-white sm:text-[0.6875rem]">
                {badgeLabel}
              </span>
            </div>
            <h3 className="text-base font-bold leading-snug text-white sm:text-xl">
              {name}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {features.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 text-[0.75rem] leading-snug text-white sm:gap-2.5 sm:text-[0.8125rem]"
                >
                  <span
                    className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-[#A3F69C] bg-white/10 sm:size-[1.125rem]"
                    aria-hidden
                  >
                    <Check
                      className="size-2 font-extrabold text-[#A3F69C] sm:size-2.5"
                      strokeWidth={3}
                    />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-white sm:text-[1.0625rem]">
              <span className="text-xl font-bold sm:text-[1.5rem]">
                {price}
              </span>
              <span className="text-white/40"> /month</span>
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Link
                href={enrollHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#67BC2A] px-3 py-2 text-[0.625rem] font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-92 sm:px-5 sm:py-2.5 sm:text-[0.75rem]"
              >
                {enrollLabel}
              </Link>
            </div>
          </div>

          <div className="relative h-32 w-[7.25rem] shrink-0 sm:h-56 sm:w-56">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="rounded-2xl object-cover shadow-xl sm:rounded-3xl sm:shadow-2xl"
              sizes="(max-width: 640px) 116px, 220px"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 pt-3 sm:gap-2.5 sm:pt-2">
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-neutral-600 ring-1 ring-white/15 sm:size-8">
            {authorAvatarSrc ? (
              <Image
                src={authorAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : null}
          </div>
          <p className="text-[0.625rem] font-medium leading-snug text-white sm:text-[0.71875rem] flex gap-x-3">
            <span className="underline underline-offset-4">
              By {authorName}
            </span>
            <span className="text-white/80">|</span>
            <span className="text-[#67BC2A]">{enrollmentLine}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
