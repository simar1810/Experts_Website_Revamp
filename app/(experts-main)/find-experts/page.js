"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { useValues } from "@/context/valuesContext";
import { useExpertsListingSearch } from "@/hooks/useExpertsListingSearch";
import { useIsMinLg } from "@/hooks/use-is-min-lg";
import { availableSpecialities } from "@/lib/data/specialities";
import HeroSearchBar from "./_components/hero/HeroSearchBar";
import MobileListingToolbar from "./_components/MobileListingToolbar";
import TopExpertsSection from "./_components/top-experts/TopExpertsSection";
import ExpertsFiltersSidebar from "./_components/filters/ExpertsFiltersSidebar";
import ExpertsFiltersBottomSheet from "./_components/filters/ExpertsFiltersBottomSheet";
import PopularExpertsSection from "./_components/popular/PopularExpertsSection";
import ExpertsReviewsSection from "./_components/reviews/ExpertsReviewsSection";

/** Multiple landing / filter flows pass `speciality=a,b,c` (comma-separated). */
function parseSpecialitiesFromSearchParam(value) {
  const raw = (value ?? "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ExpertsPageInner() {
  const searchParams = useSearchParams();
  const specialityFromUrl = searchParams.get("speciality")?.trim() ?? "";
  const locationFromUrl = searchParams.get("location")?.trim() ?? "";
  const [selectedSpecialities, setSelectedSpecialities] = useState(() =>
    parseSpecialitiesFromSearchParam(specialityFromUrl),
  );
  const [locationQuery, setLocationQuery] = useState(locationFromUrl);
  const [locationFilter, setLocationFilter] = useState(() =>
    locationFromUrl
      ? { mode: "city", city: locationFromUrl }
      : { mode: "none" },
  );
  const [nameQuery, setNameQuery] = useState("");
  const [searchClientLocation, setSearchClientLocation] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const mobileFiltersRef = useRef(null);
  /** Scroll target: start of the left-hand filter rail (lg+); used when "Search Experts" runs. */
  const filterRailScrollTargetRef = useRef(null);
  /** Bumps only when the hero "Search Experts" button completes a search → scroll results into view. */
  const [searchExpertsScrollNonce, setSearchExpertsScrollNonce] = useState(0);
  const isMinLg = useIsMinLg();
  const { values } = useValues();

  useEffect(() => {
    if (!isMinLg) return;
    // Viewport switched to `lg`: avoid sheet reopening after resize back to mobile.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional layout breakpoint sync
    setIsMobileFiltersOpen(false);
  }, [isMinLg]);

  const specialityOptions = useMemo(() => {
    const v = values?.expertise_categories;
    if (Array.isArray(v) && v.length > 0) {
      return [...new Set(v.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
    }
    return availableSpecialities;
  }, [values?.expertise_categories]);

  useEffect(() => {
    setSelectedSpecialities(
      parseSpecialitiesFromSearchParam(specialityFromUrl),
    );
  }, [specialityFromUrl]);

  useEffect(() => {
    if (locationFromUrl) {
      setLocationFilter({ mode: "city", city: locationFromUrl });
      setLocationQuery(locationFromUrl);
    } else {
      setLocationFilter({ mode: "none" });
      setLocationQuery("");
    }
  }, [locationFromUrl]);

  const useGeo = searchClientLocation?.coordinates?.length === 2;
  const showDistanceFilter =
    useGeo ||
    locationFilter.mode !== "none" ||
    (locationQuery || "").trim().length > 0;

  const listing = useExpertsListingSearch({
    selectedSpecialities,
    locationFilter,
    searchClientLocation,
    nameQuery,
  });

  const handleSearch = useCallback(async () => {
    await listing.runSearch();
  }, [listing.runSearch]);

  const handleSearchExpertsButtonClick = useCallback(async () => {
    await handleSearch();
    setSearchExpertsScrollNonce((n) => n + 1);
  }, [handleSearch]);

  const locationLabel = useGeo
    ? "your area"
    : (locationQuery || "").trim() || "All Cities";

  const freeCountDisplay =
    listing.filteredTotal ??
    listing.meta?.freeReturned ??
    listing.free?.length ??
    0;

  const mobileResultsCount =
    listing.meta?.totalCount ??
    listing.meta?.freeTotal ??
    listing.meta?.total ??
    (listing.paid?.length || 0) +
      (listing.filteredTotal ?? listing.free?.length ?? 0);

  const appliedFiltersCount = useMemo(() => {
    let n = selectedSpecialities.length + (listing.languages?.length || 0);
    n += Object.keys(listing.clientsRanges || {}).filter(
      (k) => listing.clientsRanges[k],
    ).length;
    if ((listing.consultationMode || "").trim()) n += 1;
    if (listing.wzAssured) n += 1;
    if (showDistanceFilter && Number(listing.radiusKm) !== 20) n += 1;
    return n;
  }, [
    selectedSpecialities,
    listing.languages,
    listing.clientsRanges,
    listing.consultationMode,
    listing.wzAssured,
    listing.radiusKm,
    showDistanceFilter,
  ]);

  const handleMobileFilterSheetOpenChange = (open) => {
    setIsMobileFiltersOpen(open);
  };

  const filterSidebarProps = {
    showDistanceFilter,
    locationLabel,
    freeCount: freeCountDisplay,
    languages: listing.languages,
    setLanguages: listing.setLanguages,
    selectedSpecialities,
    setSelectedSpecialities,
    consultationMode: listing.consultationMode,
    setConsultationMode: listing.setConsultationMode,
    radiusKm: listing.radiusKm,
    setRadiusKm: listing.setRadiusKm,
    clientsRanges: listing.clientsRanges,
    setClientsRanges: listing.setClientsRanges,
    wzAssured: listing.wzAssured,
    setWzAssured: listing.setWzAssured,
  };

  return (
    <main className="min-h-screen bg-white overflow-x-clip font-lato">
      {/* z-20: keep hero + search dropdowns above following sections (Top Experts paints later in DOM and would cover overflow otherwise) */}
      <section className="relative z-20 w-full min-h-[380px] md:min-h-[480px] flex flex-col items-center justify-center text-center px-4 pb-10 md:pb-12 max-lg:hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 overflow-hidden max-lg:hidden"
          style={{
            backgroundImage: "url('/images/gym-bg.png')",
            filter: "blur(6px) brightness(0.4)",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-3 sm:space-y-5 pt-8 md:pt-10 max-lg:hidden">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find the right <span className="text-[#70C136]">Expert</span> for
            your Health
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-white/80 text-[10px] sm:text-sm md:text-base leading-relaxed font-medium max-w-lg mx-auto line-clamp-2 sm:line-clamp-none">
              Search from 7,000+ verified wellness experts and connect with the
              right expert for your health goals.
            </p>
          </div>

          <HeroSearchBar
            selectedSpecialities={selectedSpecialities}
            setSelectedSpecialities={setSelectedSpecialities}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            setLocationFilter={setLocationFilter}
            clientLocation={searchClientLocation}
            setClientLocation={setSearchClientLocation}
            specialityOptions={specialityOptions}
            nameQuery={nameQuery}
            setNameQuery={setNameQuery}
            onSearch={handleSearch}
            onSearchButtonClick={handleSearchExpertsButtonClick}
          />
        </div>
      </section>
      {/* items-stretch: left column matches main column height so sticky aside can ride the full Top + Popular (incl. pagination) scroll range */}
      <div className="flex items-stretch justify-between">
        {isMinLg === true ? (
          <div
            ref={filterRailScrollTargetRef}
            className="flex min-h-0 w-full shrink-0 flex-col self-stretch px-6 lg:w-[340px] lg:pl-6 lg:pr-0"
          >
            <div className="h-6 shrink-0 md:h-8" aria-hidden />
            {/*
              ~Full-viewport tall filter rail; inner ExpertsFiltersSidebar scrolls its white body.
            */}
            <aside className="sticky top-16 z-10 flex h-auto min-h-0 w-full flex-col overflow-hidden lg:h-[calc(100dvh-5rem)]">
              <ExpertsFiltersSidebar {...filterSidebarProps} />
            </aside>
          </div>
        ) : null}

        {isMinLg !== true ? (
          <ExpertsFiltersBottomSheet
            open={isMobileFiltersOpen}
            onOpenChange={handleMobileFilterSheetOpenChange}
          >
            <ExpertsFiltersSidebar
              ref={mobileFiltersRef}
              {...filterSidebarProps}
              embedInSheet
              sheetOpen={isMobileFiltersOpen}
              onClose={() => handleMobileFilterSheetOpenChange(false)}
            />
          </ExpertsFiltersBottomSheet>
        ) : null}

        <div className="min-h-0 min-w-0 flex-1">
          <MobileListingToolbar
            resultsCount={mobileResultsCount}
            appliedFiltersCount={appliedFiltersCount}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            setLocationFilter={setLocationFilter}
            setClientLocation={setSearchClientLocation}
            onSearch={handleSearch}
            onOpenFilters={() => setIsMobileFiltersOpen(true)}
          />
          <TopExpertsSection experts={listing.paid} loading={listing.loading} />
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 pb-16">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
              <PopularExpertsSection
                experts={listing.displayFree}
                loading={listing.loading}
                scrollToResultsNonce={searchExpertsScrollNonce}
                filtersScrollTargetRef={filterRailScrollTargetRef}
                page={listing.page}
                onPageChange={listing.setPage}
                hasNextPage={listing.hasNextPage}
                hasPrevPage={listing.hasPrevPage}
                totalPages={listing.totalPages}
                pageSize={listing.pageSize}
                onPageSizeChange={listing.setPageSize}
              />
            </div>
          </section>
        </div>
      </div>

      <ExpertsReviewsSection />
    </main>
  );
}

export default function ExpertsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white font-sans animate-pulse">
          <div className="h-[380px] md:h-[480px] bg-gray-200" />
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/3" />
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
        </main>
      }
    >
      <ExpertsPageInner />
    </Suspense>
  );
}
