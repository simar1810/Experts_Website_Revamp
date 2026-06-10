"use client";

import { PartnerLandingTheme } from "../domain/PartnerLandingTheme";
import {
  getFindExpertsPageUrl,
  getShopMarketplaceUrl,
} from "@/lib/partnerLandingNav";

const ctaLinkClass = {
  products:
    "rounded-md bg-white px-4 py-2 text-xs font-semibold text-purple-800 transition hover:bg-purple-100",
  experts:
    "rounded-md border border-white px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10",
};

/**
 * Bottom conversion CTA — Explore Products → shop marketplace; Explore Experts → /find-experts on main site.
 */
export default function PartnerCtaSection() {
  const shopUrl = getShopMarketplaceUrl();
  const findExpertsUrl = getFindExpertsPageUrl();

  return (
    <section
      className="px-4 py-12 text-center text-white sm:px-6"
      style={{
        background: "linear-gradient(180deg, #63359B 0%, #340073 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <h3 className="text-3xl font-black leading-tight">
          {PartnerLandingTheme.CTA_TITLE}
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/50">
          {PartnerLandingTheme.CTA_DESCRIPTION}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href={shopUrl} className={ctaLinkClass.products}>
            Explore Products
          </a>
          <a href={findExpertsUrl} className={ctaLinkClass.experts}>
            Explore Experts
          </a>
        </div>
      </div>
    </section>
  );
}
