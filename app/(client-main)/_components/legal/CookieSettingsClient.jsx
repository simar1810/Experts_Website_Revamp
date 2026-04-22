"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { COOKIE_PREFERENCES_STORAGE_KEY } from "@/lib/legal/cookiePreferencesConstants";

const defaultPrefs = { functional: false, analytics: false, marketing: false };

function readStored() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_PREFERENCES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed &&
      "functional" in parsed &&
      "analytics" in parsed &&
      "marketing" in parsed
    ) {
      return {
        functional: Boolean(parsed.functional),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function saveStored(prefs) {
  if (typeof window === "undefined") return;
  const payload = {
    ...prefs,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_PREFERENCES_STORAGE_KEY, JSON.stringify(payload));
}

function Toggle({ id, label, description, checked, onChange, disabled }) {
  return (
    <div className="flex gap-4 rounded-xl border border-stone-200/90 bg-white p-4 sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor={id}
            className="text-sm font-semibold text-neutral-900"
          >
            {label}
          </label>
          {disabled ? (
            <span className="shrink-0 text-xs font-medium text-neutral-500">
              Always active
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/80 focus-visible:ring-offset-2",
          disabled
            ? "cursor-not-allowed bg-lime-600"
            : checked
              ? "bg-lime-600"
              : "bg-stone-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
            checked || disabled ? "left-0.5 translate-x-5" : "left-0.5 translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function CookieSettingsClient() {
  const [hydrated, setHydrated] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);

  // After hydration, apply stored cookie preferences (cannot read in initial state or SSR/CSR differ).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(readStored() ?? defaultPrefs);
    setHydrated(true);
  }, []);

  const setField = useCallback((key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const save = useCallback(() => {
    saveStored(prefs);
    toast.success("Your cookie preferences have been saved.");
  }, [prefs]);

  const acceptAll = useCallback(() => {
    const next = { functional: true, analytics: true, marketing: true };
    setPrefs(next);
    saveStored(next);
    toast.success("All optional cookies are now allowed.");
  }, []);

  const rejectNonEssential = useCallback(() => {
    const next = { functional: false, analytics: false, marketing: false };
    setPrefs(next);
    saveStored(next);
    toast.success("Non-essential cookies are turned off.");
  }, []);

  return (
    <div className="space-y-6 font-lato">
      <div className="space-y-3">
        <Toggle
          id="cookie-essential"
          label="Essential cookies"
          description="Required for sign-in, security, checkout, and core site features. They cannot be turned off here."
          checked
          onChange={() => {}}
          disabled
        />
        <Toggle
          id="cookie-functional"
          label="Functional cookies"
          description="Help remember preferences (language, form details, display settings) for a smoother experience."
          checked={hydrated && prefs.functional}
          onChange={(v) => setField("functional", v)}
        />
        <Toggle
          id="cookie-analytics"
          label="Analytics cookies"
          description="Let us understand how the site and app are used so we can improve performance and content."
          checked={hydrated && prefs.analytics}
          onChange={(v) => setField("analytics", v)}
        />
        <Toggle
          id="cookie-marketing"
          label="Marketing cookies"
          description="Support measurement of campaigns, relevance of communications, and audience insights. May include third parties we work with."
          checked={hydrated && prefs.marketing}
          onChange={(v) => setField("marketing", v)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={acceptAll}
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={rejectNonEssential}
          className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-stone-50"
        >
          Reject non-essential
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded-lg border border-lime-700/30 bg-lime-50/80 px-5 py-2.5 text-sm font-semibold text-lime-900 transition-colors hover:bg-lime-100/80"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}
