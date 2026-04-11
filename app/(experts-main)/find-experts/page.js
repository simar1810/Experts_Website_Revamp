"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import { useValues } from "@/context/valuesContext";
import { useExpertsListingSearch } from "@/hooks/useExpertsListingSearch";
import HeroSearchBar from "./_components/hero/HeroSearchBar";
import HeroCategoryRow from "./_components/hero/HeroCategoryRow";
import TopExpertsSection from "./_components/top-experts/TopExpertsSection";
import ExpertsFiltersSidebar from "./_components/filters/ExpertsFiltersSidebar";
import PopularExpertsSection from "./_components/popular/PopularExpertsSection";
import ExpertsReviewsSection from "./_components/reviews/ExpertsReviewsSection";

function ExpertsPageInner() {
  const searchParams = useSearchParams();
  const specialityFromUrl = searchParams.get("speciality")?.trim() ?? "";
  const locationFromUrl = searchParams.get("location")?.trim() ?? "";
  const [selectedSpecialities, setSelectedSpecialities] = useState(() =>
    specialityFromUrl ? [specialityFromUrl] : [],
  );
  const [locationQuery, setLocationQuery] = useState(locationFromUrl);
  const [searchClientLocation, setSearchClientLocation] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { values } = useValues();

  useEffect(() => {
    setSelectedSpecialities(specialityFromUrl ? [specialityFromUrl] : []);
  }, [specialityFromUrl]);

  useEffect(() => {
    setLocationQuery(locationFromUrl);
  }, [locationFromUrl]);

  const useGeo = searchClientLocation?.coordinates?.length === 2;
  const showDistanceFilter =
    useGeo || (locationQuery || "").trim().length > 0;

  const listing = useExpertsListingSearch({
    selectedSpecialities,
    locationQuery,
    searchClientLocation,
  });

  const handleSearch = async () => {
    await listing.runSearch();
  };

  const locationLabel = useGeo
    ? "your area"
    : (locationQuery || "").trim() || "All Cities";

  const freeCountDisplay =
    listing.meta?.freeReturned ?? listing.free?.length ?? 0;

  return (
    <main className="min-h-screen bg-white overflow-x-hidden font-sans">
      <section className="relative w-full min-h-[380px] md:min-h-[480px] flex flex-col items-center justify-center text-center px-4 pb-10 md:pb-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 overflow-hidden"
          style={{
            backgroundImage: "url('/images/gym-bg.png')",
            filter: "blur(6px) brightness(0.4)",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-3 sm:space-y-5 pt-8 md:pt-10">
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
            clientLocation={searchClientLocation}
            setClientLocation={setSearchClientLocation}
            onSearch={handleSearch}
          />

          <HeroCategoryRow
            categories={values?.expertise_categories || []}
            selectedSpecialities={selectedSpecialities}
            setSelectedSpecialities={setSelectedSpecialities}
          />
        </div>
      </section>

      <TopExpertsSection experts={listing.paid} loading={listing.loading} />

      <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 pb-16">
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#70C136] rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-gray-900 leading-none">
                  Search Filters
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Adjust criteria
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
          <aside
            className={`w-full lg:w-[340px] shrink-0 sticky top-24 self-start ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}
          >
            <ExpertsFiltersSidebar
              showDistanceFilter={showDistanceFilter}
              locationLabel={locationLabel}
              freeCount={freeCountDisplay}
              languages={listing.languages}
              setLanguages={listing.setLanguages}
              // specializations = {listing.specializations}
              // setSpecializations = {listing.setSpecializations}
              selectedSpecialities={selectedSpecialities}
              setSelectedSpecialities={setSelectedSpecialities}
              consultationMode={listing.consultationMode}
              setConsultationMode={listing.setConsultationMode}
              radiusKm={listing.radiusKm}
              setRadiusKm={listing.setRadiusKm}
              clientsRanges={listing.clientsRanges}
              setClientsRanges={listing.setClientsRanges}
              wzAssured={listing.wzAssured}
              setWzAssured={listing.setWzAssured}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

          <PopularExpertsSection
            experts={listing.displayFree}
            loading={listing.loading}
            page={listing.page}
            onPageChange={listing.setPage}
            hasNextPage={listing.hasNextPage}
            hasPrevPage={listing.hasPrevPage}
            totalPages={listing.totalPages}
          />
        </div>
      </section>

      <ExpertsReviewsSection />
    </main>
  );
}

export default function ExpertsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white overflow-x-hidden font-sans animate-pulse">
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
