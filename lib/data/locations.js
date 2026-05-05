import { City, Country, State } from "country-state-city";

/** Short list for legacy UIs (slugs, landing selects). */
export const availableCities = [
  "Delhi",
  "Kolkata",
  "Mumbai",
  "Bengaluru",
  "Chennai",
];

let _citiesWithLower = null;
let _allStatesCache = null;
let _allCountriesCache = null;

function getCitiesIndex() {
  if (!_citiesWithLower) {
    _citiesWithLower = City.getAllCities().map((c) => ({
      ...c,
      _lower: (c.name || "").toLowerCase(),
    }));
  }
  return _citiesWithLower;
}

function getAllStatesCached() {
  if (!_allStatesCache) {
    _allStatesCache = State.getAllStates();
  }
  return _allStatesCache;
}

function getAllCountriesCached() {
  if (!_allCountriesCache) {
    _allCountriesCache = Country.getAllCountries();
  }
  return _allCountriesCache;
}

function formatCityLabel(city) {
  const st = State.getStateByCodeAndCountry(city.stateCode, city.countryCode);
  const co = Country.getCountryByCode(city.countryCode);
  const stateName = st?.name || city.stateCode || "";
  const countryName = co?.name || city.countryCode || "";
  return [city.name, stateName, countryName].filter(Boolean).join(", ");
}

function rankNameMatch(name, q) {
  const n = (name || "").toLowerCase();
  if (n.startsWith(q)) return 0;
  if (n.includes(q)) return 1;
  return 2;
}

/**
 * Autocomplete suggestions from country-state-city (global).
 * @param {string} rawQuery
 * @param {{ limit?: number }} [options]
 * @returns {{ name: string, label: string }[]}
 */
export function searchGlobalCities(rawQuery, { limit = 12 } = {}) {
  const q = (rawQuery || "").trim().toLowerCase();
  if (q.length < 2) return [];

  const index = getCitiesIndex();
  const hits = [];
  for (let i = 0; i < index.length; i++) {
    const c = index[i];
    if (c._lower.includes(q)) hits.push(c);
  }

  hits.sort((a, b) => {
    const ra = rankNameMatch(a.name, q);
    const rb = rankNameMatch(b.name, q);
    if (ra !== rb) return ra - rb;
    if (a.name.length !== b.name.length) return a.name.length - b.name.length;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  const slice = hits.slice(0, limit);
  const seen = new Set();
  const out = [];
  for (const c of slice) {
    const label = formatCityLabel(c);
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ name: c.name, label });
  }
  return out;
}

/**
 * Countries, states, and cities matching a query (for location autocomplete).
 * @param {string} rawQuery
 * @param {{ countryLimit?: number, stateLimit?: number, cityLimit?: number }} [options]
 */
export function searchGlobalLocations(
  rawQuery,
  { countryLimit = 8, stateLimit = 8, cityLimit = 8 } = {},
) {
  const q = (rawQuery || "").trim().toLowerCase();
  if (!q) {
    return { countries: [], states: [], cities: [] };
  }

  const countries = [];
  for (const c of getAllCountriesCached()) {
    const name = c.name || "";
    if (name.toLowerCase().includes(q)) {
      countries.push({
        type: "country",
        label: name,
        country: name,
      });
    }
  }
  countries.sort((a, b) => {
    const ra = rankNameMatch(a.label, q);
    const rb = rankNameMatch(b.label, q);
    if (ra !== rb) return ra - rb;
    return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  });

  const states = [];
  for (const s of getAllStatesCached()) {
    const name = s.name || "";
    if (!name.toLowerCase().includes(q)) continue;
    const co = Country.getCountryByCode(s.countryCode);
    const countryName = co?.name || s.countryCode || "";
    states.push({
      type: "state",
      label: `${name}, ${countryName}`,
      state: name,
      country: countryName,
    });
  }
  states.sort((a, b) => {
    const ra = rankNameMatch(a.state, q);
    const rb = rankNameMatch(b.state, q);
    if (ra !== rb) return ra - rb;
    return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  });

  const cities =
    q.length >= 2
      ? searchGlobalCities(rawQuery, { limit: cityLimit }).map((row) => ({
          type: "city",
          label: row.label,
          city: row.name,
        }))
      : [];

  return {
    countries: countries.slice(0, countryLimit),
    states: states.slice(0, stateLimit),
    cities,
  };
}
