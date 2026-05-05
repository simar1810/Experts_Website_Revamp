"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";
import { Search, MapPin, X, ChevronDown, User } from "lucide-react";
import { EXPERTS_FILTER_DEBOUNCE_MS } from "@/lib/constants/filters";
import { availableSpecialities } from "@/lib/data/specialities";
import {
  availableCities,
  searchGlobalCities,
  searchGlobalLocations,
} from "@/lib/data/locations";

const PLACES_AUTOCOMPLETE_MIN_LEN = 3;
const PLACES_AUTOCOMPLETE_DEBOUNCE_MS = 450;

async function findPlaceLabelFromCoordinates({ coordinates }) {
  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    return null;
  }
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`,
    );
    const data = await res.json();
    const city = (data.city || data.locality || "").trim();
    const region = (data.principalSubdivision || "").trim();
    if (city && region) return `${city}, ${region}`;
    if (city) return city;
    if (region) return region;
    const country = (data.countryName || "").trim();
    return country || null;
  } catch (error) {
    return null;
  }
}

function rankPrefix(a, b, q) {
  const al = (a || "").toLowerCase();
  const bl = (b || "").toLowerCase();
  const as = al.startsWith(q) ? 0 : al.includes(q) ? 1 : 2;
  const bs = bl.startsWith(q) ? 0 : bl.includes(q) ? 1 : 2;
  if (as !== bs) return as - bs;
  return al.localeCompare(bl, undefined, { sensitivity: "base" });
}

function filterSpecialityOptions(specialityQuery, selectedSpecialities, pool) {
  const q = (specialityQuery || "").trim().toLowerCase();
  const filtered = pool.filter(
    (spec) =>
      !selectedSpecialities.includes(spec) &&
      (q === "" || spec.toLowerCase().includes(q)),
  );
  filtered.sort((a, b) => rankPrefix(a, b, q));
  return filtered;
}

/** Structured location (find-experts): Nominatim places + countries, states, cities. */
function LocationPickerDropdown({
  locationDraft,
  setLocationDraft,
  setShowLocationDropdown,
  setClientLocation,
  setLocationQuery,
  setLocationFilter,
  onUseMyLocation,
  theme = "light",
}) {
  const isDark = theme === "dark";

  const [remotePlaces, setRemotePlaces] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(false);
  const remoteSeq = useRef(0);

  const grouped = useMemo(
    () =>
      searchGlobalLocations(locationDraft, {
        countryLimit: 8,
        stateLimit: 8,
        cityLimit: 8,
      }),
    [locationDraft],
  );

  const hasAny =
    grouped.countries.length > 0 ||
    grouped.states.length > 0 ||
    grouped.cities.length > 0;

  const draftTrim = (locationDraft || "").trim();
  const showPopular = draftTrim.length === 0;
  const queryRemote = draftTrim.length >= PLACES_AUTOCOMPLETE_MIN_LEN;

  useEffect(() => {
    if (!queryRemote) {
      setRemotePlaces([]);
      setRemoteLoading(false);
      setRemoteError(false);
      return;
    }

    const ac = new AbortController();
    const seq = ++remoteSeq.current;

    const t = setTimeout(async () => {
      setRemoteLoading(true);
      setRemoteError(false);
      try {
        const res = await fetch(
          `/api/places-autocomplete?q=${encodeURIComponent(draftTrim)}&limit=8`,
          { signal: ac.signal },
        );
        const data = await res.json();
        if (ac.signal.aborted || seq !== remoteSeq.current) return;
        setRemotePlaces(Array.isArray(data.places) ? data.places : []);
        if (!res.ok) setRemoteError(true);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (ac.signal.aborted || seq !== remoteSeq.current) return;
        setRemotePlaces([]);
        setRemoteError(true);
      } finally {
        if (!ac.signal.aborted && seq === remoteSeq.current) {
          setRemoteLoading(false);
        }
      }
    }, PLACES_AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [locationDraft]);

  const hasRemote = remotePlaces.length > 0;

  const applyPick = (item) => {
    if (item.type === "place") {
      setClientLocation({
        type: "Point",
        coordinates: [item.lon, item.lat],
      });
      setLocationFilter({ mode: "none" });
      setLocationQuery(item.label);
      setLocationDraft(item.label);
      setShowLocationDropdown(false);
      return;
    }

    setClientLocation?.(null);
    if (item.type === "country") {
      setLocationFilter({ mode: "country", country: item.country });
    } else if (item.type === "state") {
      setLocationFilter({
        mode: "state",
        state: item.state,
        country: item.country,
      });
    } else {
      setLocationFilter({ mode: "city", city: item.city });
    }
    setLocationQuery(item.label);
    setLocationDraft(item.label);
    setShowLocationDropdown(false);
  };

  return (
    <div
      role="listbox"
      aria-label="Location suggestions"
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute top-full z-[1000] mt-2 rounded-2xl border p-4 shadow-2xl ring-1 ring-black/5 max-lg:left-1/2 max-lg:right-auto max-lg:w-[min(calc(100vw-1rem),36rem)] max-lg:-translate-x-1/2 lg:left-0 lg:right-auto lg:translate-x-0 lg:w-[min(100vw-2rem,36rem)] ${
        isDark
          ? "bg-gray-900 border-gray-700 ring-white/10"
          : "bg-white border-gray-100"
      }`}
    >
      {(!locationDraft ||
        "near me".includes((locationDraft || "").toLowerCase())) && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onUseMyLocation}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left group ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? "bg-gray-800 group-hover:bg-lime-500/20"
                : "bg-gray-100 group-hover:bg-lime-100"
            }`}
          >
            <MapPin
              className={`w-4 h-4 ${
                isDark
                  ? "text-gray-400 group-hover:text-lime-500"
                  : "text-gray-600 group-hover:text-lime-600"
              }`}
            />
          </div>
          <span
            className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Near me
          </span>
        </button>
      )}

      {showPopular && (
        <div className="mt-3">
          <div className="px-3 mb-1">
            <h4 className="text-xs font-medium text-gray-400">
              Popular cities
            </h4>
          </div>
          <div className="space-y-0.5">
            {availableCities.map((city) => (
              <button
                key={`pop-${city}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyPick({ type: "city", label: city, city })}
                className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {city}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {queryRemote && remoteLoading && (
        <p
          className={`mt-3 text-xs px-3 py-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Searching places…
        </p>
      )}

      {hasRemote && (
        <div className="mt-2">
          <div className="px-3 mb-1">
            <h4 className="text-xs font-medium text-gray-400">Places</h4>
          </div>
          <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-hide">
            {remotePlaces.map((p, idx) => (
              <button
                key={`${p.displayName}-${p.lat}-${p.lon}-${idx}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  applyPick({
                    type: "place",
                    label: p.displayName,
                    lat: p.lat,
                    lon: p.lon,
                  })
                }
                className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {p.displayName}
                </span>
                <span className="block text-[10px] text-gray-400 mt-0.5 capitalize">
                  {p.placeType}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {queryRemote &&
        remoteError &&
        !hasRemote &&
        !remoteLoading &&
        !hasAny && (
          <p
            className={`mt-2 text-xs px-3 py-1 ${isDark ? "text-amber-500/90" : "text-amber-700/90"}`}
          >
            Couldn&apos;t load place suggestions.
          </p>
        )}

      {hasAny ? (
        <div className="max-h-72 overflow-y-auto scrollbar-hide space-y-3 mt-1">
          {grouped.countries.length > 0 && (
            <div>
              <div className="px-3 mb-1">
                <h4 className="text-xs font-medium text-gray-400">Countries</h4>
              </div>
              <div className="space-y-0.5">
                {grouped.countries.map((row) => (
                  <button
                    key={`c-${row.label}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyPick(row)}
                    className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {row.label}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      Country
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {grouped.states.length > 0 && (
            <div>
              <div className="px-3 mb-1">
                <h4 className="text-xs font-medium text-gray-400">
                  States / regions
                </h4>
              </div>
              <div className="space-y-0.5">
                {grouped.states.map((row) => (
                  <button
                    key={`s-${row.label}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyPick(row)}
                    className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {row.label}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      State / region
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {grouped.cities.length > 0 && (
            <div>
              <div className="px-3 mb-1">
                <h4 className="text-xs font-medium text-gray-400">Cities</h4>
              </div>
              <div className="space-y-0.5">
                {grouped.cities.map((row) => (
                  <button
                    key={`ci-${row.label}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyPick(row)}
                    className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {row.label}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      City
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        draftTrim.length > 0 &&
        !remoteLoading &&
        !hasRemote &&
        !(queryRemote && remoteError && !hasAny) && (
          <p
            className={`text-xs px-3 py-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            No locations match. Try another spelling or pick from the list.
          </p>
        )
      )}
    </div>
  );
}

/** Legacy / Hero: cities-only suggestions + popular list. */
function LocationLegacyDropdown({
  coordinateLocation,
  locationQuery,
  setLocationQuery,
  setShowLocationDropdown,
  setClientLocation,
  onUseMyLocation,
  theme = "light",
}) {
  const isDark = theme === "dark";

  const globalSuggestions = useMemo(() => {
    const t = (locationQuery || "").trim();
    if (t.length < 2) return [];
    return searchGlobalCities(t, { limit: 12 });
  }, [locationQuery]);

  const filteredPopular = useMemo(
    () =>
      availableCities.filter((city) =>
        city.toLowerCase().includes((locationQuery || "").toLowerCase()),
      ),
    [locationQuery],
  );

  const showGlobal = globalSuggestions.length > 0;

  return (
    <div
      role="listbox"
      aria-label="Location suggestions"
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute top-full z-[1000] mt-2 rounded-2xl border p-4 shadow-2xl ring-1 ring-black/5 max-lg:left-1/2 max-lg:right-auto max-lg:w-[min(calc(100vw-1rem),36rem)] max-lg:-translate-x-1/2 lg:left-0 lg:right-auto lg:translate-x-0 lg:w-[min(100vw-2rem,36rem)] ${
        isDark
          ? "bg-gray-900 border-gray-700 ring-white/10"
          : "bg-white border-gray-100"
      }`}
    >
      {(!locationQuery || "near me".includes(locationQuery.toLowerCase())) && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onUseMyLocation}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left group ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? "bg-gray-800 group-hover:bg-lime-500/20"
                : "bg-gray-100 group-hover:bg-lime-100"
            }`}
          >
            <MapPin
              className={`w-4 h-4 ${
                isDark
                  ? "text-gray-400 group-hover:text-lime-500"
                  : "text-gray-600 group-hover:text-lime-600"
              }`}
            />
          </div>
          <span
            className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Near me
          </span>
        </button>
      )}

      {showGlobal && (
        <>
          <div className="mt-3 mb-2 px-3">
            <h4 className="text-xs font-medium text-gray-400">Cities</h4>
          </div>
          <div
            className={`border-t mx-3 mb-1 ${isDark ? "border-gray-800" : "border-gray-100"}`}
          />
          <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-hide">
            {globalSuggestions.map((row) => (
              <button
                key={row.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setClientLocation?.(null);
                  setLocationQuery(row.name);
                  setShowLocationDropdown(false);
                }}
                className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {row.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {!showGlobal && filteredPopular.length > 0 && (
        <>
          <div className="mt-3 mb-2 px-3">
            <h4 className="text-xs font-medium text-gray-400">
              {locationQuery ? "Matching Cities" : "Popular Cities"}
            </h4>
          </div>

          <div
            className={`border-t mx-3 mb-1 ${isDark ? "border-gray-800" : "border-gray-100"}`}
          />

          <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-hide">
            {filteredPopular.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setClientLocation?.(null);
                  setLocationQuery(city);
                  setShowLocationDropdown(false);
                }}
                className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {city}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Location row + same dropdown as hero search (pick-only when `setLocationFilter` is passed). */
export const LocationSearchField = forwardRef(function LocationSearchField(
  {
    locationQuery,
    setLocationQuery,
    setLocationFilter,
    setClientLocation,
    onSearch,
    theme = "light",
    placeholderLocation = "Location",
    locationIconColor = "text-gray-300",
    className = "",
  },
  ref,
) {
  const isDark = theme === "dark";
  const locationPickOnly = typeof setLocationFilter === "function";

  const [locationDraft, setLocationDraft] = useState(locationQuery);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [coordinateLocation, setCoordinateLocation] = useState(null);

  const locationFieldRootRef = useRef(null);
  const locationInputRef = useRef(null);
  const locationBlurTimerRef = useRef(null);

  useEffect(() => {
    setLocationDraft(locationQuery);
  }, [locationQuery]);

  const cancelLocationBlurClose = useCallback(() => {
    if (locationBlurTimerRef.current) {
      clearTimeout(locationBlurTimerRef.current);
      locationBlurTimerRef.current = null;
    }
  }, []);

  const openLocationDropdown = useCallback(() => {
    cancelLocationBlurClose();
    setShowLocationDropdown(true);
  }, [cancelLocationBlurClose]);

  const scheduleLocationBlurClose = useCallback(() => {
    cancelLocationBlurClose();
    locationBlurTimerRef.current = setTimeout(() => {
      locationBlurTimerRef.current = null;
      const root = locationFieldRootRef.current;
      if (
        root &&
        typeof document !== "undefined" &&
        root.contains(document.activeElement)
      ) {
        return;
      }
      setShowLocationDropdown(false);
      if (locationPickOnly) {
        setLocationDraft(locationQuery);
      }
    }, 150);
  }, [cancelLocationBlurClose, locationPickOnly, locationQuery]);

  useEffect(() => () => cancelLocationBlurClose(), [cancelLocationBlurClose]);

  useEffect(() => {
    if (!showLocationDropdown) return;
    function handlePointerDown(e) {
      const root = locationFieldRootRef.current;
      if (!root || !(e.target instanceof Node) || root.contains(e.target)) {
        return;
      }
      cancelLocationBlurClose();
      setShowLocationDropdown(false);
      if (locationPickOnly) {
        setLocationDraft(locationQuery);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [
    showLocationDropdown,
    locationPickOnly,
    locationQuery,
    cancelLocationBlurClose,
  ]);

  useEffect(() => {
    if (locationPickOnly) return;
    if (locationDraft === locationQuery) return;
    const id = setTimeout(() => {
      setClientLocation?.(null);
      setLocationQuery(locationDraft);
    }, EXPERTS_FILTER_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [
    locationDraft,
    locationQuery,
    setLocationQuery,
    setClientLocation,
    locationPickOnly,
  ]);

  const handleUseMyLocation = async () => {
    cancelLocationBlurClose();

    const finishWithCoordinates = async (coords) => {
      if (!coords) return;
      const { latitude, longitude } = coords;
      setCoordinateLocation(coords);
      setClientLocation?.({
        type: "Point",
        coordinates: [longitude, latitude],
      });
      const placeLabel = await findPlaceLabelFromCoordinates({
        coordinates: coords,
      });
      const label = (placeLabel || "").trim();
      setLocationDraft(label);
      setLocationQuery(label);
      if (locationPickOnly) {
        setLocationFilter({ mode: "none" });
      }
      setShowLocationDropdown(false);
    };

    if (coordinateLocation) {
      await finishWithCoordinates(coordinateLocation);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await finishWithCoordinates({ latitude, longitude });
        },
        (err) => {
          setShowLocationDropdown(false);
        },
      );
    } else {
      setShowLocationDropdown(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      syncBeforeSearch() {
        if (locationPickOnly) {
          setLocationDraft(locationQuery);
        } else {
          setLocationQuery(locationDraft);
        }
      },
    }),
    [locationPickOnly, locationQuery, locationDraft, setLocationQuery],
  );

  return (
    <div
      ref={locationFieldRootRef}
      className={cn(
        "relative flex min-h-11 min-w-0 flex-1 basis-0 items-center px-3 py-1",
        showLocationDropdown ? "z-[200] isolate" : "z-[2]",
        className,
      )}
      onMouseDown={(e) => {
        if (e.target instanceof Element && e.target.closest("button")) {
          return;
        }
        cancelLocationBlurClose();
        setShowLocationDropdown(true);
        if (locationInputRef.current && e.target !== locationInputRef.current) {
          locationInputRef.current.focus({ preventScroll: true });
        }
      }}
    >
      <MapPin className={`w-4 h-4 shrink-0 mr-2 ${locationIconColor}`} />
      <input
        ref={locationInputRef}
        type="text"
        autoComplete="off"
        placeholder={placeholderLocation}
        value={locationDraft}
        onChange={(e) => {
          setClientLocation?.(null);
          if (locationPickOnly) {
            setLocationFilter({ mode: "none" });
          }
          setLocationDraft(e.target.value);
        }}
        onFocus={openLocationDropdown}
        onBlur={scheduleLocationBlurClose}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            cancelLocationBlurClose();
            if (locationPickOnly) {
              setLocationDraft(locationQuery);
            } else {
              setLocationQuery(locationDraft);
            }
            setShowLocationDropdown(false);
            setTimeout(() => {
              if (typeof onSearch === "function") onSearch();
            }, 0);
          }
        }}
        className={`bg-transparent border-none outline-none w-full text-sm min-w-0 ${
          isDark
            ? "text-white placeholder-gray-500"
            : "text-gray-700 placeholder-gray-400"
        }`}
      />
      {showLocationDropdown &&
        (locationPickOnly ? (
          <LocationPickerDropdown
            locationDraft={locationDraft}
            setLocationDraft={setLocationDraft}
            setShowLocationDropdown={setShowLocationDropdown}
            setClientLocation={setClientLocation}
            setLocationQuery={setLocationQuery}
            setLocationFilter={setLocationFilter}
            onUseMyLocation={handleUseMyLocation}
            theme={theme}
          />
        ) : (
          <LocationLegacyDropdown
            coordinateLocation={coordinateLocation}
            locationQuery={locationDraft}
            setLocationQuery={(next) => {
              setLocationDraft(next);
              setLocationQuery(next);
            }}
            setShowLocationDropdown={setShowLocationDropdown}
            setClientLocation={setClientLocation}
            onUseMyLocation={handleUseMyLocation}
            theme={theme}
          />
        ))}
    </div>
  );
});
LocationSearchField.displayName = "LocationSearchField";

function SpecialitySelectorDropdown({
  specialityQuery,
  selectedSpecialities,
  onSelectTag,
  setShowSpecialityDropdown,
  theme = "light",
  specialityOptions,
}) {
  const isDark = theme === "dark";

  const filtered = useMemo(
    () =>
      filterSpecialityOptions(
        specialityQuery,
        selectedSpecialities,
        specialityOptions,
      ),
    [specialityQuery, selectedSpecialities, specialityOptions],
  );

  return (
    <div
      role="listbox"
      aria-label="Speciality suggestions"
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute top-full left-0 right-0 z-[1000] mt-2 rounded-2xl border p-4 shadow-2xl ring-1 ring-black/5 lg:right-auto lg:w-[min(100vw-2rem,36rem)] ${
        isDark
          ? "bg-gray-900 border-gray-700 ring-white/10"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="mb-2 px-3">
        <h4 className="text-xs font-medium text-gray-400">
          {specialityQuery.trim()
            ? "Matching specialities"
            : "Available specialities"}
        </h4>
      </div>
      {filtered.length === 0 ? (
        <p
          className={`text-xs px-3 py-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          No specialities match. Clear the text or pick from the list.
        </p>
      ) : (
        <div className="scrollbar-hide max-h-[min(70vh,22rem)] space-y-0.5 overflow-y-auto overscroll-y-contain">
          {filtered.map((spec) => (
            <button
              key={spec}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelectTag(spec);
                setShowSpecialityDropdown(false);
              }}
              className={`w-full px-3 py-2.5 rounded-lg transition-colors text-left group flex items-center justify-between ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isDark
                    ? "text-gray-300 group-hover:text-lime-500"
                    : "text-gray-700 group-hover:text-[var(--brand-primary)]"
                }`}
              >
                {spec}
              </span>
              <ChevronDown
                className={`w-3 h-3 -rotate-90 transition-colors ${
                  isDark
                    ? "text-gray-500 group-hover:text-lime-500"
                    : "text-gray-300 group-hover:text-[var(--brand-primary)]"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchFilters({
  selectedSpecialities,
  setSelectedSpecialities,
  locationQuery,
  setLocationQuery,
  onSearch,
  onSearchButtonClick,
  /** When set, search uses backend geo + radius (km); cleared when user types or picks a city from the list */
  clientLocation,
  setClientLocation,
  /** When set, location is pick-only (countries / states / cities) for listing search. */
  setLocationFilter,
  theme = "light",
  containerClassName = "",
  inputWrapperClassName = "",
  buttonClassName = "",
  buttonText = "Search Experts",
  specialityIconColor = "text-gray-300",
  locationIconColor = "text-gray-300",
  placeholderSpeciality = "Speciality",
  placeholderLocation = "Location",
  nameQuery,
  setNameQuery,
  /** Options for speciality autocomplete; defaults to static list when omitted */
  specialityOptions: specialityOptionsProp,
  /** Shown above each field on small screens only (stacked layout). */
  specialityFieldLabel,
  locationFieldLabel,
}) {
  const specialityOptions = useMemo(() => {
    if (
      Array.isArray(specialityOptionsProp) &&
      specialityOptionsProp.length > 0
    ) {
      return [...new Set(specialityOptionsProp.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
    }
    return availableSpecialities;
  }, [specialityOptionsProp]);

  const [specialityQuery, setSpecialityQuery] = useState("");
  const [showSpecialityDropdown, setShowSpecialityDropdown] = useState(false);
  const isDark = theme === "dark";

  const specialityRootRef = useRef(null);
  const specialityBlurTimerRef = useRef(null);
  const locationFieldRef = useRef(null);

  const cancelSpecialityBlur = useCallback(() => {
    if (specialityBlurTimerRef.current) {
      clearTimeout(specialityBlurTimerRef.current);
      specialityBlurTimerRef.current = null;
    }
  }, []);

  const scheduleSpecialityClose = useCallback(() => {
    cancelSpecialityBlur();
    specialityBlurTimerRef.current = setTimeout(() => {
      specialityBlurTimerRef.current = null;
      const root = specialityRootRef.current;
      if (
        root &&
        typeof document !== "undefined" &&
        root.contains(document.activeElement)
      ) {
        return;
      }
      setShowSpecialityDropdown(false);
      setSpecialityQuery("");
    }, 200);
  }, [cancelSpecialityBlur]);

  useEffect(() => () => cancelSpecialityBlur(), [cancelSpecialityBlur]);

  useEffect(() => {
    if (!showSpecialityDropdown) return;
    function handlePointerDown(e) {
      const root = specialityRootRef.current;
      if (!root || !(e.target instanceof Node) || root.contains(e.target)) {
        return;
      }
      cancelSpecialityBlur();
      setShowSpecialityDropdown(false);
      setSpecialityQuery("");
    }
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [showSpecialityDropdown, cancelSpecialityBlur]);

  const extendedSearch = typeof setNameQuery === "function";

  const addSpeciality = (spec) => {
    if (!selectedSpecialities.includes(spec)) {
      setSelectedSpecialities([...selectedSpecialities, spec]);
    }
    setSpecialityQuery("");
  };

  const removeSpeciality = (spec) => {
    setSelectedSpecialities(selectedSpecialities.filter((s) => s !== spec));
  };

  const runSearch = useCallback(() => {
    locationFieldRef.current?.syncBeforeSearch?.();
    setTimeout(() => {
      if (typeof onSearch === "function") {
        onSearch();
      }
    }, 0);
  }, [onSearch]);

  const runSearchFromButton = useCallback(() => {
    locationFieldRef.current?.syncBeforeSearch?.();
    setTimeout(() => {
      if (typeof onSearchButtonClick === "function") {
        onSearchButtonClick();
      } else if (typeof onSearch === "function") {
        onSearch();
      }
    }, 0);
  }, [onSearch, onSearchButtonClick]);

  const specialityMatches = useMemo(
    () =>
      filterSpecialityOptions(
        specialityQuery,
        selectedSpecialities,
        specialityOptions,
      ),
    [specialityQuery, selectedSpecialities, specialityOptions],
  );

  return (
    <div
      className={`relative flex flex-col lg:flex-row items-stretch gap-1 ${containerClassName}`}
    >
      {/* Speciality Input — choose from list only (typing filters). */}
      <div className="flex w-full min-w-0 flex-col gap-1.5 sm:contents">
        {specialityFieldLabel ? (
          <span className="pl-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-wz-top-green sm:hidden">
            {specialityFieldLabel}
          </span>
        ) : null}
        <div
          ref={specialityRootRef}
          className={`relative flex min-h-11 min-w-0 flex-1 basis-0 items-center px-3 py-1 ${
            showSpecialityDropdown ? "z-[200] isolate" : "z-[2]"
          } ${inputWrapperClassName}`}
          onMouseDown={(e) => {
            if (e.target instanceof Element && e.target.closest("button")) {
              return;
            }
            cancelSpecialityBlur();
            setShowSpecialityDropdown(true);
          }}
        >
          <Search className={`w-4 h-4 shrink-0 mr-2 ${specialityIconColor}`} />
          {/* One nowrap + overflow-x row so chips sit flush next to the input; extra space stays on the right, not between tags and the field */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto overflow-y-hidden overscroll-x-contain py-0.5 [-webkit-overflow-scrolling:touch] scrollbar-hide">
            {selectedSpecialities.map((spec) => (
              <span
                key={spec}
                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-lime-500 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                {spec}
                <X
                  className="w-2.5 h-2.5 shrink-0 cursor-pointer hover:text-red-200 transition-colors"
                  onClick={() => removeSpeciality(spec)}
                />
              </span>
            ))}
            <input
              type="text"
              autoComplete="off"
              placeholder={
                selectedSpecialities.length === 0 ? placeholderSpeciality : ""
              }
              value={specialityQuery}
              onChange={(e) => {
                setSpecialityQuery(e.target.value);
                setShowSpecialityDropdown(true);
              }}
              onFocus={() => {
                cancelSpecialityBlur();
                setShowSpecialityDropdown(true);
              }}
              onClick={() => {
                cancelSpecialityBlur();
                setShowSpecialityDropdown(true);
              }}
              onBlur={(e) => {
                const next = e.relatedTarget;
                if (
                  next instanceof Node &&
                  specialityRootRef.current?.contains(next)
                ) {
                  return;
                }
                scheduleSpecialityClose();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (specialityMatches.length === 1) {
                    addSpeciality(specialityMatches[0]);
                    setShowSpecialityDropdown(false);
                  }
                }
              }}
              className={`min-w-0 flex-1 border-none bg-transparent text-sm outline-none text-black`}
            />
          </div>
          {showSpecialityDropdown && (
            <SpecialitySelectorDropdown
              specialityQuery={specialityQuery}
              selectedSpecialities={selectedSpecialities}
              onSelectTag={addSpeciality}
              setShowSpecialityDropdown={setShowSpecialityDropdown}
              theme={theme}
              specialityOptions={specialityOptions}
            />
          )}
        </div>
      </div>

      {extendedSearch && (
        <div
          className={`relative z-[2] flex min-h-11 min-w-0 flex-1 basis-0 items-center px-3 py-1 ${inputWrapperClassName}`}
        >
          <User className={`w-4 h-4 shrink-0 mr-2 ${specialityIconColor}`} />
          <input
            type="text"
            placeholder="Expert name"
            value={nameQuery ?? ""}
            onChange={(e) => setNameQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runSearch();
              }
            }}
            className={`bg-transparent border-none outline-none w-full text-sm min-w-0 text-black`}
          />
        </div>
      )}

      {/* Location — pick-only when setLocationFilter is provided */}
      <div className="flex w-full min-w-0 flex-col gap-1.5 sm:contents">
        {locationFieldLabel ? (
          <span className="pl-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-wz-top-green sm:hidden">
            {locationFieldLabel}
          </span>
        ) : null}
        <LocationSearchField
          ref={locationFieldRef}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          setLocationFilter={setLocationFilter}
          setClientLocation={setClientLocation}
          onSearch={onSearch}
          theme={theme}
          placeholderLocation={placeholderLocation}
          locationIconColor={locationIconColor}
          className={inputWrapperClassName}
        />
      </div>

      <button
        type="button"
        onClick={runSearchFromButton}
        className={`shrink-0 transition-all active:scale-[0.98] whitespace-nowrap ${buttonClassName}`}
      >
        {buttonText === "Search" && (
          <Search className="w-4 h-4 inline-block mr-2" />
        )}
        {buttonText}
      </button>
    </div>
  );
}
