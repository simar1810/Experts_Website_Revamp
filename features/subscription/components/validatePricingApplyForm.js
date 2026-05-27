import { validatePhoneForCountry } from "@/features/mobile-number/utils/validatePhone";

export const PRICING_APPLY_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;
const MAX_NAME_LEN = 50;
const MAX_FULL_NAME_LEN = 50;
const MAX_CITY_LEN = 80;
const MAX_CERT_NAME_LEN = 120;
const MAX_INSTITUTE_LEN = 120;
const MAX_WHY_JOIN_LEN = 2000;
const MAX_CERT_FILE_BYTES = 10 * 1024 * 1024;

function trim(value) {
  return String(value ?? "").trim();
}

function validatePersonName(value, label) {
  const name = trim(value);
  if (!name) return `${label} is required`;
  if (name.length < 2) {
    return `${label} must be at least 2 characters`;
  }
  if (name.length > MAX_NAME_LEN) {
    return `${label} is too long (max ${MAX_NAME_LEN} characters)`;
  }
  if (!NAME_RE.test(name)) {
    return `${label} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
}

function validateEmail(value) {
  const email = trim(value);
  if (!email) return "Email is required";
  if (!PRICING_APPLY_EMAIL_RE.test(email)) {
    return "Enter a valid email address";
  }
  if (email.length > 254) return "Email is too long";
  return null;
}

function validateMobileNumber(phone, countryCode) {
  return validatePhoneForCountry(phone, countryCode, { required: true });
}

function validateProfession(value, allowedProfessions) {
  if (!trim(value)) return "Profession is required";
  if (!allowedProfessions.includes(value)) {
    return "Select a valid profession";
  }
  return null;
}

function validateCity(value) {
  const city = trim(value);
  if (!city) return "City or location is required";
  if (city.length < 2) {
    return "Enter your city or region (at least 2 characters)";
  }
  if (city.length > MAX_CITY_LEN) {
    return `City / region is too long (max ${MAX_CITY_LEN} characters)`;
  }
  return null;
}

function validateCertificationName(value) {
  const name = trim(value);
  if (!name) return null;
  if (name.length < 2) {
    return "Certification name must be at least 2 characters";
  }
  if (name.length > MAX_CERT_NAME_LEN) {
    return `Certification name is too long (max ${MAX_CERT_NAME_LEN} characters)`;
  }
  return null;
}

function validateCertificationInstitute(value) {
  const institute = trim(value);
  if (!institute) return "Certification institute is required";
  if (institute.length < 2) {
    return "Institute name must be at least 2 characters";
  }
  if (institute.length > MAX_INSTITUTE_LEN) {
    return `Institute name is too long (max ${MAX_INSTITUTE_LEN} characters)`;
  }
  return null;
}

function validateYearsExperience(value, allowedValues) {
  if (!value) return "Years of experience is required";
  if (!allowedValues.includes(value)) {
    return "Select a valid experience range";
  }
  return null;
}

function validateCertificateFile(file) {
  if (!file) return "Certificate PDF is required";
  const isPdf =
    file.type === "application/pdf" ||
    String(file.name || "")
      .toLowerCase()
      .endsWith(".pdf");
  if (!isPdf) return "Upload a PDF certificate";
  if (file.size > MAX_CERT_FILE_BYTES) {
    return "Certificate must be 10 MB or smaller";
  }
  return null;
}

function validateWhyJoin(value) {
  const text = trim(value);
  if (!text) return null;
  if (text.length > MAX_WHY_JOIN_LEN) {
    return `Response is too long (max ${MAX_WHY_JOIN_LEN} characters)`;
  }
  return null;
}

function fullName(firstName, lastName) {
  return [firstName, lastName].map(trim).filter(Boolean).join(" ");
}

const FIELD_VALIDATORS = {
  firstName: (form) => validatePersonName(form.firstName, "First name"),
  lastName: (form) => validatePersonName(form.lastName, "Last name"),
  email: (form) => validateEmail(form.email),
  mobileNumber: (form) =>
    validateMobileNumber(form.mobileNumber, form.countryCode),
  profession: (form, options) =>
    validateProfession(form.profession, options.professions),
  city: (form) => validateCity(form.city),
  certificationName: (form) => validateCertificationName(form.certificationName),
  certificationInstitute: (form) =>
    validateCertificationInstitute(form.certificationInstitute),
  yearsExperience: (form, options) =>
    validateYearsExperience(form.yearsExperience, options.experienceValues),
  certificateFile: (form) => validateCertificateFile(form.certificateFile),
  whyJoin: (form) => validateWhyJoin(form.whyJoin),
};

const CREDENTIALS_FIELDS = new Set([
  "certificationName",
  "certificationInstitute",
  "yearsExperience",
  "certificateFile",
]);

const OPTIONAL_FIELDS = new Set(["whyJoin"]);

export function validatePricingApplyField(field, form, options = {}) {
  const validator = FIELD_VALIDATORS[field];
  if (!validator) return null;
  return validator(form, options) || null;
}

export function validatePricingApplyForm(form, options = {}) {
  /** @type {Record<string, string>} */
  const errors = {};

  for (const field of Object.keys(FIELD_VALIDATORS)) {
    const message = validatePricingApplyField(field, form, options);
    if (message) errors[field] = message;
  }

  const combinedName = fullName(form.firstName, form.lastName);
  if (combinedName.length > MAX_FULL_NAME_LEN) {
    errors.firstName = `Full name must be ${MAX_FULL_NAME_LEN} characters or less total`;
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    openCredentials: Object.keys(errors).some((key) =>
      CREDENTIALS_FIELDS.has(key),
    ),
    openOptional: Object.keys(errors).some((key) => OPTIONAL_FIELDS.has(key)),
    firstErrorField: Object.keys(errors)[0] ?? null,
  };
}
