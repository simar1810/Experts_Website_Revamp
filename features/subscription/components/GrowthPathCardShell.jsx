import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GrowthPathCardShell({
  title,
  description,
  features,
  cta,
  headerVariant = "default",
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  selected,
}) {
  const isBrandedHeader = headerVariant === "branded";

  return (
    <article
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] border border-[#f1f1f1] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1",
        selected && "ring-2 ring-[#72c03c] shadow-lg",
        className,
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
    >
      <div
        className={cn(
          "p-8 pb-4 text-center",
          isBrandedHeader && "bg-[#43901a] text-white",
        )}
      >
        <h3 className="mb-3 text-2xl font-bold tracking-tight">{title}</h3>
        <p
          className={cn(
            "mb-6 min-h-[40px] text-sm",
            isBrandedHeader ? "text-white/90" : "text-slate-500",
          )}
        >
          {description}
        </p>
        {cta}
      </div>

      <div className="flex grow flex-col border-t border-slate-50 bg-[#fafafa] p-8 pt-6">
        <p className="mb-6 font-bold text-slate-900">What you unlock:</p>
        <ul className="space-y-4 text-sm text-slate-600">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-[#63b32e]"
                strokeWidth={2.5}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function GrowthPathCtaButton({
  variant = "black",
  children,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-block w-full rounded-full py-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors",
        variant === "green" &&
          "bg-[#72c03c] text-white hover:bg-[#63b32e]",
        variant === "black" && "bg-black text-white hover:bg-zinc-800",
        variant === "white" &&
          "bg-white text-slate-900 hover:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
