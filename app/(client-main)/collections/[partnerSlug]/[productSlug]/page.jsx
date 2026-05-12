import Image from "next/image";
import { notFound } from "next/navigation";
import { Dumbbell, Layers, ShieldCheck } from "lucide-react";
import ProductCheckout from "../../_components/ProductCheckout";
import {
  fetchPartnerProductDetail,
  getProductDescriptionHighlights,
  getProductDetailLabel,
  getProductImageSrc,
  getProductPriceDisplay,
  getProductTechnicalItems,
} from "@/lib/partnerProductsApi";

export const dynamic = "force-dynamic";

const fetchInit = { cache: "no-store" };

function partnerDisplayName(partner) {
  return (
    partner?.branding?.displayName ||
    partner?.name ||
    "WellnessZ Partner"
  );
}

async function getProduct(params) {
  const resolvedParams = await params;
  try {
    return await fetchPartnerProductDetail(
      {
        partnerSlug: resolvedParams?.partnerSlug,
        productSlug: resolvedParams?.productSlug,
      },
      fetchInit,
    );
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }) {
  const { partner, product } = await getProduct(params);
  const title = `${product.name || "Product"} | Collections`;
  const description =
    product.shortDescription ||
    product.description ||
    `Explore ${product.name || "this product"} from ${partnerDisplayName(partner)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [getProductImageSrc(product)],
    },
  };
}

function ProductImage({ product }) {
  return (
    <div className="rounded-[6px] bg-[#edffd0] p-3">
      <div className="relative aspect-[1.19/1] overflow-hidden rounded-[6px] bg-[#101910]">
        <Image
          src={getProductImageSrc(product)}
          alt={product.name || "Partner product"}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 92vw, 54vw"
        />
      </div>
    </div>
  );
}

function TechnicalItems({ items }) {
  const icons = [Dumbbell, Layers, ShieldCheck];

  if (!items.length) return null;

  return (
    <section className="border-t border-[#edf1e8] pt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#263616]">
        Technical Components
      </p>
      <div className="mt-7 space-y-7">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={`${item.title}-${index}`} className="flex gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eeffc7] text-[#426b16]">
                <Icon className="size-4" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[13px] font-black leading-tight tracking-[-0.04em] text-[#263616]">
                  {item.title}
                </h2>
                {item.description ? (
                  <p className="mt-1 max-w-[360px] text-[11px] leading-[1.35] text-[#8a907d]">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params, searchParams }) {
  const resolvedSearch = (await searchParams) || {};
  const initialCouponCode =
    typeof resolvedSearch.coupon === "string" ? resolvedSearch.coupon : "";

  const { partner, product } = await getProduct(params);
  const { payLabel: price, listLabel: listPrice } = getProductPriceDisplay(product, {
    fallback: "",
  });
  const label = getProductDetailLabel(product);
  const technicalItems = getProductTechnicalItems(product);
  const descriptionHighlights = getProductDescriptionHighlights(product);

  const fallbackTechnicalItems = descriptionHighlights.map((description, index) => ({
    title: index === 0 ? "Performance Ready" : "Built for Daily Use",
    description,
  }));

  return (
    <main className="min-h-screen bg-white font-lato text-[#263616]">
      <div className="mx-auto max-w-[1120px] px-6 pb-16 pt-11 sm:px-10 lg:px-[72px]">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)] lg:gap-14 xl:gap-[72px]">
          <div>
            <ProductImage product={product} />

            {product.description ? (
              <p className="mt-8 max-w-[620px] text-[17px] font-medium leading-[1.45] text-[#9a9f92]">
                {product.description}
              </p>
            ) : null}
          </div>

          <aside className="lg:pt-0">
            <p className="text-[12px] font-black uppercase tracking-[0.34em] text-[#5d8b35]">
              {label}
            </p>
            <h1 className="mt-6 text-[42px] font-black leading-[1.04] text-[#263616] sm:text-[56px] lg:text-[58px]">
              {product.name || "Partner Product"}
            </h1>
            {product.shortDescription ? (
              <p className="mt-7 max-w-[400px] text-[17px] font-medium leading-normal text-[#8f9487]">
                {product.shortDescription}
              </p>
            ) : null}

            <div className="mt-8">
              {price ? (
                <p className="text-[38px] font-black leading-none text-[#263616]">
                  {listPrice ? (
                    <span className="mr-3 text-[26px] font-bold text-[#9a9f92] line-through">
                      {listPrice}
                    </span>
                  ) : null}
                  <span>{price}</span>
                  <span className="ml-2 align-middle text-[12px] font-black tracking-[0.16em] text-[#59604e]">
                    (inclusive of all Taxes)
                  </span>
                </p>
              ) : (
                <p className="text-[34px] font-black tracking-[-0.08em] text-[#263616]">
                  Price on request
                </p>
              )}
            </div>

            <div className="mt-12">
              <ProductCheckout
                partner={partner}
                product={product}
                price={price}
                initialCouponCode={initialCouponCode}
              />
            </div>

            <div className="mt-20">
              <TechnicalItems
                items={
                  technicalItems.length ? technicalItems : fallbackTechnicalItems
                }
              />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
