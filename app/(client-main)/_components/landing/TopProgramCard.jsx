import Image from "next/image";
import Link from "next/link";
import { Check, Trophy } from "lucide-react";

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
}) {
  return (
    <article
      data-program-card
      className="flex w-[min(92vw,34.5rem)] shrink-0 snap-center p-8 overflow-hidden rounded-4xl bg-white/5 sm:w-[42.5rem]"
    >
      <div className="flex flex-col items-start justify-between w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-md bg-wz-lime px-2.5 py-1.5">
              <Trophy
                className="size-3.5 text-white sm:size-4"
                aria-hidden
                strokeWidth={2}
              />
              <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-white sm:text-[0.6875rem]">
                {badgeLabel}
              </span>
            </div>
            <h3 className="text-[1.125rem] font-bold leading-snug text-white sm:text-xl">
              {name}
            </h3>
            <ul className="space-y-2.5">
              {features.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 text-[0.8125rem] leading-snug text-white sm:text-[0.8125rem]"
                >
                  <span
                    className="mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border border-[#9AF45D] bg-white/10"
                    aria-hidden
                  >
                    <Check
                      className="size-2.5 text-[#9AF45D]"
                      strokeWidth={3}
                    />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-[1rem] font-semibold text-white sm:text-[1.0625rem] space-x-1">
              <span className="font-bold text-[1.5rem]">{price}</span>
              <span className="text-white/30">/month</span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={enrollHref}
                className="inline-flex items-center justify-center rounded-lg bg-wz-lime px-5 py-2.5 text-[0.6875rem] font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-92 sm:text-[0.75rem]"
              >
                {enrollLabel}
              </Link>
              {deliveryTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-neutral-700 px-2 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="h-full flex items-center">
            <div className="relative h-56 w-56">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-3xl shadow-2xl"
                sizes="(max-width: 640px) 38vw, 220px"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2.5 pt-2">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-neutral-600 ring-1 ring-white/15">
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
          <p className="text-[0.6875rem] font-medium leading-snug text-white sm:text-[0.71875rem] space-x-2">
            <span>By {authorName}</span>
            <span className="text-white"> | </span>
            <span className="text-[#9AF45D]">{enrollmentLine}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
