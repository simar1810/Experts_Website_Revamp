import { cn } from "@/lib/utils";

const TONE_STYLES = {
  success: "border-[#cfe8b8] bg-[#e8f5dc] text-[#285c16]",
  warning: "border-[#f5ddb0] bg-[#fff7e6] text-[#8a5a00]",
  danger: "border-[#f5c2c2] bg-[#fff1f1] text-[#9b1c1c]",
  neutral: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

export default function PurchaseStatusBadge({ label, tone = "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]",
        TONE_STYLES[tone] || TONE_STYLES.neutral,
      )}
    >
      {label}
    </span>
  );
}
