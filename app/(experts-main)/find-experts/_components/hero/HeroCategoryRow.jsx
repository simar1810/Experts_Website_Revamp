"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const VISIBLE_COUNT = 7;

export default function HeroCategoryRow({
  categories = [],
  selectedSpecialities = [],
  setSelectedSpecialities,
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const { visible, overflow } = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return {
      visible: list.slice(0, VISIBLE_COUNT),
      overflow: list.slice(VISIBLE_COUNT),
    };
  }, [categories]);

  const [pendingOverflow, setPendingOverflow] = useState({});

  useEffect(() => {
    const next = {};
    overflow.forEach((c) => {
      next[c] = selectedSpecialities.includes(c);
    });
    setPendingOverflow(next);
  }, [overflow, selectedSpecialities]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectAll = () => {
    setSelectedSpecialities([]);
  };

  const toggleVisible = (cat) => {
    setSelectedSpecialities((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((x) => x !== cat);
      }
      return [...prev, cat];
    });
  };

  const togglePending = (cat) => {
    setPendingOverflow((p) => ({ ...p, [cat]: !p[cat] }));
  };

  const applyOverflow = () => {
    const added = Object.keys(pendingOverflow).filter(
      (k) => pendingOverflow[k],
    );
    const removed = Object.keys(pendingOverflow).filter(
      (k) => !pendingOverflow[k],
    );
    setSelectedSpecialities((prev) => {
      let next = prev.filter((x) => !removed.includes(x));
      added.forEach((a) => {
        if (!next.includes(a)) next = [...next, a];
      });
      return next;
    });
    setOpen(false);
  };

  return (
    <div className="relative z-90 w-full max-w-4xl mx-auto mt-5 md:mt-7 px-1">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={selectAll}
          className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
            selectedSpecialities.length === 0
              ? "bg-[#70C136] text-white shadow-md shadow-lime-600/20"
              : "bg-white/95 text-gray-500 border border-gray-200/80 hover:border-[#70C136] hover:text-[#70C136]"
          }`}
        >
          All
        </button>
        {visible.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleVisible(cat)}
            className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              selectedSpecialities.includes(cat)
                ? "bg-[#70C136] text-white shadow-md shadow-lime-600/20"
                : "bg-white/95 text-gray-500 border border-gray-200/80 hover:border-[#70C136] hover:text-[#70C136]"
            }`}
          >
            {cat}
          </button>
        ))}
        {overflow.length > 0 && (
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                open
                  ? "bg-lime-100 text-[#2d5016] border border-lime-200"
                  : "bg-lime-50/90 text-[#70C136] border border-lime-100 hover:bg-lime-100/80"
              }`}
            >
              See All Categories
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="absolute left-1/2  -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 top-full mt-2 z-110 w-[min(100vw-2rem,280px)] rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    More categories
                  </p>
                  <div className="max-h-56 overflow-y-auto pr-2 space-y-2 mb-4">
                    {overflow.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                            pendingOverflow[cat]
                              ? "border-[#70C136] bg-[#70C136]"
                              : "border-gray-200 group-hover:border-lime-300"
                          }`}
                        >
                          {pendingOverflow[cat] && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!pendingOverflow[cat]}
                          onChange={() => togglePending(cat)}
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={applyOverflow}
                    className="w-full py-2.5 rounded-xl bg-[#70C136] text-white text-xs font-black uppercase tracking-widest hover:bg-[#5fa82f]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
