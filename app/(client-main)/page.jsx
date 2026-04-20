import { searchListings } from "@/lib/services/listingSearch.service";
import { paidListingsToCoachColumns } from "@/lib/curatedShowcaseFromListing";
import {
  CuratedEliteSection,
  FinalCtaSection,
  HeroSection,
  MomentumSection,
  PrecisionSelectionSection,
  TopProgramsSection,
} from "./_components/landing";
import { ClientResultsSection } from "./_components/landing/ClientResultsSection";

export const metadata = {
  title: "WellnessZ Experts | Elite Human Performance",
  description:
    "The curated marketplace connecting high-performance athletes with elite-level coaches. Dynamic, editorial-grade training.",
};

/** Refresh curated experts from search API periodically (not only at build). */
export const revalidate = 600;

export default async function ClientLandingPage() {
  let curatedCoachColumns = null;
  try {
    const { paid } = await searchListings({ page: 1 });
    if (Array.isArray(paid) && paid.length > 0) {
      curatedCoachColumns = paidListingsToCoachColumns(paid, 3);
    }
  } catch {
    curatedCoachColumns = null;
  }

  return (
    <main className="min-h-screen bg-white font-lato text-neutral-900">
      <HeroSection />
      <PrecisionSelectionSection />
      <TopProgramsSection />
      <CuratedEliteSection coachColumns={curatedCoachColumns} />
      <MomentumSection />
      <ClientResultsSection />
      <FinalCtaSection />
    </main>
  );
}
