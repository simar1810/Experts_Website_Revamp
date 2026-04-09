/** Map `/experts/listing/search` listings → props for `CoachShowcaseCard`. */

import { prettyExpertProfileUrlFromListingLike } from "@/lib/prettyExpertProfileUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80";

export function resolveListingId(expert) {
  if (!expert || typeof expert !== "object") return "";
  return String(
    expert.listingId ??
      expert.expertListingId ??
      expert.listing?._id?.toString?.() ??
      expert.listing?._id ??
      expert._id?.toString?.() ??
      expert._id ??
      expert.id ??
      expert.coach?._id?.toString?.() ??
      expert.coach?._id ??
      "",
  ).trim();
}

/** De-dupe raw listings (e.g. paid bucket) by listing id. */
export function dedupeListingsByListingId(listings) {
  const seen = new Set();
  const out = [];
  for (const e of listings || []) {
    const id = resolveListingId(e);
    const key = id || `anon-${out.length}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

/**
 * @param {Record<string, unknown>} expert
 * @param {number} stableIndex — for stable fallback `id` when listing id missing
 */
export function listingToCoachShowcaseProps(expert, stableIndex = 0) {
  const rawName = String(
    expert.name ?? expert.coach?.name ?? "Expert",
  ).trim() || "Expert";
  const specsRaw = expert.specializations ?? expert.expertiseTags ?? [];
  const specs = Array.isArray(specsRaw)
    ? specsRaw.map((s) => String(s).trim()).filter(Boolean)
    : [];

  let title = "Wellness expert";
  if (specs.length > 2) {
    title = `${specs[0]}, ${specs[1]} & more`;
  } else if (specs.length === 2) {
    title = `${specs[0]}, ${specs[1]}`;
  } else if (specs.length === 1) {
    title = specs[0];
  }

  const years = expert.yearsExperience;
  const y = typeof years === "number" ? years : parseInt(String(years), 10);
  if (Number.isFinite(y) && y > 0) {
    title =
      specs.length > 0 ? `${title} · ${y}+ yrs` : `${y}+ years experience`;
  }

  const tags = specs.slice(0, 2).map((label, i) => ({
    label: label.toUpperCase(),
    variant: i === 0 ? "lime" : "muted",
  }));

  const photo = String(
    expert.profilePhoto ?? expert.coach?.profilePhoto ?? "",
  ).trim();
  const imageSrc = photo || FALLBACK_IMAGE;

  const listingId = resolveListingId(expert);
  const id = listingId || `showcase-${stableIndex}-${rawName.replace(/\s+/g, "-")}`;
  const listingHref = listingId
    ? prettyExpertProfileUrlFromListingLike(expert)
    : "/find-experts";

  return {
    id,
    name: rawName.toUpperCase(),
    title,
    tags,
    imageSrc,
    imageAlt: `${rawName} — wellness expert`,
    listingHref,
    imageUnoptimized: !imageSrc.includes("images.unsplash.com"),
  };
}

/**
 * Round-robin into columns so the same expert never appears twice in one column.
 * @returns {Array<Array<ReturnType<typeof listingToCoachShowcaseProps>>>}
 */
export function paidListingsToCoachColumns(paid, columnCount = 3) {
  const unique = dedupeListingsByListingId(paid);
  const columns = Array.from({ length: columnCount }, () => []);
  unique.forEach((expert, i) => {
    const props = listingToCoachShowcaseProps(expert, i);
    columns[i % columnCount].push(props);
  });
  return columns;
}

/** Same round-robin for static/fallback coach prop objects (already shaped for the card). */
export function partitionCoachPropsIntoColumns(coaches, columnCount = 3) {
  const columns = Array.from({ length: columnCount }, () => []);
  (coaches || []).forEach((coach, i) => {
    columns[i % columnCount].push(coach);
  });
  return columns;
}

/** Row-major order for mobile carousel: col0[0], col1[0], col2[0], col0[1], … */
export function interleaveCoachColumns(columns) {
  const max = Math.max(0, ...columns.map((c) => c.length));
  const out = [];
  for (let i = 0; i < max; i++) {
    for (let j = 0; j < columns.length; j++) {
      if (columns[j][i]) out.push(columns[j][i]);
    }
  }
  return out;
}
