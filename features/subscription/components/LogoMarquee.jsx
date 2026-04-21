"use client";
import { cn } from "@/lib/utils";
import { partnerLogos } from "../utils/config";

export default function LogoMarquee({
  speed = 20,
  pauseOnHover = true,
  direction = "left",
  className,
}) {
  const duplicated = [...partnerLogos, ...partnerLogos];

  return (
    <div className={cn("w-full py-2 mb-10", className)}>
      <p className="text-center text-sm text-muted-foreground font-medium">
        Used by the world&apos;s leading companies
      </p>

      <div
        className={cn(
          "relative overflow-hidden",
          "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        )}
      >
        <div
          className={cn(
            "flex w-max gap-12 py-4",
            "animate-marqueex",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
          style={{
            animationDuration: `${speed}s`,
            animationDirection: direction === "left" ? "normal" : "reverse",
          }}
        >
          {duplicated.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex items-center justify-center"
            >
              <img
                src={src}
                alt="Partner logo"
                className="h-18 w-28 object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-20 md:w-32"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}