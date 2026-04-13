"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";
import {
  getSortedCountries,
  getStatesForCountry,
  MAX_CITIES_IN_SELECT,
} from "@/lib/addressRegionUtils";

const selectClass = (hasError) =>
  `w-full bg-white border rounded-xl p-3.5 text-[15px] text-gray-900 appearance-none outline-none transition-all shadow-sm ${
    hasError
      ? "border-red-500 focus:ring-red-100"
      : "border-gray-200 focus:ring-2 focus:ring-[#7ABE39]/20"
  }`;

const inputClass = (hasError) =>
  `w-full bg-white border rounded-xl p-3.5 text-[15px] text-gray-900 outline-none transition-all shadow-sm placeholder:text-gray-500 ${
    hasError
      ? "border-red-500 focus:ring-red-100"
      : "border-gray-200 focus:ring-2 focus:ring-[#7ABE39]/20"
  }`;

export default function AddressRegionFields({
  address,
  onAddressChange,
  errors = {},
  showCityNotInDatasetHint = false,
}) {
  const addressRef = useRef(address);
  addressRef.current = address;
  const postcodeAbortRef = useRef(null);

  const suggestPostcode = useCallback(
    async ({ city: cityVal, state: stateVal, country: countryVal }) => {
      const city = typeof cityVal === "string" ? cityVal.trim() : "";
      const state = typeof stateVal === "string" ? stateVal.trim() : "";
      const country = typeof countryVal === "string" ? countryVal.trim() : "";
      if (!city || !state || !country) return;

      postcodeAbortRef.current?.abort();
      const ac = new AbortController();
      postcodeAbortRef.current = ac;

      try {
        const res = await fetch(
          `/api/lookup-postcode?${new URLSearchParams({
            city,
            state,
            country,
          }).toString()}`,
          { signal: ac.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        const pc =
          typeof data.postcode === "string" ? data.postcode.trim() : "";
        if (!pc) return;

        const cur = addressRef.current;
        if (
          cur.city.trim() === city &&
          cur.state.trim() === state &&
          cur.country.trim() === country
        ) {
          onAddressChange({ zipCode: pc });
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("Postcode lookup failed:", e);
      }
    },
    [onAddressChange],
  );

  useEffect(() => {
    return () => postcodeAbortRef.current?.abort();
  }, []);

  const countries = useMemo(() => getSortedCountries(), []);
  const states = useMemo(
    () => getStatesForCountry(address.countryCode),
    [address.countryCode],
  );
  const cities = useMemo(() => {
    if (!address.countryCode || !address.stateCode) return [];
    return [...City.getCitiesOfState(address.countryCode, address.stateCode)].sort(
      (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [address.countryCode, address.stateCode]);

  const hasStateList = states.length > 0;
  const useCitySelect =
    Boolean(address.countryCode && address.stateCode && hasStateList) &&
    cities.length > 0 &&
    cities.length <= MAX_CITIES_IN_SELECT;

  const cityNames = useMemo(() => new Set(cities.map((c) => c.name)), [cities]);
  const cityInDataset = Boolean(address.city && cityNames.has(address.city));
  const showCityTextInput =
    !useCitySelect ||
    (Boolean(address.city) && !cityInDataset && showCityNotInDatasetHint);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[12px] text-gray-600 italic block text-left">
          Country
        </span>
        <div className="relative">
          <select
            value={address.countryCode || ""}
            onChange={(e) => {
              const code = e.target.value;
              const c = code ? Country.getCountryByCode(code) : null;
              onAddressChange({
                countryCode: code,
                country: c?.name || "",
                stateCode: "",
                state: "",
                city: "",
                zipCode: "",
              });
            }}
            className={selectClass(Boolean(errors.country))}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-500"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[12px] text-gray-600 italic block text-left">
          State / Region / Province
        </span>
        {hasStateList ? (
          <div className="relative">
            <select
              value={address.stateCode || ""}
              disabled={!address.countryCode}
              onChange={(e) => {
                const code = e.target.value;
                const s = states.find((x) => x.isoCode === code);
                onAddressChange({
                  stateCode: code,
                  state: s?.name || "",
                  city: "",
                  zipCode: "",
                });
              }}
              className={`${selectClass(Boolean(errors.state))} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">
                {address.countryCode
                  ? "Select state / region"
                  : "Select country first"}
              </option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-500"
              strokeWidth={2}
              aria-hidden
            />
          </div>
        ) : (
          <input
            type="text"
            value={address.state}
            disabled={!address.countryCode}
            onChange={(e) =>
              onAddressChange({
                state: e.target.value,
                stateCode: "",
              })
            }
            placeholder={
              address.countryCode
                ? "Region / province (if applicable)"
                : "Select country first"
            }
            className={`${inputClass(Boolean(errors.state))} disabled:opacity-50`}
          />
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[12px] text-gray-600 italic block text-left">
          City
        </span>
        {useCitySelect ? (
          <>
            <div className="relative">
              <select
                value={address.city || ""}
                disabled={!address.stateCode}
                onChange={(e) => {
                  const value = e.target.value;
                  onAddressChange({
                    city: value,
                    zipCode: value.trim() ? "" : "",
                  });
                  if (value.trim()) {
                    queueMicrotask(() => {
                      const a = addressRef.current;
                      void suggestPostcode({
                        city: value,
                        state: a.state,
                        country: a.country,
                      });
                    });
                  }
                }}
                className={`${selectClass(Boolean(errors.city))} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">
                  {address.stateCode ? "Select city" : "Select state first"}
                </option>
                {address.city && !cityInDataset ? (
                  <option value={address.city}>{address.city} (custom)</option>
                ) : null}
                {cities.map((c) => (
                  <option
                    key={`${address.countryCode}-${address.stateCode}-${c.name}`}
                    value={c.name}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-500"
                strokeWidth={2}
                aria-hidden
              />
            </div>
            {showCityNotInDatasetHint && address.city && !cityInDataset ? (
              <p className="text-left text-[11px] text-gray-500">
                Your area is not in the list — type the correct city below.
              </p>
            ) : null}
          </>
        ) : null}

        {!useCitySelect &&
        address.countryCode &&
        cities.length > MAX_CITIES_IN_SELECT ? (
          <p className="text-left text-[11px] text-gray-500">
            This region has many localities (
            {cities.length.toLocaleString()}). Type your city name.
          </p>
        ) : null}

        {showCityTextInput ? (
          <input
            type="text"
            value={address.city}
            onChange={(e) => {
              const v = e.target.value;
              onAddressChange({
                city: v,
                ...(v.trim() ? {} : { zipCode: "" }),
              });
            }}
            onBlur={() => {
              const snap = addressRef.current;
              if (
                snap.city?.trim() &&
                snap.state?.trim() &&
                snap.country?.trim()
              ) {
                void suggestPostcode(snap);
              }
            }}
            placeholder="City"
            disabled={
              !address.countryCode || (hasStateList && !address.stateCode)
            }
            className={`${inputClass(Boolean(errors.city))} disabled:opacity-50`}
          />
        ) : null}
      </div>

      <div className="space-y-1">
        <span className="text-[12px] text-gray-600 italic block text-left">
          Postal / Zip Code
        </span>
        <input
          type="text"
          value={address.zipCode}
          placeholder="Postal / Zip Code"
          onChange={(e) => onAddressChange({ zipCode: e.target.value })}
          className={inputClass(Boolean(errors.zipCode))}
        />
      </div>
    </div>
  );
}
