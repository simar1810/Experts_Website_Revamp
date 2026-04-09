"use client";

import { useState, useMemo } from "react";
import { useValues } from "@/context/valuesContext";
import { CheckCircle2, ChevronDown } from "lucide-react";

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

export default function ExpertsFiltersSidebar({
  useGeo = false,
  locationLabel = "All Cities",
  freeCount = 0,
  languages = [],
  setLanguages,
  consultationMode = "",
  setConsultationMode,
  radiusKm = 20,
  setRadiusKm,
  clientsRanges = {},
  setClientsRanges,
  wzAssured = false,
  setWzAssured,
  onClose,
}) {
  const [openSections, setOpenSections] = useState({
    clients: true,
    languages: true,
    distance: true,
  });

  const { values } = useValues();

  const languageMap = useMemo(() => {
    const m = {};
    (values?.languages || []).forEach((l) => {
      m[l] = languages.includes(l);
    });
    return m;
  }, [values?.languages, languages]);

  const setLanguageChecked = (lang, checked) => {
    setLanguages((prev) => {
      const p = Array.isArray(prev) ? [...prev] : [];
      if (checked) {
        if (!p.includes(lang)) p.push(lang);
      } else {
        return p.filter((x) => x !== lang);
      }
      return p;
    });
  };

  const handleClientsChange = (name) => {
    setClientsRanges((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleClearFilters = () => {
    setLanguages([]);
    setConsultationMode("");
    setRadiusKm(20);
    const cleared = {};
    clients_options.forEach((c) => {
      cleared[c] = false;
    });
    setClientsRanges(cleared);
    setWzAssured(false);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col w-full bg-gray-50/80 rounded-2xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
      <div className="bg-[#1a4d2e] text-white p-5 lg:p-6">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-base tracking-tight leading-tight">
            Search Results:
          </h4>
        </div>
        <p className="text-base font-black  ">
          {freeCount} Coaches in {locationLabel}
        </p>
      </div>

      <div className="p-5 lg:p-7 space-y-6 lg:space-y-8 bg-white">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Filter</h3>
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-white bg-[#67BC2A] hover:shadow p-1 px-2 rounded-full shrink-0"
            >
              Clear
            </button>
          </div>
          <div className="p-4 bg-lime-50/50 rounded-2xl border border-lime-100/50">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#70C136] rounded-lg flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-gray-900">
                  WZ Assured
                </span>
              </div>
              <input
                type="checkbox"
                checked={wzAssured}
                onChange={() => setWzAssured(!wzAssured)}
                className="w-5 h-5 rounded accent-[#70C136] cursor-pointer"
              />
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <h6 className="text-xs font-black text-gray-900 uppercase border-l-2 border-[#70C136] pl-3">
            Consultation Mode
          </h6>
          <div className="space-y-2 pl-1">
            {CONSULTATION_OPTIONS.map((opt) => (
              <label
                key={opt.label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="consultationMode"
                  checked={consultationMode === opt.value}
                  onChange={() => setConsultationMode(opt.value)}
                  className="w-4 h-4 accent-[#70C136]"
                />
                <span className="text-sm font-bold text-gray-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => toggleSection("clients")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-xs font-black uppercase border-l-2 border-[#70C136] pl-3">
              No. of Clients
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${openSections.clients ? "" : "rotate-180"}`}
            />
          </button>
          {openSections.clients && (
            <div className="grid grid-cols-1 gap-2 pl-1">
              {clients_options.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={clientsRanges[item] || false}
                    onChange={() => handleClientsChange(item)}
                    className="w-4 h-4 accent-[#70C136]"
                  />
                  <span className="text-sm font-bold text-gray-600">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => toggleSection("languages")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-xs font-black uppercase border-l-2 border-[#70C136] pl-3">
              Languages
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${openSections.languages ? "" : "rotate-180"}`}
            />
          </button>
          {openSections.languages && (values?.languages || []).length > 0 && (
            <div className="grid grid-cols-1 gap-2 pl-1 max-h-48 overflow-y-auto">
              {(values?.languages || []).map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={languageMap[item] || false}
                    onChange={(e) => setLanguageChecked(item, e.target.checked)}
                    className="w-4 h-4 accent-[#70C136]"
                  />
                  <span className="text-sm font-bold text-gray-600">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {useGeo && (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => toggleSection("distance")}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-xs font-black uppercase border-l-2 border-[#70C136] pl-3">
                Distance (km)
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${openSections.distance ? "" : "rotate-180"}`}
              />
            </button>
            {openSections.distance && (
              <div className="px-1 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
                  <span>0</span>
                  <span className="text-[#70C136]">{radiusKm} km</span>
                  <span>200</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  step={5}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-lime-100 accent-[#70C136]"
                />
              </div>
            )}
          </div>
        )}
        {onClose && (
          <div className="lg:hidden pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
