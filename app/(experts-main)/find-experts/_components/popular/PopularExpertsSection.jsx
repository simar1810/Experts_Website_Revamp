"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertList from "../ExpertList";
import ExpertsPagination from "./ExpertsPagination";

const DEFAULT_PAGE_SIZES = [10, 20, 50];

export default function PopularExpertsSection({
  experts = [],
  loading = false,
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
  const shouldScrollAfterPageChangeRef = useRef(false);

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
    shouldScrollAfterPageChangeRef.current = true;
    onPageChange?.(nextPage);
  };

  useEffect(() => {
    if (!shouldScrollAfterPageChangeRef.current) return;
    if (loading) return;

    const el = sectionTopRef.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    shouldScrollAfterPageChangeRef.current = false;
  }, [loading]);

  return (
    <div className="flex-1 min-w-0">
      <div
        ref={sectionTopRef}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8 text-left"
      >
        <div>
          <h2 className="text-lg sm:text-3xl font-black text-gray-900 tracking-tight md:text-left">
            <span className="md:hidden">Top Experts</span>
            <span className="hidden md:inline">Popular Experts</span>
          </h2>
          <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold hidden sm:block">
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
                shouldScrollAfterPageChangeRef.current = true;
                onPageSizeChange(Number(e.target.value));
              }}
              disabled={loading}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      )}

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
