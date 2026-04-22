"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TopProgramCard } from "../../_components/landing/TopProgramCard";
import { discoverTopSellingContent } from "@/lib/data/discoverProgramsContent";
import { ProgramsFilterBar } from "./ProgramsFilterBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  fetchDiscoverProgramsList,
  programDocumentToTopCard,
} from "@/lib/discoverProgramsApi";

const CARDS_PER_PAGE = 4;
const SEARCH_DEBOUNCE_MS = 400;
const API_PAGE_LIMIT = 24;

function chunkPrograms(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

const gridCardClassName =
  "w-full min-w-0 max-h-none max-w-none overflow-visible sm:w-full lg:w-full";

function useClientProgramsFromApi() {
  const [programs, setPrograms] = useState(() => []);
  const [loadState, setLoadState] = useState({
    status: "loading",
    error: null,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const load = useCallback(async (searchText) => {
    setLoadState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const res = await fetchDiscoverProgramsList({
        search: searchText,
        page: 1,
        limit: API_PAGE_LIMIT,
        whitelabel: "wellnessz",
      });
      const raw = Array.isArray(res.data) ? res.data : [];
      const forClients = raw.filter(
        (p) => p.person === "client" || p.person == null,
      );
      const useList = forClients.length ? forClients : raw;
      setPrograms(useList.map(programDocumentToTopCard));
      setLoadState({ status: "ok", error: null });
    } catch (e) {
      setPrograms(discoverTopSellingContent.programs);
      setLoadState({
        status: "error",
        error: e instanceof Error ? e.message : "Could not load programs",
      });
    }
  }, []);

  useEffect(() => {
    load(debouncedSearch);
  }, [load, debouncedSearch]);

  return {
    programs,
    loadState,
    search,
    setSearch,
    refresh: () => load(debouncedSearch),
  };
}

export function TopSellingProgramsSection() {
  const c = discoverTopSellingContent;
  const scrollRef = useRef(null);
  const { programs, loadState, search, setSearch, refresh } =
    useClientProgramsFromApi();

  const pages = useMemo(
    () => chunkPrograms(programs, CARDS_PER_PAGE),
    [programs],
  );
  const pageCount = pages.length;

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(pageCount > 1);

  const syncArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pageCount <= 1) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    setCanPrev(i > 0);
    setCanNext(i < pageCount - 1);
  }, [pageCount]);

  useEffect(() => {
    syncArrows();
  }, [syncArrows, pageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [programs]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => syncArrows());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncArrows]);

  const scrollByPage = (dir) => {
    const el = scrollRef.current;
    if (!el || pageCount <= 1) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const current = Math.round(el.scrollLeft / w);
    const next = Math.max(0, Math.min(pageCount - 1, current + dir));
    el.scrollTo({ left: next * w, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#03632C] py-10 font-lato sm:py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-lexend text-[1.8rem] font-bold leading-tight tracking-tighter sm:text-3xl lg:text-[3.6rem] text-[#9AF45D] ">
          <span className="">{c.titleBefore}</span>{" "}
          <span className="text-white">{c.titleMid}</span>{" "}
          <span className="">{c.titleHighlight}</span>
        </h2>

        <div className="mt-6 sm:mt-10">
          <ProgramsFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            onFilterApply={refresh}
          />
        </div>

        {loadState.status === "error" && loadState.error ? (
          <p className="mt-4 text-center text-sm text-white/80" role="status">
            {loadState.error} Showing sample programs below.
          </p>
        ) : null}

        <div
          ref={scrollRef}
          onScroll={syncArrows}
          className="scrollbar-hide -mx-4 mt-6 flex min-h-48 snap-x snap-mandatory overflow-x-auto pb-2 sm:mx-0 sm:mt-10"
        >
          {loadState.status === "loading" && programs.length === 0 ? (
            <div className="flex w-full min-w-full items-center justify-center px-4 py-16 sm:px-0">
              <p className="text-sm font-medium text-white/90">
                Loading programs…
              </p>
            </div>
          ) : programs.length === 0 ? (
            <div className="flex w-full min-w-full items-center justify-center px-4 py-16 sm:px-0">
              <p className="text-center text-sm text-white/90">
                No programs match your search. Try different keywords.
              </p>
            </div>
          ) : (
            pages.map((pagePrograms) => (
              <div
                key={pagePrograms[0].id}
                className="w-full min-w-full shrink-0 snap-center px-4 sm:px-0"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {pagePrograms.map((p) => (
                    <TopProgramCard
                      key={p.id}
                      className={gridCardClassName}
                      badgeLabel={p.badgeLabel}
                      name={p.name}
                      features={p.features}
                      price={p.price}
                      enrollLabel={p.enrollLabel}
                      enrollHref={p.enrollHref}
                      deliveryTags={p.deliveryTags}
                      authorName={p.authorName}
                      enrollmentLine={p.enrollmentLine}
                      authorAvatarSrc={p.authorAvatarSrc}
                      imageSrc={p.imageSrc}
                      imageAlt={p.imageAlt}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {pageCount > 1 ? (
          <div className="mt-8 flex justify-center gap-2 sm:mt-12">
            <button
              type="button"
              aria-label="Previous programs"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next programs"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
