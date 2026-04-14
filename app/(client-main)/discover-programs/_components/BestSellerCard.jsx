import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { discoverBestSellerBadgeVariants } from "@/lib/data/discoverProgramsContent";
import { cn } from "@/lib/utils";

export function BestSellerCard({
  imageSrc,
  imageAlt,
  badges,
  title,
  instructorLine,
  features,
  price,
  priceSuffix,
  enrollHref,
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-16/10 w-full shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b.key}
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide",
                discoverBestSellerBadgeVariants[b.variant] ??
                  "bg-white/80 text-[#00450D]",
              )}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="text-lg font-bold leading-snug text-neutral-900">
          {title}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-[#67BC2A]">
          {instructorLine}
        </p>

        <ul className="mt-4 space-y-2">
          {features.map((line) => (
            <li
              key={line}
              className="flex gap-2.5 text-sm leading-snug text-neutral-600"
            >
              <span
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#67BC2A]"
                aria-hidden
              >
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
          <p className="text-2xl font-bold text-[#00450D] flex justify-center items-center gap-x-2">
            {price}
            <span className="text-sm font-medium text-black/50">
              {priceSuffix}
            </span>
          </p>
          <Link
            href={enrollHref}
            className="inline-flex items-center justify-center rounded-full bg-[#00450D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#024d23]"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </article>
  );
}
