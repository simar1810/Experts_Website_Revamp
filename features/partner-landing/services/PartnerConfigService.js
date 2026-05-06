import { PartnerLandingTheme } from "../domain/PartnerLandingTheme";

/**
 * Reads partner branding/config from public partner endpoint.
 */
export class PartnerConfigService {
  /**
   * @param {Object} options
   * @param {string | null} [options.partner] Partner slug/subdomain.
   * @param {string} [options.baseUrl] API base URL.
   */
  constructor({ partner = null, baseUrl } = {}) {
    this.partner = partner;
    this.baseUrl =
      baseUrl ||
      process.env.NEXT_PUBLIC_PARTNER_ENDPOINT ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080/api";
  }

  /**
   * @returns {string}
   */
  getConfigUrl() {
    return `${String(this.baseUrl).replace(/\/$/, "")}/experts/public/config`;
  }

  /**
   * @returns {Record<string, string>}
   */
  getTenantHeaders() {
    return this.partner ? { "x-tenant": this.partner } : {};
  }

  /**
   * @returns {Promise<{partner: Object | null, message?: string}>}
   */
  async fetchPublicConfig() {
    const response = await fetch(this.getConfigUrl(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...this.getTenantHeaders(),
      },
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        partner: null,
        message:
          body?.message || `Failed to load partner config (${response.status})`,
      };
    }

    if (body?.message === "Partner not found") {
      return { partner: null, message: body.message };
    }

    return {
      partner: body?.partner || null,
      message: body?.message || "",
    };
  }

  /**
   * @param {Object | null} partnerConfig
   * @returns {{primaryColor: string, secondaryColor: string, displayName: string, logo: string}}
   */
  getBrandingFallbacks(partnerConfig) {
    const branding =
      partnerConfig && typeof partnerConfig === "object"
        ? partnerConfig.branding || {}
        : {};

    return {
      primaryColor: branding.primaryColor || PartnerLandingTheme.DEFAULT_PRIMARY,
      secondaryColor:
        branding.secondaryColor || PartnerLandingTheme.DEFAULT_SECONDARY,
      displayName:
        branding.displayName || partnerConfig?.name || PartnerLandingTheme.DEFAULT_DISPLAY_NAME,
      logo: branding.logo || PartnerLandingTheme.DEFAULT_LOGO,
    };
  }
}
