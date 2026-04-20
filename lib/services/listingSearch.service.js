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
      state = "",
      country = "",
      expertiseTags = [],
      consultationMode = "",
      clientLocation = null,
      radiusKm = "",
      page = 1,
      languages = [],
      nameQuery = "",
      certificationQuery = "",
    } = params;

    const payload = {
      city,
      state: typeof state === "string" ? state.trim() : "",
      country: typeof country === "string" ? country.trim() : "",
      expertiseTags,
      consultationMode,
      radiusKm,
      page,
      languages: Array.isArray(languages) ? languages : [],
      nameQuery: typeof nameQuery === "string" ? nameQuery.trim() : "",
      certificationQuery:
        typeof certificationQuery === "string" ? certificationQuery.trim() : "",
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

  console.log("Here is the Params ", params);
  return ListingSearchService.search(params);
}
