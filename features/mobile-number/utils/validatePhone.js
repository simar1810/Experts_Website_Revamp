import { countryCodes } from "./config";

export function normalizeDialCode(dialCode) {
  if (!dialCode) return "";
  return String(dialCode).replace(/\s+/g, "");
}

export function getCountryByIso(isoCode) {
  if (!isoCode) return null;
  return countryCodes.find((c) => c.code === isoCode) ?? null;
}

/**
 * @returns {string|null} Error message, or null if valid / empty (when optional).
 */
export function validatePhoneForCountry(phone, countryIso, { required = false } = {}) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) {
    return required ? "Enter a phone number." : null;
  }

  const country = getCountryByIso(countryIso) ?? countryCodes[0];

  if (country.maxPhoneLength !== undefined) {
    const len = country.maxPhoneLength;
    if (digits.length !== len) {
      return `Phone number must be ${len} digits for ${country.name}.`;
    }
    return null;
  }

  if (digits.length < 6) {
    return "Phone number must be at least 6 digits.";
  }
  if (digits.length > 15) {
    return "Phone number cannot exceed 15 digits.";
  }
  return null;
}

export function detectCountryFromInternationalNumber(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw.startsWith("+")) return null;

  const compact = "+" + raw.slice(1).replace(/[^\d]/g, "");
  if (compact.length < 2) return null;

  const candidates = countryCodes
    .map((c) => ({ ...c, _dial: normalizeDialCode(c.dial_code) }))
    .filter((c) => c._dial && compact.startsWith(c._dial))
    .sort((a, b) => b._dial.length - a._dial.length);

  if (!candidates.length) return null;
  const country = candidates[0];
  const national = compact.slice(country._dial.length);
  return { country, national };
}
