import { prettyExpertProfileUrlFromListingLike } from "@/lib/prettyExpertProfileUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80";

/**
 * Map a `/experts` static featured entry → `CoachShowcaseCard` props.
 * @param {object} expert
 * @param {number} [stableIndex]
 */
export function featuredStaticExpertToCoachShowcase(expert, stableIndex = 0) {
  const rawName =
    (typeof expert?.coach?.name === "string" && expert.coach.name.trim()) ||
    "Expert";
  const name = rawName.toUpperCase();

  const specs = Array.isArray(expert?.specializations)
    ? expert.specializations.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const title = specs[0] || "Wellness expert";

  const tags = specs.slice(0, 2).map((label, i) => ({
    label: label.toUpperCase(),
    variant: i === 0 ? "lime" : "muted",
  }));

  const photo = String(expert?.coach?.profilePhoto ?? "").trim();
  const imageSrc = photo || FALLBACK_IMAGE;

  const id = String(
    expert?._id ?? `featured-${stableIndex}-${rawName.replace(/\s+/g, "-")}`,
  );
  const listingHref = expert?._id
    ? prettyExpertProfileUrlFromListingLike(expert)
    : "/find-experts";

  return {
    id,
    name,
    title,
    tags,
    imageSrc,
    imageAlt: `${rawName} — wellness expert`,
    listingHref,
    imageUnoptimized: !imageSrc.includes("images.unsplash.com"),
  };
}
