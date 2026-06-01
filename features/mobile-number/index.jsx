"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { countryCodes } from "./utils/config";
import {
  detectCountryFromInternationalNumber,
  normalizeDialCode,
  validatePhoneForCountry,
} from "./utils/validatePhone";

const phoneFieldBaseClass =
  "h-12 rounded-2xl border bg-white text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#67BC2A] focus:ring-4 focus:ring-[#67BC2A]/15";

export default function InputMobileNumberWithCountryCode({
  phone,
  onChange: setPhone,
  onCountryCodeChange,
  defaultCountryCode,
  allowedCountryCodes,
  className,
  triggerClassName,
  inputClassName,
  fieldError,
  onBlur,
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const availableCountries = useMemo(() => {
    if (!allowedCountryCodes?.length) return countryCodes;
    const allowed = new Set(allowedCountryCodes);
    return countryCodes.filter((item) => allowed.has(item.code));
  }, [allowedCountryCodes]);

  const getInitialCountry = () => {
    if (defaultCountryCode) {
      const foundCountry = availableCountries.find(
        (item) => item.code === defaultCountryCode,
      );
      if (foundCountry) return foundCountry;
    }
    return availableCountries[0] || countryCodes[0];
  };

  const [country, setCountry] = useState(getInitialCountry);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!defaultCountryCode) return;
    const foundCountry = availableCountries.find(
      (item) => item.code === defaultCountryCode,
    );
    if (foundCountry && foundCountry.code !== country.code) {
      setCountry(foundCountry);
    }
  }, [availableCountries, country.code, defaultCountryCode]);

  useEffect(() => {
    if (!defaultCountryCode && onCountryCodeChange && country.code) {
      onCountryCodeChange(country.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return availableCountries;
    return availableCountries.filter((item) => {
      const dial = normalizeDialCode(item.dial_code);
      return (
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        dial.includes(query) ||
        item.dial_code.toLowerCase().includes(query)
      );
    });
  }, [availableCountries, search]);

  const handlePhoneChange = (rawInput) => {
    const detected = detectCountryFromInternationalNumber(rawInput);
    if (detected?.country) {
      const nextCountry =
        availableCountries.find((item) => item.code === detected.country.code) ||
        detected.country;
      setCountry(nextCountry);
      onCountryCodeChange?.(nextCountry.code);
      const sanitizedNational = String(detected.national || "").replace(/\D/g, "");
      setPhone(sanitizedNational);
      setError(
        sanitizedNational
          ? validatePhoneForCountry(sanitizedNational, nextCountry.code, {
              required: false,
            })
          : null,
      );
      return;
    }

    const sanitized = rawInput.replace(/\D/g, "");
    setPhone(sanitized);
    if (!sanitized) {
      setError(null);
      return;
    }

    setError(
      validatePhoneForCountry(sanitized, country.code, { required: false }),
    );
  };

  const displayError = fieldError || error;
  const fieldBorderClass = displayError ? "border-red-400" : "border-gray-200";
  const countryLocked = availableCountries.length <= 1;

  return (
    <div ref={rootRef} className={cn("w-full space-y-1", className)}>
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-expanded={open}
            disabled={countryLocked}
            onClick={() => {
              if (!countryLocked) setOpen((prev) => !prev);
            }}
            className={cn(
              phoneFieldBaseClass,
              "flex shrink-0 items-center justify-between gap-0.5 px-2",
              countryLocked ? "w-[3.75rem] justify-center" : "w-[4.75rem]",
              fieldBorderClass,
              triggerClassName,
              countryLocked
                ? "cursor-default opacity-100"
                : "hover:border-[#67BC2A] hover:bg-[#F5FBF0]",
              countryLocked && "disabled:opacity-100",
            )}
          >
            <span className="truncate">{country.dial_code}</span>
            {!countryLocked ? (
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-500" />
            ) : null}
          </button>
          {open ? (
            <div className="absolute left-0 z-50 mt-1 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 p-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search country..."
                  className={cn(
                    phoneFieldBaseClass,
                    "h-10 w-full px-3 placeholder:text-gray-400",
                    fieldBorderClass,
                  )}
                />
              </div>
              <ul className="max-h-[300px] overflow-y-auto py-1">
                {filteredCountries.length === 0 ? (
                  <li className="px-3 py-2.5 text-sm text-gray-500">
                    No country found.
                  </li>
                ) : null}
                {filteredCountries.map((item) => (
                  <li key={item.code}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[#F5FBF0]",
                        country.code === item.code && "bg-[#67BC2A]/10",
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setCountry(item);
                        onCountryCodeChange?.(item.code);
                        setOpen(false);
                        setSearch("");
                        setPhone("");
                        setError(null);
                      }}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="truncate font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="ml-auto whitespace-nowrap text-sm text-gray-500">
                          {item.dial_code}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0 text-[#67BC2A]",
                          country.code === item.code ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(event) => handlePhoneChange(event.target.value)}
          onBlur={onBlur}
          className={cn(
            phoneFieldBaseClass,
            "min-w-0 flex-1 px-4 placeholder:text-gray-400",
            fieldBorderClass,
            inputClassName,
            displayError &&
              "focus:border-red-400 focus:ring-red-400/15",
          )}
        />
      </div>
      {displayError ? (
        <p className="px-0.5 text-xs font-semibold text-red-500">{displayError}</p>
      ) : null}
    </div>
  );
}

export {
  detectCountryFromInternationalNumber,
  validatePhoneForCountry,
} from "./utils/validatePhone";
export { countryCodes } from "./utils/config";
