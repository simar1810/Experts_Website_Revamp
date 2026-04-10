import { CalendarDays, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @param {object} props
 * @param {string} props.imageSrc
 * @param {string} props.name
 * @param {string} props.bio
 * @param {string} props.location
 * @param {string} props.joinDate
 * @param {boolean} [props.isVerified]
 * @param {string} [props.imageAlt]
 */
export default function ProfileCard({
  imageSrc,
  name,
  bio,
  location,
  joinDate,
  isVerified = false,
  imageAlt,
}) {
  const alt = imageAlt ?? `${name} profile photo`;

  return (
    <article
      className={cn(
        "font-lato",
        "relative flex overflow-hidden rounded-2xl bg-white",
        "shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-200/80",
      )}
    >
      <div className="w-1.5 shrink-0 bg-[#1a4d2e]" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6 md:gap-8 md:p-10">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="relative size-22 overflow-hidden rounded-full sm:size-32">
            <img
              src={imageSrc}
              alt={alt}
              className="size-full rounded-full object-cover ring-4 ring-[#70C136]/35 ring-offset-2 ring-offset-white"
            />
          </div>
          {isVerified ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-[#70C136] text-white shadow-md ring-[3px] ring-white"
              aria-label="Verified"
              title="Verified"
            >
              <Check className="size-3.5 stroke-3" aria-hidden />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
          <h3 className="font-lato text-base font-black uppercase tracking-tight text-black sm:text-[30px]">
            {name}
          </h3>
          <p className="text-base leading-relaxed text-gray-600">{bio}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2d6a3a]">
              <MapPin
                className="size-4 shrink-0 text-[#70C136]"
                strokeWidth={2}
                aria-hidden
              />
              {location}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2d6a3a]">
              <CalendarDays
                className="size-4 shrink-0 text-[#70C136]"
                strokeWidth={2}
                aria-hidden
              />
              {joinDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
