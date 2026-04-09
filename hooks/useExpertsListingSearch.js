"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { searchListings } from "@/lib/services/listingSearch.service";

const FREE_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

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
export function useExpertsListingSearch({
  selectedSpecialities = [],
  locationQuery = "",
  searchClientLocation = null,
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

  const useGeo = searchClientLocation?.coordinates?.length === 2;

  const immediateFilters = useMemo(
    () => ({
      city: useGeo ? "" : (locationQuery || "").trim(),
      expertiseTags: selectedSpecialities,
      clientLocation: useGeo ? searchClientLocation : null,
      consultationMode: useGeo ? "both" : consultationMode,
      radiusKm: useGeo ? radiusKm : "",
      languages,
    }),
    [
      useGeo,
      locationQuery,
      selectedSpecialities,
      searchClientLocation,
      consultationMode,
      radiusKm,
      languages,
    ],
  );

  const [debouncedFilters, setDebouncedFilters] = useState(immediateFilters);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedFilters(immediateFilters),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [immediateFilters]);

  const buildApiParams = useCallback(
    (pageNum, filters = debouncedFilters) => {
      return {
        city: filters.city,
        expertiseTags: filters.expertiseTags,
        clientLocation: filters.clientLocation,
        consultationMode: filters.consultationMode,
        radiusKm: filters.radiusKm,
        page: pageNum,
        languages: filters.languages,
      };
    },
    [debouncedFilters],
  );

  const fetchListings = useCallback(
    async (pageNum, filters = debouncedFilters) => {
      setLoading(true);
      setError(null);
      try {
        const params = buildApiParams(pageNum, filters);
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
    [buildApiParams, debouncedFilters],
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
