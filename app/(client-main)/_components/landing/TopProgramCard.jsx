import Link from "next/link";
import { Calendar, Check, Trophy } from "lucide-react";
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
  onEnroll,
  enrollDisabled = false,
  emphasizeHover = false,
}) {
  const visibleDeliveryTags = Array.isArray(deliveryTags)
    ? deliveryTags.filter(Boolean)
    : [];
  const enrollClassName =
    "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[#67BC2A] px-3 py-2 text-[0.625rem] font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-92 disabled:pointer-events-none disabled:opacity-60 sm:px-5 sm:py-2.5 sm:text-[0.75rem] cursor-pointer";

  return (
    <article
      data-program-card
      className={cn(
        "flex h-full min-h-0 w-full max-h-none shrink-0 flex-col overflow-visible rounded-3xl bg-white/5 p-4 font-lato sm:max-h-[80vh] sm:overflow-y-auto sm:rounded-4xl sm:p-8 sm:w-[min(92vw,34.5rem)] sm:snap-center lg:w-[42.5rem]",
        emphasizeHover &&
          "transition-[transform,background-color,box-shadow] duration-300 ease-out hover:scale-[1.02] hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]",
        className,
      )}
    >
      <div className="flex w-full min-h-0 flex-1 flex-col gap-3 sm:gap-4">
        {/* Main row: flex-1 + items-stretch so price/CTA can mt-auto-align across grid siblings */}
        <div className="flex min-h-0 w-full flex-1 flex-row items-stretch justify-between gap-3 sm:gap-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 sm:gap-5">
            <div className="shrink-0 space-y-2">
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
              <div className="space-y-2">
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
                        className="mt-0.5 flex size-2 shrink-0 items-center justify-center rounded-full border-[1px] border-[#A3F69C]  sm:size-[1rem]"
                        aria-hidden
                      >
                        <Check
                          className="size-2 font-extrabold text-[#A3F69C] sm:size-2"
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-white/70">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-auto shrink-0 space-y-3 sm:space-y-4">
              <p className="text-sm font-semibold text-white sm:text-[1.0625rem]">
                <span className="text-xl font-bold sm:text-[1.5rem]">
                  {price}
                </span>
                <span className="text-white/40"> /month</span>
              </p>
              <div className="flex min-w-0 flex-nowrap items-center gap-1.5 sm:gap-2">
                {onEnroll ? (
                  <button
                    type="button"
                    disabled={enrollDisabled}
                    onClick={onEnroll}
                    className={enrollClassName}
                  >
                    {enrollLabel}
                  </button>
                ) : (
                  <Link href={enrollHref} className={enrollClassName}>
                    {enrollLabel}
                  </Link>
                )}
                <div className="flex shrink-0 items-center justify-center gap-x-2">
                  {visibleDeliveryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-[#9AF45D]/20 px-2 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.08em] text-[#9AF45D] sm:px-2.5 sm:text-[0.625rem]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-32 w-[7.25rem] shrink-0 self-start sm:h-72 sm:w-72">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full rounded-2xl object-cover shadow-xl sm:rounded-3xl sm:shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2  pt-3 sm:gap-2.5 sm:pt-2">
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-neutral-600 ring-1 ring-white/15 sm:size-8">
            {authorAvatarSrc ? (
              <img
                src={authorAvatarSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <p className="text-[0.625rem] font-medium leading-snug text-white sm:text-[0.71875rem] flex gap-x-3">
            <span className="underline underline-offset-4">
              By {authorName}
            </span>
            <span className="text-white/80">|</span>
            <span className="text-[#67BC2A] flex gap-x-1 items-center justify-center"><Calendar className="h-4 w-4"/>{enrollmentLine}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
