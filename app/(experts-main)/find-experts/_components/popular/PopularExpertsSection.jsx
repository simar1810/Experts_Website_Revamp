"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertList from "../ExpertList";
import ExpertsPagination from "./ExpertsPagination";

export default function PopularExpertsSection({
  experts = [],
  loading = false,
  page,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalPages = 0,
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 text-left"
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
