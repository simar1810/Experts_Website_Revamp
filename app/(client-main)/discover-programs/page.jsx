import { DiscoverHero } from "./_components/DiscoverHero";
import { TopSellingProgramsSection } from "./_components/TopSellingProgramsSection";

export const metadata = {
  title: "Discover Programs | Zeefit",
  description:
    "Browse curated wellness programs: filter by specialty, duration, and price. Enroll in top-rated expert-led pathways.",
};

function firstSearchParamValue(value) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function DiscoverProgramsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialSearch = firstSearchParamValue(params.search);
  const initialProgramId = firstSearchParamValue(params.programId);

  return (
    <main className="min-h-screen bg-white font-lato text-neutral-900">
      <DiscoverHero />
      <TopSellingProgramsSection
        initialSearch={initialSearch}
        initialProgramId={initialProgramId}
      />
    </main>
  );
}
