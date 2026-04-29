import { getDiscoverProgramsForTopCards } from "@/lib/discoverProgramsApi";
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
  title: "Zeefit",
  description:
    "The curated marketplace connecting high-performance athletes with elite-level coaches. Dynamic, editorial-grade training.",
};

/** Revalidate ISR (programs block uses getDiscoverProgramsForTopCards with same interval). */
export const revalidate = 600;

export default async function ClientLandingPage() {
  const topPrograms =
    (await getDiscoverProgramsForTopCards({ limit: 6, revalidate: 600 })) ??
    null;

  return (
    <main className="min-h-screen bg-white font-lato text-neutral-900">
      <HeroSection />
      <PrecisionSelectionSection />
      <TopProgramsSection programs={topPrograms} />
      <CuratedEliteSection />
      <MomentumSection />
      <ClientResultsSection />
      <FinalCtaSection />
    </main>
  );
}
