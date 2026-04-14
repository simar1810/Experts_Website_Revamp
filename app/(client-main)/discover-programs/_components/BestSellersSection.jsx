"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { discoverBestSellersContent } from "@/lib/data/discoverProgramsContent";
import { BestSellerCard } from "./BestSellerCard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

export function BestSellersSection() {
  const c = discoverBestSellersContent;
  const programs = c.programs;
  const total = programs.length;
  const [visible, setVisible] = useState(() => Math.min(PAGE_SIZE, total));

  const loadMore = useCallback(() => {
    setVisible((v) => {
      const len = discoverBestSellersContent.programs.length;
      if (v >= len) return v;
      return Math.min(v + PAGE_SIZE, len);
    });
  }, []);

  const shown = programs.slice(0, visible);
  const canLoadMore = visible < total;

  return (
    <section
      className={cn(
        "bg-[#F4F4F4] pt-8 sm:pt-10",
        !canLoadMore && "pb-8 sm:pb-10",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-2xl font-lexend font-bold leading-tight tracking-tighter text-neutral-900 text-[1.8rem] sm:text-3xl lg:text-[3.6rem]">
            {c.titleBefore}{" "}
            <span className="text-[#67BC2A]">{c.titleHighlight}</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {shown.map((p) => (
            <BestSellerCard key={p.id} {...p} />
          ))}
        </div>
      </div>

      {canLoadMore ? (
        <div className="relative z-20 mt-12 w-full bg-white py-8 sm:py-10">
          <div className="flex justify-center px-4 sm:px-6">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                loadMore();
              }}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F2F4F2] px-10 py-3 text-sm font-bold text-[#00450D] transition-colors hover:bg-[#edefed]"
            >
              {c.loadMoreLabel}
              <ChevronDown className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
