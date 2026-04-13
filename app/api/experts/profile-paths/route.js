import { fetchAPI } from "@/lib/api";
import {
  collectAllSearchListings,
  profilePathFromDetailsAndPool,
} from "@/lib/expertProfileSlug";

const MAX_IDS = 48;

/** Coach dashboard (e.g. localhost:3001) resolves public profile URLs via this route. */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function jsonWithCors(body, init = {}) {
  return Response.json(body, {
    ...init,
    headers: { ...corsHeaders, ...init.headers },
  });
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors({ paths: {} }, { status: 400 });
  }

  const rawIds = Array.isArray(body?.listingIds) ? body.listingIds : [];
  const unique = [
    ...new Set(rawIds.map((x) => String(x).trim()).filter(Boolean)),
  ].slice(0, MAX_IDS);

  if (unique.length === 0) {
    return jsonWithCors({ paths: {} });
  }

  const detailsList = await Promise.all(
    unique.map((listingId) =>
      fetchAPI(
        "/experts/listing/public/details",
        { listingId },
        "POST",
      ).catch(() => null),
    ),
  );

  const paths = {};
  const byCity = new Map();

  for (let i = 0; i < unique.length; i++) {
    const listingId = unique[i];
    const data = detailsList[i];
    if (!data) continue;
    const city = String(data?.expertDetails?.city || "").trim();
    if (!city) continue;
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city).push({ listingId, data });
  }

  const cityPools = new Map();
  for (const city of byCity.keys()) {
    const pool = await collectAllSearchListings({
      city,
      expertiseTags: [],
      consultationMode: "",
      clientLocation: null,
      radiusKm: "",
      languages: [],
    });
    cityPools.set(city, pool);
  }

  for (const [, items] of byCity) {
    const firstCity = String(items[0]?.data?.expertDetails?.city || "").trim();
    const pool = cityPools.get(firstCity) || [];
    for (const { listingId, data } of items) {
      paths[listingId] = profilePathFromDetailsAndPool(
        listingId,
        data,
        pool,
      );
    }
  }

  return jsonWithCors({ paths });
}
