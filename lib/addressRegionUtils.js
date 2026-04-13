"use client";

import { Country, State } from "country-state-city";

/** Max cities in a native &lt;select&gt; before falling back to a text field. */
export const MAX_CITIES_IN_SELECT = 2500;

function norm(s) {
  return (s || "").trim().toLowerCase();
}

export function findStateCode(countryCode, stateName) {
  if (!countryCode || !stateName?.trim()) return "";
  const states = State.getStatesOfCountry(countryCode);
  if (!states?.length) return "";

  const n = norm(stateName);
  const exact = states.find((s) => norm(s.name) === n);
  if (exact) return exact.isoCode;

  const noStateOf = n.replace(/^state of\s+/i, "").trim();
  const exact2 = states.find((s) => norm(s.name) === noStateOf);
  if (exact2) return exact2.isoCode;

  const byCode = states.find(
    (s) => norm(s.isoCode) === n || norm(s.isoCode) === noStateOf,
  );
  if (byCode) return byCode.isoCode;

  const partial = states.find(
    (s) =>
      n.includes(norm(s.name)) ||
      norm(s.name).includes(n) ||
      noStateOf.includes(norm(s.name)) ||
      norm(s.name).includes(noStateOf),
  );
  return partial?.isoCode || "";
}

export function resolveCountryCode(countryCode, countryName) {
  let cc = (countryCode || "").toUpperCase();
  if (cc && Country.getCountryByCode(cc)) return cc;
  if (countryName?.trim()) {
    const n = norm(countryName);
    const hit = Country.getAllCountries().find((c) => norm(c.name) === n);
    if (hit) return hit.isoCode;
    const partial = Country.getAllCountries().find(
      (c) => n.includes(norm(c.name)) || norm(c.name).includes(n),
    );
    if (partial) return partial.isoCode;
  }
  return cc;
}

export function getSortedCountries() {
  return [...Country.getAllCountries()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

export function getStatesForCountry(countryCode) {
  if (!countryCode) return [];
  return [...State.getStatesOfCountry(countryCode)].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

/** Map persisted client profile strings into AddressRegionFields shape. */
export function addressFromStoredLocation(parts) {
  const countryName =
    typeof parts.countryName === "string" ? parts.countryName : "";
  const stateRaw = typeof parts.state === "string" ? parts.state : "";
  const cityRaw = typeof parts.city === "string" ? parts.city : "";
  const zipRaw = typeof parts.pincode === "string" ? parts.pincode : "";

  const cc = resolveCountryCode("", countryName);
  const countryMeta = cc ? Country.getCountryByCode(cc) : null;
  const country = countryMeta?.name || countryName.trim();

  const stateCode = findStateCode(cc, stateRaw);
  const stateObj =
    cc && stateCode
      ? State.getStatesOfCountry(cc).find((s) => s.isoCode === stateCode)
      : null;
  const state = stateObj?.name || stateRaw.trim();

  return {
    countryCode: cc || "",
    country: country || "",
    stateCode: stateCode || "",
    state,
    city: cityRaw.trim(),
    zipCode: zipRaw.trim(),
  };
}
