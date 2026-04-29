import fs from "node:fs";
import path from "node:path";

const LEGAL_DIR = path.join(process.cwd(), "lib", "constants", "legal");

const fileCache = new Map();

function readLegalFile(relativeName) {
  if (!fileCache.has(relativeName)) {
    const p = path.join(LEGAL_DIR, relativeName);
    fileCache.set(relativeName, fs.readFileSync(p, "utf8"));
  }
  return fileCache.get(relativeName);
}

export function getUserTermsText() {
  return readLegalFile("user-terms.md");
}

export function getBusinessTermsText() {
  return readLegalFile("business-terms.md");
}

export function getPrivacyPolicyText() {
  return readLegalFile("privacy-policy.md");
}

export function getCookiePolicyText() {
  return readLegalFile("cookie-policy.md");
}

/**
 * `cookie-settings.md` is split into three `---` sections (YAML-style separator):
 * 1) header: `# COOKIE SETTINGS` + intro
 * 2) categories: markdown for “full details by category”
 * 3) short footer: one line or a short paragraph (links parsed in the footer component)
 */
function getCookieSettingsRaw() {
  const name = "cookie-settings.md";
  const p = path.join(LEGAL_DIR, name);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, "utf8");
  }
  return null;
}

export function getCookieSettingsHeaderText() {
  const parts = getCookieSettingsParts();
  return parts.header;
}

export function getCookieSettingsCategoriesText() {
  const parts = getCookieSettingsParts();
  return parts.categories;
}

export function getCookieSettingsShortFooterText() {
  const parts = getCookieSettingsParts();
  return (
    parts.footer ||
    "You can change your cookie preferences anytime from Cookie Settings in the website footer or app settings. For more details, please read our Cookie Policy and Privacy Policy."
  );
}

const DEFAULT_COOKIE_SETTINGS = `# COOKIE SETTINGS

We use cookies and similar technologies to make Zeefit work properly, keep your account secure, remember your preferences, understand how the platform is used, and improve your experience.

You can choose which optional cookies you want to allow.

Essential cookies are always active because they are necessary for the website and app to function.

---

## 1. Essential cookies

**Status:** Always active

These cookies are necessary for core platform functions (login, session, security, navigation, forms, payment flow, account access). Without them, the platform may not work properly.

## 2. Functional cookies

**Status:** Optional

These help remember your preferences and improve convenience (language, form details, dashboard preferences, smoother experience).

## 3. Analytics cookies

**Status:** Optional

These help us understand how you use the platform (pages, time on site, navigation, feature usage) so we can improve it.

## 4. Marketing cookies

**Status:** Optional

These may be set by us or partners for campaign measurement, relevance, and audience insights.

---

You can change your cookie preferences anytime from **Cookie Settings** in the website footer. For more details, read our **Cookie Policy** and **Privacy Policy**.`;

let cachedParts = null;

function getCookieSettingsParts() {
  if (cachedParts) return cachedParts;
  const raw = getCookieSettingsRaw() || DEFAULT_COOKIE_SETTINGS;
  const chunks = raw.split(/\n---\n/).map((c) => c.trim());
  if (chunks.length === 0) {
    cachedParts = { header: "", categories: "", footer: "" };
  } else if (chunks.length === 1) {
    cachedParts = { header: chunks[0], categories: "", footer: "" };
  } else if (chunks.length === 2) {
    cachedParts = { header: chunks[0], categories: chunks[1], footer: "" };
  } else {
    const header = chunks[0];
    const footer = chunks[chunks.length - 1];
    const categories = chunks.slice(1, -1).join("\n\n---\n\n");
    cachedParts = { header, categories, footer };
  }
  return cachedParts;
}
