import { DiscoverHero } from "./_components/DiscoverHero";
import { TopSellingProgramsSection } from "./_components/TopSellingProgramsSection";

export const metadata = {
  title: "Discover Programs | WellnessZ Experts",
  description:
    "Browse curated wellness programs: filter by specialty, duration, and price. Enroll in top-rated expert-led pathways.",
};

export default function DiscoverProgramsPage() {
  return (
    <main className="min-h-screen bg-white font-lato text-neutral-900">
      <DiscoverHero />
      <TopSellingProgramsSection />
    </main>
  );
}
