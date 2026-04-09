import { NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/**
 * Forward geocode city + region + region to suggest a postal code.
 * Proxies Nominatim with a proper User-Agent (usage policy).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const state = searchParams.get("state")?.trim();
  const country = searchParams.get("country")?.trim();

  if (!city || !country) {
    return NextResponse.json(
      { message: "city and country are required" },
      { status: 400 },
    );
  }

  const q = [city, state, country].filter(Boolean).join(", ");
  const url = `${NOMINATIM}?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "WellnesszExpertsWeb/1.0 (client signup; https://wellnessz.in)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Geocoding service error", postcode: "" },
        { status: 502 },
      );
    }

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ postcode: "" });
    }

    const addr = results[0]?.address || {};
    const postcode = (addr.postcode || "").trim();

    return NextResponse.json({ postcode });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Geocoding failed", postcode: "" },
      { status: 500 },
    );
  }
}
