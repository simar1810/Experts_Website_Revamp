"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

const MIN_QUERY_LEN = 2;

export default function CityRegionAutocomplete({
  value,
  onChange,
  className,
  placeholder = "Mumbai",
  disabled = false,
  error = false,
  onBlur,
  maxLength,
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(value, 350);

  const fetchSuggestions = useCallback(async (query) => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LEN) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/place-search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setSuggestions([]);
        return;
      }
      const data = await res.json();
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions, open]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const showList =
    open &&
    !disabled &&
    value.trim().length >= MIN_QUERY_LEN &&
    (loading || suggestions.length > 0);

  const pickSuggestion = (item) => {
    onChange(item.label);
    setOpen(false);
    setActiveIndex(-1);
    setSuggestions([]);
  };

  return (
    <div ref={rootRef} className="relative mt-2">
      <input
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#67BC2A] focus:ring-4 focus:ring-[#67BC2A]/15",
          error ? "border-red-400" : "border-gray-200",
          className,
        )}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 && suggestions[activeIndex]
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        onBlur={() => onBlur?.()}
        onFocus={() => {
          setOpen(true);
          if (value.trim().length >= MIN_QUERY_LEN) {
            void fetchSuggestions(value);
          }
        }}
        onChange={(e) => {
          const next = e.target.value;
          onChange(next);
          setOpen(true);
          setActiveIndex(-1);
          if (next.trim().length >= MIN_QUERY_LEN) {
            setLoading(true);
          } else {
            setSuggestions([]);
            setLoading(false);
          }
        }}
        onKeyDown={(e) => {
          if (!showList || !suggestions.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            pickSuggestion(suggestions[activeIndex]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
      />
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {loading && suggestions.length === 0 ? (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600">
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              Searching…
            </li>
          ) : null}
          {!loading && suggestions.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-gray-600">
              No matching places
            </li>
          ) : null}
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2.5 text-left text-sm text-gray-800 transition-colors hover:bg-[#F5FBF0]",
                  index === activeIndex && "bg-[#67BC2A]/10",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSuggestion(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
