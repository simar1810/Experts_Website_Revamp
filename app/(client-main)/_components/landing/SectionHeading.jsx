import { cn } from "@/lib/utils";

export function SectionHeading({
  overline,
  title,
  titleHighlight,
  titleAfter = "",
  subtitle,
  align = "center",
  dark = false,
  className,
  headingClassName,
  highlightClassName,
  subtitleClassName,
}) {
  const alignCls =
    align === "center"
      ? "text-center mx-auto"
      : align === "left"
        ? "text-left"
        : "text-right";

  return (
    <div className={cn("max-w-3xl space-y-3", alignCls, className)}>
      {overline ? (
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-[0.2em]",
            dark ? "text-wz-lime" : "text-wz-lime",
          )}
        >
          {overline}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-[3.6rem] font-extrabold uppercase leading-none tracking-[0.02em] space-x-3",
          dark ? "text-white" : "text-wz-forest",
          headingClassName,
        )}
      >
        {title}
        {titleHighlight ? (
          <span className={cn("text-wz-lime", highlightClassName)}>
            {titleHighlight}
          </span>
        ) : null}
        {titleAfter}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "text-[0.9375rem] leading-relaxed sm:text-base",
            dark ? "text-white/80" : "text-neutral-600",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
