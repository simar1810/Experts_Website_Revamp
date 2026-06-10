import { cn } from "@/lib/utils";
import { formatPurchaseAmount } from "@/lib/clientPurchaseHistory";
import { Package, Receipt, ShoppingBag } from "lucide-react";

function StatCard({ label, value, helper, icon: Icon, variant = "light" }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-sm",
        variant === "green"
          ? "border-[#d7edc8] bg-[#e8f5dc]"
          : "border-zinc-200/80 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]">
            {label}
          </p>
          <p className="mt-3 font-lato text-3xl font-extrabold tracking-tight text-[#1f3d18]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            variant === "green"
              ? "bg-white/85 text-[#70C136]"
              : "bg-[#f2f8ec] text-[#357200]",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.4} aria-hidden />
        </div>
      </div>
      {helper ? (
        <p className="mt-4 text-xs font-medium leading-relaxed text-zinc-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export default function PurchaseHistoryStats({ summary }) {
  const totalSpentLabel = formatPurchaseAmount(
    summary.totalSpent,
    summary.currency,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Total orders"
        value={summary.totalOrders}
        helper="All program and product transactions"
        icon={Receipt}
        variant="green"
      />
      <StatCard
        label="Total spent"
        value={totalSpentLabel}
        helper="Successful paid purchases only"
        icon={ShoppingBag}
      />
    </div>
  );
}
