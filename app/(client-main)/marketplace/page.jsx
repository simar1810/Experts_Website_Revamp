import MarketplaceEmptyState from "./_components/MarketplaceEmptyState";
import MarketplaceErrorMessage from "./_components/MarketplaceErrorMessage";
import MarketplaceList from "./_components/MarketplaceList";
import { fetchPartnerProductsForMarketplace } from "@/lib/partnerProductsApi";

export const metadata = {
  title: "Marketplace | WellnessZ Experts",
  description:
    "Browse handpicked wellness products from WellnessZ expert partners.",
};

export const dynamic = "force-dynamic";

const fetchInit = { cache: "no-store" };

export default async function MarketplacePage() {
  let items = [];
  let error = "";

  try {
    items = await fetchPartnerProductsForMarketplace(fetchInit);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Could not load the marketplace.";
  }

  return (
    <main className="min-h-screen font-lato bg-white text-[#263616]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-10 lg:px-[72px]">
        <MarketplaceErrorMessage message={error} />

        {!items.length ? (
          <MarketplaceEmptyState />
        ) : (
          <MarketplaceList items={items} />
        )}
      </section>
    </main>
  );
}
