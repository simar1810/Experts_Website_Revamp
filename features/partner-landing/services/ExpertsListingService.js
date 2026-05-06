/**
 * Fetches public experts for partner landing.
 */
export class ExpertsListingService {
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
   * @returns {string}
   */
  getSearchUrl() {
    return `${String(this.baseUrl).replace(/\/$/, "")}/experts/listing/search`;
  }

  /**
   * @returns {Record<string, string>}
   */
  getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.partner ? { "x-tenant": this.partner } : {}),
    };
  }

  /**
   * @returns {Promise<{experts: Array, error: string | null}>}
   */
  async fetchTopExperts() {
    let timeout = null;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);
      const response = await fetch(this.getSearchUrl(), {
        method: "POST",
        headers: this.getHeaders(),
        signal: controller.signal,
        body: JSON.stringify({
          city: "",
          consultationMode: "both",
          expertiseTags: [],
          languages: [],
          radiusKm: "",
          page: 1,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        return {
          experts: [],
          error: body?.message || `Failed to load experts (${response.status})`,
        };
      }
      const freeExperts = Array.isArray(body?.free) ? body.free : [];
      const paidExperts = Array.isArray(body?.paid) ? body.paid : [];
      return {
        experts: [...paidExperts, ...freeExperts].slice(0, 3),
        error: null,
      };
    } catch (error) {
      return { experts: [], error: error?.message || "Failed to load experts" };
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
