"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import { getFilteredExperts } from "@/lib/experts_fetch";
import { ExpertList, CategoriesFilter, Filters } from "./_components";

function ExpertsPageInner() {
  const searchParams = useSearchParams();
  const specialityFromUrl = searchParams.get("speciality")?.trim() ?? "";
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [page, setPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleSearch = async () => {
    setPage(1);
    const experts = await getFilteredExperts({
      city: locationQuery,
      expertiseTags: selectedSpecialities,
    });
    setFilteredExperts(Array.isArray(experts) ? experts : []);
  };

  useEffect(() => {
    const tags = specialityFromUrl ? [specialityFromUrl] : [];
    setSelectedSpecialities(tags);
    (async () => {
      const experts = await getFilteredExperts({
        city: "",
        expertiseTags: tags,
      });
      setFilteredExperts(Array.isArray(experts) ? experts : []);
    })();
  }, [specialityFromUrl]);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[450px] flex flex-col items-center justify-center text-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 overflow-hidden"
          style={{
            backgroundImage: "url('/images/gym-bg.png')",
            filter: "blur(6px) brightness(0.4)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto space-y-3 sm:space-y-6 pt-6">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find the right <span className="text-[#84cc16]">Expert</span> for
            your Health
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-white/80 text-[10px] sm:text-sm md:text-base leading-relaxed font-medium max-w-lg mx-auto line-clamp-2 sm:line-clamp-none">
              "Search from 7,000+ verified wellness experts and connect with the
              right expert for your health goals."
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mt-4 md:mt-8">
            <SearchFilters
              selectedSpecialities={selectedSpecialities}
              setSelectedSpecialities={setSelectedSpecialities}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              onSearch={handleSearch}
              theme="light"
              containerClassName="bg-white rounded-xl p-1 shadow-2xl w-full border border-white/10"
              inputWrapperClassName="border-b lg:border-b-0 lg:border-r border-gray-100 py-2 sm:py-3"
              buttonClassName="bg-[#84cc16] hover:bg-[#76b813] text-white px-8 py-2.5 rounded-lg font-black text-xs sm:text-sm w-full lg:w-auto"
              buttonText="Search Experts"
              specialityIconColor="text-gray-300"
              locationIconColor="text-gray-300"
            />
          </div>
        </div>
      </section>

      <CategoriesFilter
        setFilteredExperts={setFilteredExperts}
        setSelectedSpecialities={setSelectedSpecialities}
      />

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 pb-24">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#84cc16] rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20">
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

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar */}
          <aside
            className={`w-full lg:w-[320px] shrink-0 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}
          >
            <Filters
              filteredExperts={filteredExperts}
              setFilteredExperts={setFilteredExperts}
              filteredExpertsCount={filteredExperts.length}
              selectedSpecialities={selectedSpecialities}
              locationQuery={locationQuery}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

          {/* Right Results */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-10 lg:mb-12">
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {filteredExperts.length > 0
                  ? "Expert Coaches"
                  : "No Experts Found"}
              </h2>
              <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold opacity-80">
                Top rated wellness experts available for you
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <ExpertList experts={filteredExperts} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ExpertsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white overflow-x-hidden font-sans animate-pulse">
          <div className="h-[320px] md:h-[450px] bg-gray-200" />
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
