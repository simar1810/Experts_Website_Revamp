import { fetchAPI } from "./api";

/** Unwrap `/experts/listing/search` payloads — API may use free/paid buckets or a flat array / items. */
function normalizeListingSearchResponse(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "object") return [];
  const free = Array.isArray(raw.free) ? raw.free : [];
  const paid = Array.isArray(raw.paid) ? raw.paid : [];
  const fromBuckets = [...free, ...paid];
  if (fromBuckets.length > 0) return fromBuckets;
  if (Array.isArray(raw.experts)) return raw.experts;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.results)) return raw.results;
  if (Array.isArray(raw.listings)) return raw.listings;
  if (Array.isArray(raw.data)) return raw.data;
  return [];
}

export async function getFilteredExperts({
  city = "",
  expertiseTags = [],
  consultationMode = "",
  clientLocation = null,
  radiusKm = "",
  page = 1,
  languages = [],
} = {}) {
  try {
    const payload = {
      city,
      expertiseTags,
      consultationMode,
      radiusKm,
      page,
      languages: Array.isArray(languages) ? languages : [],
    };
    // Backend uses 2dsphere $geoNear when clientLocation + consultationMode in_person|both
    if (
      clientLocation?.coordinates &&
      Array.isArray(clientLocation.coordinates) &&
      clientLocation.coordinates.length === 2
    ) {
      payload.clientLocation = clientLocation;
    }
    const experts = await fetchAPI(`/experts/listing/search`, payload, "POST");
    return normalizeListingSearchResponse(experts);
  } catch (err) {
    console.error("Search failed:", err);
    return [];
  }
}
