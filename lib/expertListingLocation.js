import { slugifySegment } from "@/lib/slugifyPathSegment";

/**
 * Location segment for profile URLs and pool matching — one precedence for listing/search rows.
 */
export function listingLocationSlug(expert) {
  const city =
    expert?.city ??
    expert?.expertDetails?.city ??
    expert?.coach?.city ??
    "";
  const state = expert?.state ?? expert?.expertDetails?.state ?? "";
  return slugifySegment(city || state || "unknown");
}
