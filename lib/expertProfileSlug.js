import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import { ListingSearchService } from "@/lib/services/listingSearch.service";
import { slugifySegment } from "@/lib/slugifyPathSegment";

export { slugifySegment } from "@/lib/slugifyPathSegment";

export function titleCaseFromSlug(slug) {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Last `-digits` is the duplicate ordinal (1-based). Name slug may contain hyphens.
 * @returns {{ baseSlug: string, ordinal: number }}
 */
export function parseNameOrdinalSegment(segment) {
  const raw = String(segment || "").trim();
  const m = raw.match(/^(.*)-(\d+)$/);
  if (!m) {
    return { baseSlug: slugifySegment(raw), ordinal: 1 };
  }
  const ordinal = Math.max(1, parseInt(m[2], 10) || 1);
  return { baseSlug: slugifySegment(m[1]), ordinal };
}

function listingLocationSlug(expert) {
  const city = expert?.city ?? expert?.expertDetails?.city ?? "";
  const state = expert?.state ?? expert?.expertDetails?.state ?? "";
  return slugifySegment(city || state || "unknown");
}

function listingSpecSlugFromExpert(expert) {
  const specs = expert.specializations || expert.expertiseTags || [];
  const first = Array.isArray(specs) && specs.length > 0 ? specs[0] : "";
  return slugifySegment(first || "expert");
}

function listingNameBaseSlug(expert) {
  const name = expert.name || expert.coach?.name || "";
  return slugifySegment(name || "expert");
}

export function expertMatchesProfileFilters(
  expert,
  { locationSlug, specSlug, nameBaseSlug },
) {
  if (!expert) return false;
  const loc = listingLocationSlug(expert);
  if (loc !== String(locationSlug || "").toLowerCase()) return false;

  const specs = expert.specializations || expert.expertiseTags || [];
  if (!Array.isArray(specs) || specs.length === 0) {
    if (specSlug !== "expert") return false;
  } else if (!specs.some((t) => slugifySegment(t) === specSlug)) {
    return false;
  }

  return listingNameBaseSlug(expert) === nameBaseSlug;
}

export async function collectAllSearchListings(baseParams) {
  const merged = [];
  const seen = new Set();
  const maxPages = 60;

  for (let page = 1; page <= maxPages; page++) {
    const { paid, free, meta } = await ListingSearchService.search({
      ...baseParams,
      page,
    });
    const chunk = [...(paid || []), ...(free || [])];
    if (chunk.length === 0) break;

    for (const row of chunk) {
      const id = resolveListingId(row);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      merged.push(row);
    }

    const totalPages = Number(
      meta?.freeTotalPages ?? meta?.totalPages ?? meta?.pages ?? 0,
    );
    if (totalPages > 0 && page >= totalPages) break;
    if (chunk.length < 20) break;
  }

  return merged;
}

async function poolForLocationAttempts(locationSlug) {
  const attempts = [
    titleCaseFromSlug(locationSlug),
    locationSlug.replace(/-/g, " "),
    locationSlug,
  ];
  const base = {
    expertiseTags: [],
    consultationMode: "",
    clientLocation: null,
    radiusKm: "",
    languages: [],
  };
  for (const city of attempts) {
    const pool = await collectAllSearchListings({ ...base, city });
    if (pool.length > 0) return pool;
  }
  return [];
}

export async function resolveListingIdFromProfilePath(
  locationSlug,
  specSlug,
  nameSegment,
) {
  const { baseSlug, ordinal } = parseNameOrdinalSegment(nameSegment);
  const pool = await poolForLocationAttempts(String(locationSlug || ""));
  const matches = pool.filter((e) =>
    expertMatchesProfileFilters(e, {
      locationSlug,
      specSlug,
      nameBaseSlug: baseSlug,
    }),
  );
  matches.sort((a, b) =>
    String(resolveListingId(a)).localeCompare(String(resolveListingId(b))),
  );
  const pick = matches[ordinal - 1];
  return pick ? resolveListingId(pick) : "";
}

/**
 * @param {string} listingId
 * @param {unknown} detailsPayload — body from `/experts/listing/public/details`
 * @param {unknown[]} pool — merged search rows for that listing's city
 */
export function profilePathFromDetailsAndPool(
  listingId,
  detailsPayload,
  pool,
) {
  const id = String(listingId || "").trim();
  const coach = detailsPayload?.coach || {};
  const details = detailsPayload?.expertDetails || {};
  const city = String(details.city || "").trim();
  const name = String(coach.name || "").trim();
  const specs = Array.isArray(details.specializations)
    ? details.specializations
    : [];
  const primarySpec = specs[0] || "";
  const locationSlug = slugifySegment(city || details.state || "unknown");
  const specSlug = slugifySegment(primarySpec || "expert");
  const nameBase = slugifySegment(name || "expert");

  const matches = pool.filter((e) =>
    expertMatchesProfileFilters(e, {
      locationSlug,
      specSlug,
      nameBaseSlug: nameBase,
    }),
  );
  matches.sort((a, b) =>
    String(resolveListingId(a)).localeCompare(String(resolveListingId(b))),
  );
  const idx = matches.findIndex((e) => String(resolveListingId(e)) === id);
  if (idx === -1)
    return `/${locationSlug}/${specSlug}/${nameBase}-1`;
  return `/${locationSlug}/${specSlug}/${nameBase}-${idx + 1}`;
}
