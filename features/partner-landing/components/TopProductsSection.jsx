"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { ProgramsListingService } from "../services/ProgramsListingService";
import { ProductCardPresenter } from "../presenters/ProductCardPresenter";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductCard({ item }) {
  const canBuy = Boolean(item.redirectUrl);
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-60 w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = "/not-found.png";
          }}
        />
        {Array.isArray(item.badges) && item.badges.length > 0 ? (
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {item.badges.map((badge) => (
              <span
                key={`${item.id}-${badge.label}`}
                className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${
                  badge.tone === "success"
                    ? "bg-[#0f6a2f] text-white"
                    : "bg-white/95 text-(--brand-primary)"
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold leading-tight text-gray-900">
          {item.title}
        </h3>
        <p className="text-sm font-semibold text-[#DE3837]">{item.leadBy}</p>
        <div className="space-y-2 pt-1">
          {item.points.map((point, index) => (
            <p
              key={`${item.id}-point-${index}`}
              className="flex items-start gap-2 text-[11px] text-[#4a4a4a]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white fill-[#DE3837]" fill />
              <span>{point}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="flex items-end justify-between border-t border-gray-100 px-4 py-3">
        <p className="leading-none">
          <span className="text-xl font-black text-(--brand-primary)">
            {item.priceText}
          </span>
          <span className="ml-2 text-sm text-gray-500">/month</span>
        </p>
        {canBuy ? (
          <Button
            onClick={() => {
              window.open(item.redirectUrl, "_blank", "noopener,noreferrer");
            }}
            className="bg-(--brand-primary) text-sm font-semibold text-white p-5 transition hover:opacity-90"
          >
            Buy Now
          </Button>
        ) : (
          <Button
            className="cursor-not-allowed bg-(--brand-primary)/60 p-5 text-sm font-semibold text-white"
            disabled
          >
            Buy Now
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * Partner products section.
 */
export default function TopProductsSection({ partner }) {
  const service = new ProgramsListingService({ partner });
  const { data, isLoading, mutate } = useSWR(
    ["partner-products", partner],
    async () => service.fetchTopProducts(),
  );

  useEffect(() => {
    const handlePageShow = () => {
      mutate();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [mutate]);

  const products = Array.isArray(data?.products)
    ? data.products.map((item) => ProductCardPresenter.toCard(item))
    : [];

  if (isLoading) {
    return (
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-4xl font-black">
            <span className="text-red-700">Our Top</span> Products
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center text-4xl font-black">
          <span className="text-red-700">Our Top</span> Products
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
