import CollectionEmptyState from "./_components/CollectionEmptyState";
import CollectionErrorMessage from "./_components/CollectionErrorMessage";
import CollectionsList from "./_components/CollectionsList";
import { fetchPartnerProductCollections } from "@/lib/partnerProductsApi";

export const metadata = {
  title: "Collections | WellnessZ Experts",
  description:
    "Browse handpicked wellness products from WellnessZ expert partners.",
};

export const dynamic = "force-dynamic";

const fetchInit = { cache: "no-store" };

export default async function CollectionsPage() {
  let items = [];
  let error = "";

  try {
    items = await fetchPartnerProductCollections(fetchInit);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Could not load product collections.";
  }

  return (
    <main className="min-h-screen font-lato bg-white text-[#263616]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-10 lg:px-[72px]">
        <CollectionErrorMessage message={error} />

        {!items.length ? (
          <CollectionEmptyState />
        ) : (
          <CollectionsList items={items} />
        )}
      </section>
    </main>
  );
}
