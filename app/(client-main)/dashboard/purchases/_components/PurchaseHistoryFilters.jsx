"use client";

import { cn } from "@/lib/utils";
import {
  PURCHASE_KIND_OPTIONS,
  PURCHASE_STATUS_OPTIONS,
} from "@/lib/clientPurchaseHistory";

function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-2xl border border-zinc-200 bg-white p-1"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-[#357200] text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PurchaseHistoryFilters({
  kind,
  status,
  onKindChange,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <SegmentedControl
        ariaLabel="Filter purchases by type"
        options={PURCHASE_KIND_OPTIONS}
        value={kind}
        onChange={onKindChange}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-600">
        <span className="sr-only">Filter by status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-11 min-w-[180px] rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-[#70C136]"
        >
          {PURCHASE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
