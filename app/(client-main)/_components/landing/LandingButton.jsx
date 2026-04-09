"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const landingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wz-lime focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-wz-lime text-white shadow-lg shadow-wz-lime/25 hover:bg-wz-lime/90",
        forest:
          "bg-wz-forest text-white shadow-md shadow-black/10 hover:bg-wz-forest/90",
        hero:
          "border-0 bg-gradient-to-r from-[#357200] to-[#67BC2A] text-white shadow-md shadow-black/15 hover:brightness-105 active:brightness-[0.98]",
        secondary:
          "border border-neutral-300 bg-white text-wz-forest hover:bg-neutral-50",
        gradient:
          "w-full bg-gradient-to-r from-wz-lime to-wz-forest text-white shadow-md hover:opacity-95 py-4 text-sm sm:text-base",
        ghost: "border-0 bg-transparent text-wz-forest hover:bg-black/5",
      },
      size: {
        default: "px-6 py-3 text-sm",
        lg: "px-8 py-3.5 text-sm sm:text-base",
        full: "w-full py-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export function LandingButton({
  className,
  variant,
  size,
  href,
  children,
  type = "button",
  ...props
}) {
  const classes = cn(landingButtonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
