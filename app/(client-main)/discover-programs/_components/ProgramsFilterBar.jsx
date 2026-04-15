"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { discoverFilterContent } from "@/lib/data/discoverProgramsContent";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Radix radio value cannot be ""; map placeholder options to this sentinel. */
const EMPTY_VALUE = "__none__";

function toRadioValue(v) {
  return v === "" ? EMPTY_VALUE : v;
}

function fromRadioValue(v) {
  return v === EMPTY_VALUE ? "" : v;
}

const triggerClassName =
  "font-lato flex h-10 w-full min-w-0 items-center justify-between gap-1 rounded-full border-0 bg-white px-2.5 py-2 text-left text-xs font-medium text-neutral-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#9AF45D] focus-visible:ring-offset-2 sm:h-11 sm:min-w-[9.5rem] sm:w-auto sm:gap-2 sm:px-4 sm:text-sm [&[data-state=open]]:ring-2 [&[data-state=open]]:ring-[#9AF45D]/60";

function FilterDropdown({ options, value, onChange, ariaLabel }) {
  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? options[0]?.label ?? "";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label={ariaLabel} className={triggerClassName}>
        <span className="min-w-0 truncate text-[10px]">{label}</span>
        <ChevronDown
          className="size-3 shrink-0 text-neutral-400 sm:size-4"
          strokeWidth={2}
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 font-lato">
        <DropdownMenuRadioGroup
          value={toRadioValue(value)}
          onValueChange={(v) => onChange(fromRadioValue(v))}
        >
          {options.map((o) => (
            <DropdownMenuRadioItem
              key={o.value === "" ? `${ariaLabel}-placeholder` : o.value}
              value={toRadioValue(o.value)}
              className="cursor-pointer"
            >
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProgramsFilterBar({ className }) {
  const f = discoverFilterContent;
  const [specialty, setSpecialty] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div
      className={cn(
        "font-lato rounded-2xl bg-[#F2F4F2] p-3 shadow-md sm:rounded-[16px] sm:p-3 sm:pl-5 sm:pr-3",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative min-h-10 w-full flex-1 sm:min-h-11">
          <label htmlFor="discover-program-search" className="sr-only">
            Search programs
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-neutral-400 sm:left-4 sm:size-5"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="discover-program-search"
            type="search"
            name="program-search"
            placeholder={f.searchPlaceholder}
            className="font-lato h-10 w-full rounded-full border-0 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#9AF45D] focus-visible:ring-offset-2 sm:h-11 sm:pl-11 sm:pr-4"
          />
        </div>

        {/* Mobile: one row — 3 equal dropdowns + Filter; desktop: flex row */}
        <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:gap-2">
          <FilterDropdown
            options={f.specialtyOptions}
            value={specialty}
            onChange={setSpecialty}
            ariaLabel={f.specialtyLabel}
          />
          <FilterDropdown
            options={f.durationOptions}
            value={duration}
            onChange={setDuration}
            ariaLabel={f.durationLabel}
          />
          <FilterDropdown
            options={f.priceOptions}
            value={price}
            onChange={setPrice}
            ariaLabel={f.priceLabel}
          />

          <button
            type="button"
            className="font-lato h-10 shrink-0 rounded-full bg-[#03632C] px-3 text-[0.6875rem] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#024d23] sm:h-11 sm:px-7 sm:text-sm"
          >
            {f.filterButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
