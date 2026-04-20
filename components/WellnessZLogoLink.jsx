import Image from "next/image";
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
        "inline-flex shrink-0 items-center",
        !isFooter && "w-[275px] max-sm:w-[235px]",
        isFooter && "w-[355px] max-sm:w-[355px]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center",
          isFooter &&
            "rounded-md bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5",
        )}
      >
        <Image
          src="/experts-logo.png"
          alt="WellnessZ Experts"
          width={400}
          height={120}
          className={cn(
            "h-[62px] w-auto max-w-[285px] object-contain object-left sm:h-[72px] sm:max-w-[325px]",
            isFooter && "max-w-[325px] sm:h-[78px] sm:max-w-[355px]",
          )}
          priority={!isFooter}
        />
      </span>
    </Link>
  );
}
