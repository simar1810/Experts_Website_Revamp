import ProductCarousel from "./ProductCarousel";

function partnerDisplayName(partner) {
  return (
    partner?.branding?.displayName ||
    partner?.name ||
    "WellnessZ Partner"
  );
}

export default function PartnerProductCollectionSection({ partner, products }) {
  return (
    <section className="scroll-mt-28">
      <div className="mb-10">
        <h2 className="text-[24px] font-black uppercase leading-none text-[#263616]">
          Products by {partnerDisplayName(partner)}
        </h2>
      </div>

      <ProductCarousel partner={partner} products={products} />
    </section>
  );
}
