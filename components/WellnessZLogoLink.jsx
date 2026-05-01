"use client";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

export default function WellnessZLogoLink({
  href = "/",
  isFooter = false,
  /** Navbar: shorter/tighter lockup without changing footer sizing. */
  compact = false,
  className,
  ...props
}) {
  const { logo, displayName } = useBrandingContext();
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center",
        !isFooter && !compact && "w-[275px] max-sm:w-[235px]",
        !isFooter && compact && "w-[158px] max-sm:w-[134px]",
        /* Must not exceed md:col-span-3 (~25% of container) or it overlaps Contact Us */
        isFooter && "block w-full max-w-[240px] sm:max-w-[260px]",
        className,
      )}
      {...props}
    >
      <span className="inline-flex w-full items-center">
        <Image
          src={logo || "/experts-logo.png"}
          alt={displayName || "Zeefit"}
          width={400}
          height={120}
          className={cn(
            !isFooter &&
              !compact &&
              "h-[62px] w-auto max-w-[285px] object-contain object-left sm:h-[72px] sm:max-w-[325px]",
            !isFooter &&
              compact &&
              "h-[35px] w-auto max-w-[158px] object-contain object-left sm:h-[40px] sm:max-w-[176px]",
            isFooter &&
              "h-auto w-full max-h-[44px] object-contain object-left sm:max-h-[48px]",
          )}
          priority={!isFooter}
        />
      </span>
    </Link>
  );
}
