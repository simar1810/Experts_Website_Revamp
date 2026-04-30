"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertList from "../ExpertList";
import {
  PopularExpertsHeaderSkeleton,
  PopularExpertsListSkeleton,
} from "../ExpertsSectionSkeletons";
import ExpertsPagination from "./ExpertsPagination";

const DEFAULT_PAGE_SIZES = [10, 20, 50];

/** Navbar offset — keep filter rail headline under the sticky header when smoothing into view */
const FILTERS_SCROLL_OFFSET_PX = 96;

export default function PopularExpertsSection({
  experts = [],
  loading = false,
  /** Increments only when the user clicks "Search Experts" in the hero; triggers smooth scroll toward results. */
  scrollToResultsNonce = 0,
  filtersScrollTargetRef,
  page,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalPages = 0,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}) {
  const [profilePaths, setProfilePaths] = useState({});
  const sectionTopRef = useRef(null);
  const scrollNoncePrevRef = useRef(null);

  const scrollListingHeaderIntoPlace = (behavior = "smooth") => {
    requestAnimationFrame(() => {
      const el = sectionTopRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: behavior === "instant" ? "auto" : behavior,
      });
    });
  };

  useEffect(() => {
    const prev = scrollNoncePrevRef.current;
    scrollNoncePrevRef.current = scrollToResultsNonce;
    if (prev === null) return;
    if (prev === scrollToResultsNonce) return;
    /** Double rAF: let list height settle after fetch, then smoothly scroll toward the filters rail (desktop) or listing header (fallback). */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target =
          filtersScrollTargetRef?.current ?? sectionTopRef.current;
        if (!target) return;
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          FILTERS_SCROLL_OFFSET_PX;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth",
        });
      });
    });
  }, [scrollToResultsNonce, filtersScrollTargetRef]);

  const profilePathIdsKey = useMemo(
    () =>
      experts
        .map((e) => resolveListingId(e))
        .filter(Boolean)
        .sort()
        .join(","),
    [experts],
  );

  useEffect(() => {
    if (!Array.isArray(experts) || experts.length === 0) {
      setProfilePaths({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ids = [
          ...new Set(experts.map((e) => resolveListingId(e)).filter(Boolean)),
        ];
        const res = await fetch("/api/experts/profile-paths", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingIds: ids }),
        });
        if (!res.ok) throw new Error("profile-paths");
        const data = await res.json();
        if (!cancelled) setProfilePaths(data.paths || {});
      } catch {
        if (!cancelled) setProfilePaths({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [experts, profilePathIdsKey]);

  const handlePageChange = (nextPage) => {
    onPageChange?.(nextPage);
    scrollListingHeaderIntoPlace("smooth");
  };

  const listSkeletonCount = Math.min(Math.max(Number(pageSize) || 10, 3), 8);

  return (
    <div className="flex-1 min-w-0">
      <div
        ref={sectionTopRef}
        className="mb-6 flex flex-col gap-4 text-left sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
      >
        {loading ? (
          <PopularExpertsHeaderSkeleton
            showPageSize={typeof onPageSizeChange === "function"}
          />
        ) : (
          <>
            <div>
              <h2 className="text-lg font-black tracking-tight text-gray-900 sm:text-3xl md:text-left">
                <span className="md:hidden">Top Experts</span>
                <span className="hidden md:inline">Popular Experts</span>
              </h2>
              <p className="mt-1 hidden text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:block sm:text-sm">
                Top rated wellness experts available for you
              </p>
            </div>
            {typeof onPageSizeChange === "function" ? (
              <label className="flex w-full shrink-0 flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500 sm:text-xs">
                  Experts per page
                </span>
                <select
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm outline-none transition-colors hover:border-[#70C136] focus-visible:ring-2 focus-visible:ring-[#70C136]/35"
                  value={pageSize}
                  aria-label="Experts per page"
                  onChange={(e) => {
                    onPageSizeChange(Number(e.target.value));
                  }}
                >
                  {pageSizeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        )}
      </div>

      {loading && <PopularExpertsListSkeleton count={listSkeletonCount} />}

      {!loading && experts.length === 0 && (
        <p className="text-center text-gray-500 font-medium py-16">
          No experts match your filters on this page.
        </p>
      )}

      {!loading && experts.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            <ExpertList experts={experts} profilePaths={profilePaths} />
          </div>
          <ExpertsPagination
            page={page}
            onPageChange={handlePageChange}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
