import { fetchPartnerProductsForMarketplace } from "@/lib/partnerProductsApi";

/**
 * Fetches partner-facing product/program cards for landing.
 */
export class ProgramsListingService {
  /**
   * @param {Object} options
   * @param {string | null} [options.partner]
   * @param {string} [options.baseUrl]
   */
  constructor({ partner = null, baseUrl } = {}) {
    this.partner = partner;
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    this.requestTimeoutMs = 12000;
  }

  /**
   * @returns {Promise<{products: Array, error: string | null}>}
   */
  async fetchTopProducts() {
    let timeout = null;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);
      const items = await fetchPartnerProductsForMarketplace({
        headers: this.partner ? { "x-tenant": this.partner } : {},
        signal: controller.signal,
      });
      const products = [];
      const normalizedPartner = String(this.partner || "").trim().toLowerCase();

      for (const item of Array.isArray(items) ? items : []) {
        const itemPartner = item?.partner || {};
        const partnerSlug = String(itemPartner?.slug || "").trim().toLowerCase();
        const partnerSubdomain = String(itemPartner?.subdomain || "").trim().toLowerCase();
        if (
          normalizedPartner &&
          normalizedPartner !== partnerSlug &&
          normalizedPartner !== partnerSubdomain
        ) {
          continue;
        }
        const itemProducts = Array.isArray(item?.products) ? item.products : [];
        products.push(...itemProducts);
      }
      return { products: products.slice(0, 3), error: null };
    } catch (error) {
      return { products: [], error: error?.message || "Failed to load products" };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
