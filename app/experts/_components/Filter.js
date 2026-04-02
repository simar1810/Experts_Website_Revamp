"use client";
import { useState, useEffect } from "react";
import { useValues } from "@/context/valuesContext";
import { getFilteredExperts } from "@/lib/experts_fetch";
import { CheckCircle2, ChevronDown } from "lucide-react";

export default function Filters({
  filteredExperts,
  setFilteredExperts,
  filteredExpertsCount,
  selectedSpecialities,
  locationQuery,
  onClose,
}) {
  const [openSections, setOpenSections] = useState({
    clients: true,
    languages: true,
    distance: true,
  });

  const { values } = useValues();
  const consultation_modes = ["online", "offline", "both"];
  const clients_options = [
    "0-100",
    "100-200",
    "200-300",
    "300-400",
    "400-500",
    "500+",
  ];
  const distance_options = [
    "Under 10",
    "Under 20",
    "Under 30",
    "Under 40",
    "Under 50",
  ];

  const [allExperts, setAllExperts] = useState([]);
  const [filterInputs, setFilterInputs] = useState({
    Languages: {},
    Consultation: {},
    Distance: {},
    Clients_no: {},
  });
  const [wzAssured, setWzAssured] = useState(false);

  // ✅ Fetch ONLY once and initialize filters
  useEffect(() => {
    async function fetchData() {
      // Get selected distance radius
      const activeDistance = Object.keys(filterInputs.Distance).find(
        (d) => filterInputs.Distance[d],
      );
      const radiusKm = activeDistance
        ? parseInt(activeDistance.replace(/\D/g, ""))
        : "";

      const experts = await getFilteredExperts({
        city: locationQuery,
        expertiseTags: selectedSpecialities,
        radiusKm: radiusKm,
      });

      setAllExperts(Array.isArray(experts) ? experts : []);

      // Re-initialize other filter types if first load, but preserve current state if it's a radius change
      // Actually, if radius changes, we just want to update allExperts.
      // The local filters (Languages, Consultation, Clients) should stay as they are.
    }

    fetchData();
  }, [locationQuery, selectedSpecialities, filterInputs.Distance]);

  // Initialize ONLY ONCE or when values change
  useEffect(() => {
    const initialLanguages = {};
    (values?.languages || []).forEach((l) => (initialLanguages[l] = false));

    const initialConsultation = {};
    consultation_modes.forEach((c) => (initialConsultation[c] = false));

    const initialDistance = {};
    distance_options.forEach((d) => (initialDistance[d] = false));

    const initialClients = {};
    clients_options.forEach((c) => (initialClients[c] = false));

    setFilterInputs({
      Languages: initialLanguages,
      Consultation: initialConsultation,
      Distance: initialDistance,
      Clients_no: initialClients,
    });
    setWzAssured(false);
  }, [values]);

  // ✅ Handle checkbox change
  const handleFilterChange = (category, name) => {
    setFilterInputs((prev) => {
      if (category === "Distance") {
        // For distance, only one can be selected
        const newDistance = { ...prev.Distance };
        Object.keys(newDistance).forEach((k) => (newDistance[k] = false));
        newDistance[name] = !prev.Distance[name];
        return { ...prev, Distance: newDistance };
      }
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [name]: !prev[category][name],
        },
      };
    });
  };

  const handleClearFilters = () => {
    const initialLanguages = {};
    (values?.languages || []).forEach((l) => (initialLanguages[l] = false));

    const initialConsultation = {};
    consultation_modes.forEach((c) => (initialConsultation[c] = false));

    const initialDistance = {};
    distance_options.forEach((d) => (initialDistance[d] = false));

    const initialClients = {};
    clients_options.forEach((c) => (initialClients[c] = false));

    setFilterInputs({
      Languages: initialLanguages,
      Consultation: initialConsultation,
      Distance: initialDistance,
      Clients_no: initialClients,
    });
    setWzAssured(false);
  };

  // ✅ Apply filter (runs automatically)
  useEffect(() => {
    if (!allExperts.length) return;

    let result = [...allExperts];

    const activeLanguages = Object.keys(filterInputs.Languages).filter(
      (l) => filterInputs.Languages[l],
    );
    if (activeLanguages.length > 0) {
      result = result.filter(
        (expert) =>
          expert.languages &&
          expert.languages.some((lang) => activeLanguages.includes(lang)),
      );
    }

    const activeConsultation = Object.keys(filterInputs.Consultation).filter(
      (c) => filterInputs.Consultation[c],
    );
    if (activeConsultation.length > 0) {
      result = result.filter((expert) => {
        const mode = (
          expert.consultationMode ||
          expert.consultation_mode ||
          ""
        ).toLowerCase();
        return (
          activeConsultation.includes(mode) ||
          activeConsultation.includes("both")
        );
      });
    }

    const activeClientsOptions = Object.keys(filterInputs.Clients_no).filter(
      (c) => filterInputs.Clients_no[c],
    );
    if (activeClientsOptions.length > 0) {
      result = result.filter((expert) => {
        const trained = parseInt(expert.clientsTrained) || 0;
        return activeClientsOptions.some((option) => {
          if (option.includes("+")) {
            const min = parseInt(option);
            return trained >= min;
          }
          const [min, max] = option.split("-").map((n) => parseInt(n));
          return trained >= min && trained <= max;
        });
      });
    }

    if (wzAssured) {
      result = result.filter((expert) => expert.wzAssured); // Assumes field exists, safely filters out if undefined
    }

    setFilteredExperts(result);
  }, [filterInputs, wzAssured, allExperts]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl lg:rounded-2xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
      {/* Theme Matched Header */}
      <div className="bg-white border-b border-gray-50 p-6 lg:p-7 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#84cc16]"></div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">
            Filters
          </h4>
          <button
            onClick={handleClearFilters}
            className="text-[#84cc16] hover:text-[#76b813] text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Clear All
          </button>
        </div>
        <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          {filteredExpertsCount} Experts Found
        </p>
      </div>

      <div className="p-6 lg:p-8 space-y-7 lg:space-y-9">
        {/* WZ Assured - Modern Toggle */}
        <div className="p-4 bg-lime-50/50 rounded-2xl border border-lime-100/50">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#84cc16] rounded-lg flex items-center justify-center shadow-md shadow-lime-500/10">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-gray-900 tracking-tight italic">
                WZ Assured
              </span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wzAssured}
                onChange={() => setWzAssured(!wzAssured)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#84cc16]"></div>
            </div>
          </label>
        </div>

        {/* Consultation Mode */}
        <div className="space-y-5">
          <h6 className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[#84cc16] pl-3">
            Consultation Mode
          </h6>
          <div className="space-y-3 pl-1">
            {consultation_modes.map((mode) => (
              <label
                key={mode}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filterInputs.Consultation[mode] || false}
                    onChange={() => handleFilterChange("Consultation", mode)}
                    className="w-5 h-5 cursor-pointer accent-[#84cc16] rounded border-gray-300"
                  />
                </div>
                <span
                  className={`text-sm font-bold transition-colors ${filterInputs.Consultation[mode] ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"} capitalize`}
                >
                  {mode}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Collapsible: No. of Clients */}
        <div className="space-y-5 border-t border-gray-50 pt-5">
          <button
            onClick={() => toggleSection("clients")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[#84cc16] pl-3">
              No. of Clients
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.clients ? "" : "rotate-180"}`}
            />
          </button>
          {openSections.clients &&
            Object.keys(filterInputs.Clients_no).length > 0 && (
              <div className="grid grid-cols-1 gap-3 pl-1 pb-2">
                {Object.keys(filterInputs.Clients_no).map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterInputs.Clients_no[item] || false}
                      onChange={() => handleFilterChange("Clients_no", item)}
                      className="w-5 h-5 cursor-pointer accent-[#84cc16]"
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${filterInputs.Clients_no[item] ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
        </div>

        {/* Collapsible: Languages */}
        <div className="space-y-5 border-t border-gray-50 pt-5">
          <button
            onClick={() => toggleSection("languages")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-black text-gray-900 tracking-tight uppercase border-l-2 border-[#84cc16] pl-3">
              Languages
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.languages ? "" : "rotate-180"}`}
            />
          </button>
          {openSections.languages &&
            Object.keys(filterInputs.Languages).length > 0 && (
              <div className="grid grid-cols-1 gap-3 pl-1 pb-2">
                {Object.keys(filterInputs.Languages).map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={item}
                      checked={filterInputs.Languages[item] || false}
                      onChange={() => handleFilterChange("Languages", item)}
                      className="w-5 h-5 cursor-pointer accent-[#84cc16]"
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${filterInputs.Languages[item] ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
        </div>

        {/* Collapsible: Distance Range */}
        <div className="space-y-5 border-t border-gray-50 pt-5 pb-4">
          <button
            onClick={() => toggleSection("distance")}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-baseline gap-1 border-l-2 border-[#84cc16] pl-3">
              <span className="text-sm font-black text-gray-900 tracking-tight uppercase">
                Distance Range
              </span>
              <span className="text-[9px] font-black text-gray-400 lowercase italic">
                (km)
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.distance ? "" : "rotate-180"}`}
            />
          </button>
          {openSections.distance &&
            Object.keys(filterInputs.Distance).length > 0 && (
              <div className="grid grid-cols-1 gap-3 pl-1">
                {Object.keys(filterInputs.Distance).map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterInputs.Distance[item] || false}
                      onChange={() => handleFilterChange("Distance", item)}
                      className="w-5 h-5 cursor-pointer accent-[#84cc16]"
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${filterInputs.Distance[item] ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
        </div>

        {/* Close/Apply Button for Mobile */}
        {onClose && (
          <div className="lg:hidden pt-4 pb-2">
            <button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
