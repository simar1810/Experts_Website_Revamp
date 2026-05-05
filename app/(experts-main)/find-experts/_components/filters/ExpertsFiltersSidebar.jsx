"use client";

import { useValues } from "@/context/valuesContext";
import { EXPERTS_FILTER_DEBOUNCE_MS } from "@/lib/constants/filters";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

function sameLangs(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((x, i) => x === sb[i]);
}

function sameClients(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

const clients_options = [
  "0-100",
  "100-200",
  "200-300",
  "300-400",
  "400-500",
  "500+",
];

const CONSULTATION_OPTIONS = [
  { value: "", label: "Any" },
  { value: "online", label: "Online" },
  { value: "in_person", label: "In Person" },
  { value: "both", label: "Hybrid" },
];

/** Distance slider range (desktop + sheet — same semantics). */
const DISTANCE_SLIDER_MAX_KM = 200;
const DISTANCE_SLIDER_STEP = 5;

/** ~4 stacked options tall, then internal scroll (single-column checklists). */
const FILTER_OPTIONS_SCROLL_SINGLE =
  "max-h-[11rem] overflow-y-auto overscroll-y-contain pr-1 touch-pan-y [scrollbar-gutter:stable]";
/** ~4 options in a 2-column grid (two rows visible), then scroll — sheet specialization / languages / clients. */
const FILTER_OPTIONS_SCROLL_GRID_2 =
  "max-h-[8.75rem] overflow-y-auto overscroll-y-contain pr-1 touch-pan-y [scrollbar-gutter:stable]";

function countTruthy(obj) {
  if (!obj || typeof obj !== "object") return 0;
  return Object.keys(obj).filter((k) => obj[k]).length;
}

/** Flipkart-style “how many knobs are tuned” badge (facet selections). */
function useActiveFacetCount({
  specializationCount,
  languageCount,
  clientBucketCount,
  consultationSet,
  wzToggle,
  distanceActive,
}) {
  return useMemo(() => {
    let n =
      specializationCount +
      languageCount +
      clientBucketCount +
      (consultationSet ? 1 : 0) +
      (wzToggle ? 1 : 0);
    if (distanceActive) n += 1;
    return n;
  }, [
    specializationCount,
    languageCount,
    clientBucketCount,
    consultationSet,
    wzToggle,
    distanceActive,
  ]);
}

const ExpertsFiltersSidebar = forwardRef(function ExpertsFiltersSidebar(
  {
    showDistanceFilter = false,
    /** When embedding in bottom sheet: sync drafts when sheet opens; parent passes open state */
    sheetOpen = undefined,
    locationLabel = "All Cities",
    freeCount = 0,
    languages = [],
    setLanguages,
    selectedSpecialities = [],
    setSelectedSpecialities,
    consultationMode = "",
    setConsultationMode,
    radiusKm = 20,
    setRadiusKm,
    clientsRanges = {},
    setClientsRanges,
    wzAssured = false,
    setWzAssured,
    onClose,
    embedInSheet = false,
  },
  ref,
) {
  const debounceMs = EXPERTS_FILTER_DEBOUNCE_MS;

  const [openSections, setOpenSections] = useState({
    clients: true,
    languages: true,
    specializations: true,
  });

  const { values } = useValues();


  const [localWz, setLocalWz] = useState(wzAssured);
  const [localConsultation, setLocalConsultation] = useState(consultationMode);
  const [localLanguages, setLocalLanguages] = useState(() => [...languages]);
  const [localClients, setLocalClients] = useState(() => ({
    ...clientsRanges,
  }));
  const [localRadius, setLocalRadius] = useState(radiusKm);
  const [localSpecializations, setLocalSpecializations] = useState(() => [
    ...selectedSpecialities,
  ]); //Specializations
  const radiusCommitTimerRef = useRef(null);
  /** Latest applied (parent) filter snapshot — used to reset sheet draft when opening. */
  const appliedSnapshotRef = useRef(null);
  const sheetWasOpenRef = useRef(false);

  appliedSnapshotRef.current = {
    languages: [...(languages || [])],
    selectedSpecialities: [...(selectedSpecialities || [])],
    consultationMode,
    wzAssured,
    clientsRanges: { ...clientsRanges },
    radiusKm,
  };

  useEffect(() => {
    if (!embedInSheet || sheetOpen !== true) {
      sheetWasOpenRef.current = false;
      return;
    }
    if (sheetWasOpenRef.current) return;
    sheetWasOpenRef.current = true;
    const a = appliedSnapshotRef.current || {};
    setLocalLanguages([...(a.languages ?? [])]);
    setLocalSpecializations([...(a.selectedSpecialities ?? [])]);
    setLocalConsultation(a.consultationMode ?? "");
    setLocalWz(!!a.wzAssured);
    setLocalClients(
      typeof a.clientsRanges === "object" && a.clientsRanges
        ? { ...a.clientsRanges }
        : {},
    );
    const rk = Number(a.radiusKm);
    setLocalRadius(Number.isFinite(rk) ? rk : 20);
  }, [embedInSheet, sheetOpen]);

  useEffect(() => {
    setLocalWz(wzAssured);
  }, [wzAssured]);

  useEffect(() => {
    if (localWz === wzAssured) return;
    const id = setTimeout(() => setWzAssured(localWz), debounceMs);
    return () => clearTimeout(id);
  }, [localWz, wzAssured, setWzAssured, debounceMs]);

  useEffect(() => {
    setLocalConsultation(consultationMode);
  }, [consultationMode]);

  useEffect(() => {
    if (localConsultation === consultationMode) return;
    const id = setTimeout(
      () => setConsultationMode(localConsultation),
      debounceMs,
    );
    return () => clearTimeout(id);
  }, [localConsultation, consultationMode, setConsultationMode, debounceMs]);

  useEffect(() => {
    setLocalLanguages((prev) =>
      sameLangs(prev, languages) ? prev : [...languages],
    );
  }, [languages]);

  useEffect(() => {
    if (sameLangs(localLanguages, languages)) return;
    const id = setTimeout(() => setLanguages([...localLanguages]), debounceMs);
    return () => clearTimeout(id);
  }, [localLanguages, languages, setLanguages, debounceMs]);

  // Specialization
  useEffect(() => {
    setLocalSpecializations((prev) =>
      sameLangs(prev, selectedSpecialities) ? prev : [...selectedSpecialities],
    );
  }, [selectedSpecialities]);

  // useEffect(() => {
  //   if (sameLangs(localSpecializations, specializations)) return;
  //   const id = setTimeout(
  //     () => setSpecializations([...localSpecializations]),
  //     debounceMs,
  //   );
  //   return () => clearTimeout(id);
  // }, [localSpecializations, specializations, setSpecializations, debounceMs]);

  useEffect(() => {
    if (sameLangs(localSpecializations, selectedSpecialities)) return;

    const id = setTimeout(() => {
      setSelectedSpecialities([...localSpecializations]);
    }, debounceMs);

    return () => clearTimeout(id);
  }, [
    localSpecializations,
    selectedSpecialities,
    setSelectedSpecialities,
    debounceMs,
  ]);

  useEffect(() => {
    setLocalClients((prev) =>
      sameClients(prev, clientsRanges) ? prev : { ...clientsRanges },
    );
  }, [clientsRanges]);

  useEffect(() => {
    if (sameClients(localClients, clientsRanges)) return;
    const id = setTimeout(
      () => setClientsRanges({ ...localClients }),
      debounceMs,
    );
    return () => clearTimeout(id);
  }, [localClients, clientsRanges, setClientsRanges, debounceMs]);

  useEffect(() => {
    setLocalRadius(radiusKm);
  }, [radiusKm]);

  useEffect(() => {
    return () => {
      if (radiusCommitTimerRef.current) {
        clearTimeout(radiusCommitTimerRef.current);
      }
    };
  }, []);

  const scheduleRadiusCommit = (v) => {
    if (radiusCommitTimerRef.current) {
      clearTimeout(radiusCommitTimerRef.current);
    }
    radiusCommitTimerRef.current = setTimeout(() => {
      radiusCommitTimerRef.current = null;
      setRadiusKm(v);
    }, debounceMs);
  };

  const flushRadiusCommit = (v) => {
    if (radiusCommitTimerRef.current) {
      clearTimeout(radiusCommitTimerRef.current);
      radiusCommitTimerRef.current = null;
    }
    setRadiusKm(v);
  };

  const flushFiltersToParent = useCallback(() => {
    if (radiusCommitTimerRef.current) {
      clearTimeout(radiusCommitTimerRef.current);
      radiusCommitTimerRef.current = null;
    }
    setWzAssured(localWz);
    setConsultationMode(localConsultation);
    setLanguages([...localLanguages]);
    setClientsRanges({ ...localClients });
    setRadiusKm(localRadius);
    setSelectedSpecialities([...localSpecializations]);
  }, [
    localWz,
    localConsultation,
    localLanguages,
    localClients,
    localRadius,
    localSpecializations,
    setWzAssured,
    setConsultationMode,
    setLanguages,
    setClientsRanges,
    setRadiusKm,
    setSelectedSpecialities,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      flushToParent: flushFiltersToParent,
    }),
    [flushFiltersToParent],
  );

  const languageMap = useMemo(() => {
    const m = {};
    (values?.languages || []).forEach((l) => {
      m[l] = localLanguages.includes(l);
    });
    return m;
  }, [values?.languages, localLanguages]);

  const setLanguageChecked = (lang, checked) => {
    setLocalLanguages((prev) => {
      const p = Array.isArray(prev) ? [...prev] : [];
      if (checked) {
        if (!p.includes(lang)) p.push(lang);
        return p;
      }
      return p.filter((x) => x !== lang);
    });
  };

  const handleClientsChange = (name) => {
    setLocalClients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleClearFilters = () => {
    if (radiusCommitTimerRef.current) {
      clearTimeout(radiusCommitTimerRef.current);
      radiusCommitTimerRef.current = null;
    }
    const cleared = {};
    clients_options.forEach((c) => {
      cleared[c] = false;
    });
    // Clear local drafts first so the debounced specialty effect cannot replay stale specials.
    setLocalSpecializations([]);
    setLocalWz(false);
    setLocalConsultation("");
    setLocalRadius(20);
    setLocalLanguages([]);
    setLocalClients(cleared);
    setSelectedSpecialities([]);
    setLanguages([]);
    setConsultationMode("");
    setRadiusKm(20);
    setClientsRanges(cleared);
    setWzAssured(false);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clientBucketsSelected = countTruthy(localClients);
  const distanceDeviation =
    showDistanceFilter && Number(localRadius) !== 20;
  const activeFacetCount = useActiveFacetCount({
    specializationCount: localSpecializations.length,
    languageCount: localLanguages.length,
    clientBucketCount: clientBucketsSelected,
    consultationSet: Boolean((localConsultation || "").trim()),
    wzToggle: localWz,
    distanceActive: distanceDeviation,
  });

  const checkboxClass = embedInSheet
    ? "size-4 shrink-0 rounded-sm border border-gray-300 text-[#70C136] focus:ring-[#70C136] accent-[#70C136]"
    : "w-4 h-4 accent-[#70C136]";

  const distanceSectionDesktop = showDistanceFilter && !embedInSheet && (
    <div className="space-y-3">
      <h6 className="text-xs font-black text-gray-900 uppercase border-l-2 border-[#70C136] pl-3">
        Distance (km)
      </h6>
      <div className="px-1 pt-1">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
          <span>0</span>
          <span className="text-[#70C136]">{localRadius} km</span>
          <span>{DISTANCE_SLIDER_MAX_KM}</span>
        </div>
        <input
          type="range"
          min={0}
          max={DISTANCE_SLIDER_MAX_KM}
          step={DISTANCE_SLIDER_STEP}
          value={localRadius}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocalRadius(v);
            scheduleRadiusCommit(v);
          }}
          onPointerUp={(e) =>
            flushRadiusCommit(Number(e.currentTarget.value))
          }
          onPointerCancel={() => flushRadiusCommit(localRadius)}
          className="w-full h-2 rounded-full appearance-none bg-lime-100 accent-[#70C136]"
        />
      </div>
    </div>
  );

  const distanceSectionSheet = showDistanceFilter && embedInSheet && (
    <section className="py-4">
      <div className="mb-3 flex items-end justify-between gap-2">
        <h3 className="font-bold text-base text-gray-900">Distance</h3>
        <span className="text-sm font-bold tabular-nums text-[#70C136]">
          {Math.round(Number(localRadius) || 0)} km
        </span>
      </div>
      <div className="pt-1">
        <input
          type="range"
          aria-label="Search radius in kilometers"
          min={0}
          max={DISTANCE_SLIDER_MAX_KM}
          step={DISTANCE_SLIDER_STEP}
          value={Math.min(Math.max(0, localRadius), DISTANCE_SLIDER_MAX_KM)}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocalRadius(v);
            scheduleRadiusCommit(v);
          }}
          onPointerUp={(e) =>
            flushRadiusCommit(Number(e.currentTarget.value))
          }
          onPointerCancel={() => flushRadiusCommit(localRadius)}
          className="sheet-distance-slider w-full"
          style={{
            "--range-fill": `${((Math.min(localRadius, DISTANCE_SLIDER_MAX_KM) || 0) / DISTANCE_SLIDER_MAX_KM) * 100}%`,
          }}
        />
        <div className="mt-2 flex justify-between text-[11px] text-gray-400 tabular-nums">
          <span>0 km</span>
          <span>{DISTANCE_SLIDER_MAX_KM} km</span>
        </div>
      </div>
    </section>
  );

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80 shadow-sm lg:h-full lg:max-h-full",
        embedInSheet &&
          "h-full max-h-full rounded-none border-0 bg-white shadow-none",
      )}
    >
      {!embedInSheet && (
        <div className="shrink-0 bg-[#1a4d2e] p-5 text-white lg:p-6">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-base tracking-tight leading-tight">
              Search Results:
            </h4>
          </div>
          <p className="text-base font-black">
            {freeCount} Coaches in {locationLabel}
          </p>
        </div>
      )}

      {embedInSheet ? (
        <>
          <div className="shrink-0 flex items-start justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Filters
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {activeFacetCount > 0
                  ? `${activeFacetCount} filter${activeFacetCount === 1 ? "" : "s"} on`
                  : "Refine by category, mode, and more"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="shrink-0 text-sm font-semibold text-[#70C136] active:opacity-80"
            >
              Clear all
            </button>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-gray-200 overflow-y-auto overscroll-y-contain bg-white px-5 [scrollbar-gutter:stable]">
            <section className="py-4">
              <h3 className="font-bold text-base text-gray-900 mb-3">
                Specialization
              </h3>
              <div
                className={`grid grid-cols-2 gap-x-4 gap-y-3 ${FILTER_OPTIONS_SCROLL_GRID_2}`}
              >
                {(values?.expertise_categories || []).map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-start gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={localSpecializations.includes(item)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setLocalSpecializations((prev) => {
                          if (checked) {
                            return prev.includes(item) ? prev : [...prev, item];
                          }
                          return prev.filter((x) => x !== item);
                        });
                      }}
                      className={checkboxClass}
                    />
                    <span className="text-sm font-normal leading-snug text-gray-800">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="py-4">
              <h3 className="font-bold text-base text-gray-900 mb-3">
                Consultation Mode
              </h3>
              <div className="flex flex-wrap gap-2">
                {CONSULTATION_OPTIONS.map((opt) => {
                    const selected = localConsultation === opt.value;
                    return (
                      <label
                        key={opt.value || "any"}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors",
                          selected
                            ? "border-[#70C136] bg-[#70C136]/10"
                            : "border-gray-200 bg-white",
                        )}
                      >
                        <input
                          type="radio"
                          name="consultationModeSheet"
                          checked={selected}
                          onChange={() => setLocalConsultation(opt.value)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                            selected
                              ? "border-[#70C136] bg-[#70C136] text-white"
                              : "border-gray-300 bg-white",
                          )}
                          aria-hidden
                        >
                          {selected ? (
                            <svg
                              className="size-2.5"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                d="M2 6l3 3 5-6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </section>
            {/* TODO: Future Scope */}
            {/* <section className="py-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3">
                <input
                  type="checkbox"
                  checked={localWz}
                  onChange={() => setLocalWz((v) => !v)}
                  className={checkboxClass}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">
                    WZ Assured only
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    Show experts with the WZ Assured badge
                  </span>
                </span>
              </label>
            </section> */}


            <section className="py-4">
              <button
                type="button"
                aria-expanded={openSections.languages}
                onClick={() => toggleSection("languages")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-bold text-base text-gray-900">
                  Languages
                  {localLanguages.length > 0 ? (
                    <span className="ml-2 text-sm font-semibold text-[#70C136]">
                      ({localLanguages.length})
                    </span>
                  ) : null}
                </h3>
                {openSections.languages ? (
                  <ChevronUp className="size-5 text-gray-400" />
                ) : (
                  <ChevronDown className="size-5 text-gray-400" />
                )}
              </button>
              {openSections.languages &&
                (values?.languages || []).length > 0 && (
                  <div
                    className={`mt-3 grid grid-cols-2 gap-x-4 gap-y-3 ${FILTER_OPTIONS_SCROLL_GRID_2}`}
                  >
                    {(values?.languages || []).map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-start gap-2.5"
                      >
                        <input
                          type="checkbox"
                          checked={languageMap[item] || false}
                          onChange={(e) =>
                            setLanguageChecked(item, e.target.checked)
                          }
                          className={checkboxClass}
                        />
                        <span className="text-sm font-normal text-gray-800">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
            </section>

            {distanceSectionSheet}
          </div>
          {onClose && (
            <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  flushFiltersToParent();
                  onClose();
                }}
                className="w-full rounded-xl bg-[#70C136] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#5fa82f] active:scale-[0.99]"
              >
                Apply filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-y-contain bg-white p-5 lg:space-y-8 lg:p-7 [scrollbar-gutter:stable]">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-xl tracking-tight text-gray-900">
                  Filters
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {activeFacetCount > 0
                    ? `${activeFacetCount} active — results update as you change`
                    : "Refine by category, mode, and more"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="cursor-pointer shrink-0 rounded-full bg-[#67BC2A] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:shadow"
              >
                Clear all
              </button>
            </div>
          </div>
          {distanceSectionDesktop}

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              aria-expanded={openSections.specializations}
              onClick={() => toggleSection("specializations")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="border-l-2 border-[#70C136] pl-3 text-xs font-black uppercase text-gray-900">
                Specializations
                {localSpecializations.length > 0 ? (
                  <span className="ml-2 text-[13px] font-bold text-[#70C136]">
                    ({localSpecializations.length})
                  </span>
                ) : null}
              </span>
              <ChevronUp
                className={`size-4 text-gray-400 transition-transform ${
                  openSections.specializations ? "" : "rotate-180"
                }`}
              />
            </button>
            {openSections.specializations && (
              <div
                className={`space-y-2 pl-1 pr-2 ${FILTER_OPTIONS_SCROLL_SINGLE}`}
              >
                {(values?.expertise_categories || []).map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={localSpecializations.includes(item)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setLocalSpecializations((prev) => {
                          if (checked) {
                            return prev.includes(item) ? prev : [...prev, item];
                          }
                          return prev.filter((x) => x !== item);
                        });
                      }}
                      className={checkboxClass}
                    />
                    <span className="text-sm font-bold text-gray-600">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h6 className="border-l-2 border-[#70C136] pl-3 text-xs font-black uppercase text-gray-900">
              Consultation Mode
            </h6>
            <div className="space-y-2 pl-1">
              {CONSULTATION_OPTIONS.map((opt) => (
                <label
                  key={opt.value || "any"}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="consultationMode"
                    checked={localConsultation === opt.value}
                    onChange={() => setLocalConsultation(opt.value)}
                    className="size-4 accent-[#70C136]"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* TODO: Future Scope */}
          {/* <div className="space-y-4 border-t border-gray-100 pt-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/90 px-3 py-3">
              <input
                type="checkbox"
                checked={localWz}
                onChange={() => setLocalWz((v) => !v)}
                className={checkboxClass}
              />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-gray-800">
                  WZ Assured only
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  Verified Zeefit
                </span>
              </span>
            </label>
          </div> */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              aria-expanded={openSections.languages}
              onClick={() => toggleSection("languages")}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="border-l-2 border-[#70C136] pl-3 text-xs font-black uppercase text-gray-900">
                Languages
                {localLanguages.length > 0 ? (
                  <span className="ml-2 text-[13px] font-bold text-[#70C136]">
                    ({localLanguages.length})
                  </span>
                ) : null}
              </span>
              <ChevronUp
                className={`size-4 text-gray-400 transition-transform ${
                  openSections.languages ? "" : "rotate-180"
                }`}
              />
            </button>
            {openSections.languages &&
              (values?.languages || []).length > 0 && (
                <div
                  className={`grid grid-cols-1 gap-2 pl-1 ${FILTER_OPTIONS_SCROLL_SINGLE}`}
                >
                  {(values?.languages || []).map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={languageMap[item] || false}
                        onChange={(e) =>
                          setLanguageChecked(item, e.target.checked)
                        }
                        className={checkboxClass}
                      />
                      <span className="text-sm font-bold text-gray-600">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
});

ExpertsFiltersSidebar.displayName = "ExpertsFiltersSidebar";

export default ExpertsFiltersSidebar;
