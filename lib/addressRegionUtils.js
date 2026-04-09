import { Country, State } from "country-state-city";

/** Max cities to render in a native &lt;select&gt; before falling back to a text field (performance). */
export const MAX_CITIES_IN_SELECT = 2500;

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
