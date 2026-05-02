import { listingLocationSlug } from "@/lib/expertListingLocation";
import { slugifySegment } from "@/lib/slugifyPathSegment";

/**
 * Best-effort profile URL (`/{city}/{spec}/{name}-1`) from listing/search row shape.
 * Ordinals may differ from `profile-paths` when names collide; prefer the batch API on lists.
 */
export function prettyExpertProfileUrlFromListingLike(expert) {
  if (!expert || typeof expert !== "object") return "/find-experts";
  const loc = listingLocationSlug(expert);
  const specs = expert.specializations || expert.expertiseTags || [];
  const name = expert.name || expert.coach?.name || "";
  const spec = slugifySegment(specs[0] || "expert");
  const base = slugifySegment(name || "expert");
  return `/${loc}/${spec}/${base}-1`;
}
