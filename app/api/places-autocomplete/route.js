import { NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

const USER_AGENT =
  "WellnesszExpertsWeb/1.0 (expert search; https://wellnessz.in)";

/**
 * Multi-result place search for location autocomplete (neighborhoods, typos).
 * India-biased, same policy as geocode-search.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ message: "q is required" }, { status: 400 });
  }

  let limit = Number.parseInt(searchParams.get("limit") || "8", 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 8;
  if (limit > 10) limit = 10;

  const biased = /\bindia\b/i.test(q) ? q : `${q}, India`;
  const url = `${NOMINATIM}?format=json&addressdetails=1&countrycodes=in&limit=${limit}&q=${encodeURIComponent(biased)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Geocoding service error", places: [] },
        { status: 502 },
      );
    }

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ places: [] });
    }

    const places = results.map((row) => {
      const la = parseFloat(row.lat);
      const lo = parseFloat(row.lon);
      const placeType =
        row.addresstype || row.type || row.class || "place";
      return {
        displayName: row.display_name || biased,
        lat: Number.isFinite(la) ? la : null,
        lon: Number.isFinite(lo) ? lo : null,
        placeType: String(placeType),
      };
    }).filter((p) => p.lat != null && p.lon != null);

    return NextResponse.json({ places });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Autocomplete failed", places: [] },
      { status: 500 },
    );
  }
}
