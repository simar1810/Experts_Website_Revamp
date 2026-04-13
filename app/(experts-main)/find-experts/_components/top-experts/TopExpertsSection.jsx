"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertCard from "../ExpertCard";

export default function TopExpertsSection({ experts = [], loading }) {
  const [profilePaths, setProfilePaths] = useState({});
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const syncScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    syncScrollState();
  }, [experts]);

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.82));
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div>
          <h2 className="text-lg sm:text-3xl font-black text-gray-900 tracking-tight">
            Top Experts
          </h2>
        </div>
        <div className="flex gap-4 overflow-hidden animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-48 rounded-2xl bg-lime-100/50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!experts.length) return null;

  return (
    <section className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 border-b border-gray-100">
      <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-2xl font-black text-gray-900 text-left">
          Top Experts
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-gray-200 bg-white text-[#66BB6A] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#66BB6A]/50 transition-colors"
            aria-label="Scroll top experts left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-gray-200 bg-white text-[#66BB6A] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#66BB6A]/50 transition-colors"
            aria-label="Scroll top experts right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={syncScrollState}
        className="flex gap-3 sm:gap-6 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 snap-x snap-mandatory"
      >
        {experts.map((expert, i) => {
          const lid = resolveListingId(expert);
          return (
            <div
              key={String(
                expert._id ?? expert.coach?._id ?? expert.id ?? `ex-${i}`,
              )}
              className="snap-start shrink-0 w-[min(88vw,420px)] sm:w-[min(92vw,490px)] md:w-[752px]"
            >
              <ExpertCard
                expert={expert}
                isTopExpert={true}
                profileHref={
                  lid && profilePaths[lid] ? profilePaths[lid] : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
