"use client";

import { Skeleton } from "@/components/ui/skeleton";

function TopExpertCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200/90 bg-[#67BC2A1A] p-4 sm:p-5 md:flex-row md:items-start md:gap-10 md:p-6">
      <Skeleton className="h-[104px] w-[104px] shrink-0 rounded-full sm:h-[118px] sm:w-[118px] md:h-40 md:w-40" />
      <div className="flex min-w-0 flex-1 flex-col space-y-3 pt-0 md:pt-1">
        <Skeleton className="h-6 max-w-[220px] rounded-md" />
        <Skeleton className="h-4 max-w-[280px] rounded-md" />
        <Skeleton className="h-4 max-w-[200px] rounded-md" />
        <Skeleton className="h-4 max-w-[160px] rounded-md" />
        <div className="my-1 border-t border-dashed border-muted" aria-hidden />
        <Skeleton className="h-11 max-w-xs rounded-xl" />
      </div>
    </div>
  );
}

export function TopExpertsCarouselSkeleton() {
  return (
    <section
      className="relative z-0 mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12"
      aria-busy="true"
      aria-label="Loading top experts"
    >
      <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
        <Skeleton className="h-8 w-40 rounded-lg sm:w-52" />
        <div className="flex shrink-0 gap-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />
          <Skeleton className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />
        </div>
      </div>
      <div className="-mx-1 flex gap-3 overflow-hidden px-1 pb-3 sm:gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[min(88vw,24rem)] shrink-0 snap-start sm:w-[min(92vw,28rem)] md:w-[min(92vw,32rem)]"
          >
            <TopExpertCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularExpertRowSkeleton() {
  return (
    <div className="flex flex-row items-start gap-3 rounded-[14px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:gap-10 md:p-6">
      <Skeleton className="h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28 md:h-40 md:w-40" />
      <div className="flex min-w-0 flex-1 flex-col space-y-3">
        <Skeleton className="h-6 max-w-xs rounded-md" />
        <Skeleton className="h-4 max-w-md rounded-md" />
        <Skeleton className="h-4 max-w-[200px] rounded-md" />
        <div className="mt-1 border-t border-dashed border-muted pt-3">
          <div className="flex w-full min-w-0 justify-end">
            <Skeleton className="h-11 w-36 shrink-0 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PopularExpertsHeaderSkeleton({ showPageSize }) {
  return (
    <>
      <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
        <Skeleton className="h-7 w-36 rounded-lg sm:h-9 sm:w-72 md:w-80" />
        <Skeleton className="hidden h-4 max-w-md rounded-md sm:block" />
      </div>
      {showPageSize ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-end sm:gap-3">
          <Skeleton className="h-4 w-28 rounded sm:w-32" />
          <Skeleton className="h-10 w-full rounded-xl sm:w-[7.5rem]" />
        </div>
      ) : null}
    </>
  );
}

export function PopularExpertsListSkeleton({ count = 4 }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:gap-8"
      aria-busy="true"
      aria-label="Loading experts list"
    >
      {Array.from({ length: count }, (_, i) => (
        <PopularExpertRowSkeleton key={i} />
      ))}
    </div>
  );
}
