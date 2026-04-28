"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchListings } from "@/lib/services/listingSearch.service";
import { EXPERTS_FILTER_DEBOUNCE_MS } from "@/lib/constants/filters";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

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
 * Listing search with paid/free split. UI page size is applied client-side
 * (slice) because the listing API does not honor a configurable page size.
 */
const EMPTY_LOCATION = { mode: "none" };

export function useExpertsListingSearch({
  selectedSpecialities = [],
  locationFilter: locationFilterProp = EMPTY_LOCATION,
  searchClientLocation = null,
  nameQuery = "",
}) {
  const [pageSize, setPageSizeState] = useState(10);
  const [page, setPageState] = useState(1);
  const [paid, setPaid] = useState([]);
  const [free, setFree] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [languages, setLanguages] = useState([]);
  // const [specializations, setSpecializations] = useState([]); 
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
    ],
  );

  const debouncedFilters = useDebouncedValue(
    immediateFilters,
    EXPERTS_FILTER_DEBOUNCE_MS,
  );

  const buildApiParams = useCallback(
    (filters = debouncedFilters) => {
      return {
        city: filters.city,
        state: filters.state,
        country: filters.country,
        expertiseTags: filters.expertiseTags,
        clientLocation: filters.clientLocation,
        consultationMode: filters.consultationMode,
        radiusKm: filters.radiusKm,
        page: 1,
        languages: filters.languages,
        nameQuery: filters.nameQuery,
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
    async (filters = debouncedFilters) => {
      setLoading(true);
      setError(null);
      try {
        const resolved = await resolveGeoFromCityText(filters);
        const params = buildApiParams(resolved);
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

  const setPageSize = useCallback((next) => {
    const n = Number(next);
    const clamped =
      Number.isFinite(n) && n > 0 ? Math.min(100, Math.max(5, Math.floor(n))) : 10;
    setPageSizeState(clamped);
  }, []);

  useEffect(() => {
    setPageState(1);
    fetchListings(debouncedFilters);
  }, [debouncedFilters, fetchListings]);

  useEffect(() => {
    setPageState(1);
  }, [pageSize]);

  const runSearch = useCallback(async () => {
    setPageState(1);
    await fetchListings(immediateFilters);
  }, [fetchListings, immediateFilters]);

  const setPage = useCallback((n) => {
    setPageState(Math.max(1, Number(n) || 1));
  }, []);

  const filteredFreeFull = useMemo(
    () => applyClientFilters(free, { clientsRanges, wzAssured }),
    [free, clientsRanges, wzAssured],
  );

  const filteredTotal = filteredFreeFull.length;
  const clientTotalPages = useMemo(() => {
    if (filteredTotal === 0) return 0;
    return Math.max(1, Math.ceil(filteredTotal / pageSize));
  }, [filteredTotal, pageSize]);

  const activePage = useMemo(() => {
    if (clientTotalPages === 0) return 1;
    return Math.min(Math.max(1, page), clientTotalPages);
  }, [page, clientTotalPages]);

  const displayFree = useMemo(() => {
    if (filteredTotal === 0) return [];
    const start = (activePage - 1) * pageSize;
    return filteredFreeFull.slice(start, start + pageSize);
  }, [filteredFreeFull, filteredTotal, activePage, pageSize]);

  const hasNextPage =
    clientTotalPages > 0 ? activePage < clientTotalPages : false;
  const hasPrevPage = activePage > 1;

  const freeReturned = meta?.freeReturned ?? filteredTotal;

  return {
    paid,
    free,
    filteredTotal,
    displayFree,
    meta,
    page: activePage,
    pageSize,
    setPageSize,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    totalPages: clientTotalPages,
    runSearch,
    setPage,
    languages,
    setLanguages,
    // specializations, 
    // setSpecializations,  
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
