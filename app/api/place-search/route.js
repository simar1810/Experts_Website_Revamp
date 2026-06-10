import { NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

function cityFromAddress(addr = {}) {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.hamlet ||
    addr.suburb ||
    addr.county ||
    addr.state_district ||
    ""
  );
}

function formatSuggestion(hit) {
  const addr = hit.address || {};
  const city = cityFromAddress(addr) || (hit.name || "").trim();
  const state = (addr.state || addr.region || "").trim();
  const country = (addr.country || "").trim();
  const parts = [city, state, country].filter(Boolean);
  const label = parts.length ? parts.join(", ") : (hit.display_name || "").trim();

  return {
    id: String(hit.place_id ?? hit.osm_id ?? hit.display_name),
    label,
    displayName: hit.display_name || label,
  };
}

/** City/region autocomplete for Zeefit apply and coach flows (OpenStreetMap Nominatim). */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const biased = /\bindia\b/i.test(q) ? q : `${q}, India`;
  const url = `${NOMINATIM}?format=json&limit=8&addressdetails=1&dedupe=1&countrycodes=in&q=${encodeURIComponent(biased)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "WellnesszExpertsWeb/1.0 (zeefit apply; https://zeefit.in)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Place search service error" },
        { status: 502 },
      );
    }

    const results = await res.json();
    if (!Array.isArray(results)) {
      return NextResponse.json({ suggestions: [] });
    }

    const seen = new Set();
    const suggestions = [];
    for (const hit of results) {
      const item = formatSuggestion(hit);
      if (!item.label || seen.has(item.label)) continue;
      seen.add(item.label);
      suggestions.push(item);
    }

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Place search failed" }, { status: 500 });
  }
}
