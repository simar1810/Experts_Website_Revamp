"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getProductImageSrc,
  getProductPriceDisplay,
} from "@/lib/partnerProductsApi";
import ProductDetailImage from "./ProductDetailImage";

function partnerDisplayName(partner) {
  return (
    partner?.branding?.displayName ||
    partner?.name ||
    "WellnessZ Partner"
  );
}

function partnerLogo(partner) {
  const logo = partner?.branding?.logo;
  return typeof logo === "string" && logo.trim() ? logo.trim() : "";
}

function ProductCard({ partner, product }) {
  const href = `/collections/${partner.slug}/${product.slug}`;
  const imageSrc = getProductImageSrc(product);
  const displayName = partnerDisplayName(partner);
  const { payLabel, listLabel } = getProductPriceDisplay(product);

  return (
    <article className="group w-[184px] shrink-0 sm:w-[216px] lg:w-[240px]">
      <Link
        href={href}
        className="block rounded-[10px] outline-none transition focus-visible:ring-2 focus-visible:ring-[#84cc16] focus-visible:ring-offset-4"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-[10px] bg-[#f3f8e7]">
          <ProductDetailImage
            src={imageSrc}
            alt={product.name || "Partner product"}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.featured ? (
            <span className="absolute right-3 top-3 rounded-[3px] bg-[#357200] px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-white">
              Top Pick
            </span>
          ) : null}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-3 border-b border-[#eef1e9] pb-4">
        <Link href={href} className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-tight tracking-[-0.04em] text-[#273617] transition group-hover:text-[#5cae20]">
            {product.name || "Wellness product"}
          </h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[12px] font-bold leading-none text-[#7d846e]">
            {listLabel ? (
              <span className="text-[11px] font-semibold text-[#b5baa9] line-through">
                {listLabel}
              </span>
            ) : null}
            <span>{payLabel}</span>
          </p>
        </Link>
        
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <div className="relative size-6 overflow-hidden rounded-full bg-[#e9f7d7]">
          {partnerLogo(partner) ? (
            <Image
              src={partnerLogo(partner)}
              alt={displayName}
              fill
              unoptimized
              className="object-cover"
              sizes="24px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#102411] text-[9px] font-black text-[#95e35a]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7a806f]">
          By {displayName}
        </p>
      </div>
    </article>
  );
}

export default function ProductCarousel({ partner, products }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, products.length]);

  function scrollProducts(direction) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.8, 260),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {canScrollLeft ? (
        <button
          type="button"
          aria-label="Scroll products left"
          onClick={() => scrollProducts(-1)}
          className="absolute left-0 top-[40%] z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#dfe8d3] bg-white text-[#426b16] shadow-[0_10px_24px_rgba(38,54,22,0.14)] transition hover:bg-[#f6ffe8]"
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          aria-label="Scroll products right"
          onClick={() => scrollProducts(1)}
          className="absolute right-0 top-[40%] z-10 flex size-10 translate-x-1/2 items-center justify-center rounded-full border border-[#dfe8d3] bg-white text-[#426b16] shadow-[0_10px_24px_rgba(38,54,22,0.14)] transition hover:bg-[#f6ffe8]"
        >
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex gap-7 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard
            key={product._id || product.slug}
            partner={partner}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
