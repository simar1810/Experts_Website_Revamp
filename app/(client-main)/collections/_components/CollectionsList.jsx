import PartnerProductCollectionSection from "./PartnerProductCollectionSection";

export default function CollectionsList({ items }) {
  return (
    <div className="space-y-[72px]">
      {items.map((item) => {
        const partner = item.partner || {};
        const products = Array.isArray(item.products) ? item.products : [];

        return (
          <PartnerProductCollectionSection
            key={partner._id || partner.slug}
            partner={partner}
            products={products}
          />
        );
      })}
    </div>
  );
}
