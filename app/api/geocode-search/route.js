import { NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/**
 * Forward geocode a free-text place query for expert distance search.
 * Bias toward India to avoid ambiguous names (e.g. Shibpur).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ message: "q is required" }, { status: 400 });
  }

  const biased = /\bindia\b/i.test(q) ? q : `${q}, India`;
  const url = `${NOMINATIM}?format=json&limit=1&addressdetails=0&countrycodes=in&q=${encodeURIComponent(biased)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "WellnesszExpertsWeb/1.0 (expert search; https://wellnessz.in)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Geocoding service error" },
        { status: 502 },
      );
    }

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ lat: null, lon: null });
    }

    const { lat, lon } = results[0];
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      return NextResponse.json({ lat: null, lon: null });
    }

    return NextResponse.json({
      lat: la,
      lon: lo,
      displayName: results[0].display_name || biased,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Geocoding failed" },
      { status: 500 },
    );
  }
}
