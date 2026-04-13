"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchListings } from "@/lib/services/listingSearch.service";
import { EXPERTS_FILTER_DEBOUNCE_MS } from "@/lib/constants/filters";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const FREE_PAGE_SIZE = 20;

function applyClientFilters(experts, { clientsRanges, wzAssured }) {
  if (!Array.isArray(experts)) return [];
  let result = [...experts];

  if (wzAssured) {
    result = result.filter((e) => e.wzAssured);
  }

  const activeRanges = Object.keys(clientsRanges || {}).filter(
    (k) => clientsRanges[k],
  );
  if (activeRanges.length > 0) {
    result = result.filter((expert) => {
      const trained = parseInt(expert.clientsTrained, 10) || 0;
      return activeRanges.some((option) => {
        if (option.includes("+")) {
          const min = parseInt(option, 10);
          return trained >= min;
        }
        const [min, max] = option.split("-").map((n) => parseInt(n, 10));
        return trained >= min && trained <= max;
      });
    });
  }

  return result;
}

/**
 * Listing search with paid/free split; free tier is paginated server-side.
 */
const EMPTY_LOCATION = { mode: "none" };

export function useExpertsListingSearch({
  selectedSpecialities = [],
  locationFilter: locationFilterProp = EMPTY_LOCATION,
  searchClientLocation = null,
  nameQuery = "",
  certificationQuery = "",
}) {
  const [page, setPageState] = useState(1);
  const [paid, setPaid] = useState([]);
  const [free, setFree] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [languages, setLanguages] = useState([]);
  const [consultationMode, setConsultationMode] = useState("");
  const [radiusKm, setRadiusKm] = useState(20);

  const [clientsRanges, setClientsRanges] = useState({});
  const [wzAssured, setWzAssured] = useState(false);

  /** Memoize forward-geocoding for typed cities (same as GPS path → $geoNear on backend). */
  const geocodeCacheRef = useRef({});

  const locationFilter = locationFilterProp || EMPTY_LOCATION;

  const useGeo = searchClientLocation?.coordinates?.length === 2;

  const hasStructuredLocation = useMemo(() => {
    const m = locationFilter.mode;
    if (m === "none") return false;
    if (m === "city") return Boolean((locationFilter.city || "").trim());
    if (m === "state") return Boolean((locationFilter.state || "").trim());
    if (m === "country") return Boolean((locationFilter.country || "").trim());
    return false;
  }, [locationFilter]);

  const useRadius = useGeo || hasStructuredLocation;

  const immediateFilters = useMemo(
    () => ({
      city:
        useGeo || locationFilter.mode !== "city"
          ? ""
          : (locationFilter.city || "").trim(),
      state:
        locationFilter.mode === "state"
          ? (locationFilter.state || "").trim()
          : "",
      country:
        locationFilter.mode === "state" || locationFilter.mode === "country"
          ? (locationFilter.country || "").trim()
          : "",
      expertiseTags: selectedSpecialities,
      clientLocation: useGeo ? searchClientLocation : null,
      consultationMode: useGeo ? "both" : consultationMode,
      radiusKm: useRadius ? radiusKm : "",
      languages,
      nameQuery: (nameQuery || "").trim(),
      certificationQuery: (certificationQuery || "").trim(),
    }),
    [
      useGeo,
      useRadius,
      locationFilter,
      selectedSpecialities,
      searchClientLocation,
      consultationMode,
      radiusKm,
      languages,
      nameQuery,
      certificationQuery,
    ],
  );

  const debouncedFilters = useDebouncedValue(
    immediateFilters,
    EXPERTS_FILTER_DEBOUNCE_MS,
  );

  const buildApiParams = useCallback(
    (pageNum, filters = debouncedFilters) => {
      return {
        city: filters.city,
        state: filters.state,
        country: filters.country,
        expertiseTags: filters.expertiseTags,
        clientLocation: filters.clientLocation,
        consultationMode: filters.consultationMode,
        radiusKm: filters.radiusKm,
        page: pageNum,
        languages: filters.languages,
        nameQuery: filters.nameQuery,
        certificationQuery: filters.certificationQuery,
      };
    },
    [debouncedFilters],
  );

  const resolveGeoFromCityText = useCallback(async (filters) => {
    const coords = filters.clientLocation?.coordinates;
    const hasClientCoords =
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number";

    const city = (filters.city || "").trim();
    const radiusNum = Number(filters.radiusKm);

    if (hasClientCoords || !city || !(radiusNum > 0)) {
      return filters;
    }

    if (filters.consultationMode === "online") {
      return filters;
    }

    const key = city.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(geocodeCacheRef.current, key)) {
      const cached = geocodeCacheRef.current[key];
      if (!cached) return filters;
      return {
        ...filters,
        city: "",
        clientLocation: {
          type: "Point",
          coordinates: [cached.lon, cached.lat],
        },
        consultationMode:
          filters.consultationMode === "in_person" ? "in_person" : "both",
      };
    }

    try {
      const res = await fetch(
        `/api/geocode-search?q=${encodeURIComponent(city)}`,
      );
      if (!res.ok) {
        geocodeCacheRef.current[key] = null;
        return filters;
      }
      const data = await res.json();
      if (data.lat == null || data.lon == null) {
        geocodeCacheRef.current[key] = null;
        return filters;
      }
      geocodeCacheRef.current[key] = { lat: data.lat, lon: data.lon };
      return {
        ...filters,
        city: "",
        clientLocation: {
          type: "Point",
          coordinates: [data.lon, data.lat],
        },
        consultationMode:
          filters.consultationMode === "in_person" ? "in_person" : "both",
      };
    } catch {
      geocodeCacheRef.current[key] = null;
      return filters;
    }
  }, []);

  const fetchListings = useCallback(
    async (pageNum, filters = debouncedFilters) => {
      setLoading(true);
      setError(null);
      try {
        const resolved = await resolveGeoFromCityText(filters);
        const params = buildApiParams(pageNum, resolved);
        const res = await searchListings(params);
        setPaid(res.paid);
        setFree(res.free);
        setMeta(res.meta || {});
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
        setPaid([]);
        setFree([]);
        setMeta({});
      } finally {
        setLoading(false);
      }
    },
    [buildApiParams, debouncedFilters, resolveGeoFromCityText],
  );

  useEffect(() => {
    setPageState(1);
    fetchListings(1, debouncedFilters);
  }, [
    debouncedFilters,
    fetchListings,
  ]);

  useEffect(() => {
    if (page <= 1) return;
    fetchListings(page, debouncedFilters);
  }, [page, fetchListings, debouncedFilters]);

  const runSearch = useCallback(async () => {
    setPageState(1);
    await fetchListings(1, immediateFilters);
  }, [fetchListings, immediateFilters]);

  const setPage = useCallback((n) => {
    setPageState(Math.max(1, Number(n) || 1));
  }, []);

  const displayFree = useMemo(
    () => applyClientFilters(free, { clientsRanges, wzAssured }),
    [free, clientsRanges, wzAssured],
  );

  const hasNextPage =
    (meta?.freeReturned ?? free?.length ?? 0) === FREE_PAGE_SIZE;
  const hasPrevPage = page > 1;
  const totalPages =
    Number(meta?.freeTotalPages ?? meta?.totalPages ?? meta?.pages ?? 0) || 0;

  return {
    paid,
    free,
    displayFree,
    meta,
    page,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    totalPages,
    runSearch,
    setPage,
    languages,
    setLanguages,
    consultationMode,
    setConsultationMode,
    radiusKm,
    setRadiusKm,
    clientsRanges,
    setClientsRanges,
    wzAssured,
    setWzAssured,
    buildApiParams,
  };
}
