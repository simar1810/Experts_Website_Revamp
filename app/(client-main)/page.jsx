import dynamic from "next/dynamic";
import { getDiscoverProgramsForTopCards } from "@/lib/discoverProgramsApi";
import { HeroSection, SecondaryHeroSection } from "./_components/landing";
import { LandingSectionSkeleton } from "./_components/landing/LandingSectionSkeleton";

const SITE_URL_RAW =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeefit.in";

const SITE_URL_NORMALIZED = SITE_URL_RAW.replace(/\/$/, "");

const PrecisionSelectionSection = dynamic(
  () =>
    import("./_components/landing/PrecisionSelectionSection").then((m) => ({
      default: m.PrecisionSelectionSection,
    })),
  { loading: () => <LandingSectionSkeleton className="my-8" /> },
);

const TopProgramsSection = dynamic(
  () =>
    import("./_components/landing/TopProgramsSection").then((m) => ({
      default: m.TopProgramsSection,
    })),
  { loading: () => <LandingSectionSkeleton className="my-10 bg-emerald-50/80" /> },
);

const CuratedEliteSection = dynamic(
  () =>
    import("./_components/landing/CuratedEliteSection").then((m) => ({
      default: m.CuratedEliteSection,
    })),
  { loading: () => <LandingSectionSkeleton /> },
);

const MomentumSection = dynamic(
  () =>
    import("./_components/landing/MomentumSection").then((m) => ({
      default: m.MomentumSection,
    })),
  { loading: () => <LandingSectionSkeleton className="min-h-80" /> },
);

const ClientResultsSection = dynamic(
  () =>
    import("./_components/landing/ClientResultsSection").then((m) => ({
      default: m.ClientResultsSection,
    })),
  { loading: () => <LandingSectionSkeleton /> },
);

const FinalCtaSection = dynamic(
  () =>
    import("./_components/landing/FinalCtaSection").then((m) => ({
      default: m.FinalCtaSection,
    })),
  { loading: () => <LandingSectionSkeleton /> },
);

const TITLE = "Best Listing Platform for Dietitians & Coaches in India";

const DESCRIPTION =
  "Discover Zeefit by WellnessZ, India's best listing platform for dietitians, nutritionists, wellness coaches, and health professionals to grow and connect with clients.";

export const metadata = {
  metadataBase: new URL(`${SITE_URL_NORMALIZED}/`),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Zeefit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/home/hero-main.png",
        width: 1200,
        height: 630,
        alt: "Athlete training in a gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/home/hero-main.png"],
  },
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
      <SecondaryHeroSection />
      <PrecisionSelectionSection />
      <TopProgramsSection programs={topPrograms} />
      <CuratedEliteSection />
      <MomentumSection />
      <ClientResultsSection />
      <FinalCtaSection />
    </main>
  );
}
