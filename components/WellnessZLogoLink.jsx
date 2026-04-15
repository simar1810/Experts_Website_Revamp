import Link from "next/link";

import { cn } from "@/lib/utils";

export default function WellnessZLogoLink({
  href = "/",
  isFooter = false,
  className,
  ...props
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-[150px] max-sm:w-[125px] shrink-0 flex-col font-serif text-xl font-bold italic leading-[1.05] sm:text-2xl",
        isFooter
          ? "text-white sm:text-3xl text-3xl max-sm:w-[195px] sm:w-[195px]"
          : "text-black",
        className,
      )}
      {...props}
    >
      <span className="whitespace-nowrap">
        {isFooter ? (
          "WellnessZ"
        ) : (
          <>
            Wellness<span className="text-[#67BC2A]">Z</span>
          </>
        )}
      </span>
      <span
        className={cn(
          "self-end",
          isFooter ? "text-[#86B351]" : "text-[#67BC2A]",
        )}
      >
        Experts
      </span>
    </Link>
  );
}
