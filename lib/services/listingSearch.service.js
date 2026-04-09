import { fetchAPI } from "../api";

/**
 * Calls POST /experts/listing/search and returns paid / free buckets (not merged).
 * @see wellnessz_backend listingSearch.controller.js
 */
export class ListingSearchService {
  /**
   * @param {import("./listingSearch.types").ListingSearchParams} params
   * @returns {Promise<import("./listingSearch.types").ListingSearchResult>}
   */
  static async search(params = {}) {
    const {
      city = "",
      expertiseTags = [],
      consultationMode = "",
      clientLocation = null,
      radiusKm = "",
      page = 1,
      languages = [],
    } = params;

    const payload = {
      city,
      expertiseTags,
      consultationMode,
      radiusKm,
      page,
      languages: Array.isArray(languages) ? languages : [],
    };

    if (
      clientLocation?.coordinates &&
      Array.isArray(clientLocation.coordinates) &&
      clientLocation.coordinates.length === 2
    ) {
      payload.clientLocation = clientLocation;
    }

    const raw = await fetchAPI(`/experts/listing/search`, payload, "POST");
    return {
      paid: Array.isArray(raw?.paid) ? raw.paid : [],
      free: Array.isArray(raw?.free) ? raw.free : [],
      meta: raw?.meta && typeof raw.meta === "object" ? raw.meta : {},
    };
  }
}

export async function searchListings(params) {
  return ListingSearchService.search(params);
}
