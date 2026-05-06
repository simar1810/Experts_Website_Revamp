import { PartnerLandingTheme } from "../domain/PartnerLandingTheme";

/**
 * Aggregates partner config into a single landing view model.
 */
export class PartnerLandingPresenter {
  /**
   * @param {Object | null} partner
   * @returns {Object}
   */
  static toViewModel(partner) {
    const branding = partner?.branding || {};
    const settings = partner?.settings || {};

    return {
      id: partner?._id || "",
      slug: partner?.slug || "",
      name: partner?.name || PartnerLandingTheme.DEFAULT_DISPLAY_NAME,
      displayName:
        branding?.displayName ||
        partner?.name ||
        PartnerLandingTheme.DEFAULT_DISPLAY_NAME,
      logo: branding?.logo || PartnerLandingTheme.DEFAULT_LOGO,
      favicon: branding?.favicon || "",
      primaryColor: branding?.primaryColor || PartnerLandingTheme.DEFAULT_PRIMARY,
      secondaryColor:
        branding?.secondaryColor || PartnerLandingTheme.DEFAULT_SECONDARY,
      headerHtml: PartnerLandingPresenter.resolveHtmlString(partner?.header),
      footerHtml: PartnerLandingPresenter.resolveHtmlString(partner?.footer),
      showExperts: settings?.showOnlyAssignedExperts !== false,
      showPrograms: settings?.allowPublicPrograms !== false,
    };
  }

  /**
   * @param {string|{__html:string}|unknown} value
   * @returns {string}
   */
  static resolveHtmlString(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && typeof value.__html === "string") {
      return value.__html;
    }
    return "";
  }
}
