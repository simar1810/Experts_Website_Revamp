/**
 * Client auth persisted across localhost subdomains (shop.localhost, partner.localhost)
 * and zeefit.in tenants via shared-domain cookies, with localStorage fallback and
 * hash-based sync when bare localhost cannot read .localhost cookies.
 */

export const CLIENT_TOKEN_KEY = "client_token";
export const CLIENT_DATA_KEY = "client_data";

/** ~30 days — align with typical client JWT session length */
const AUTH_MAX_AGE_SEC = 60 * 60 * 24 * 30;

const AUTH_HASH_TOKEN = "wz_token";
const AUTH_HASH_USER = "wz_user";

function isBrowser() {
  return typeof window !== "undefined";
}

/** Cookie Domain for all hosts in the same Zeefit “family”. */
export function getSharedCookieDomain(hostname = "") {
  const host = String(hostname || (isBrowser() ? window.location.hostname : ""))
    .split(":")[0]
    .toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost")) return ".localhost";
  if (host === "zeefit.in" || host.endsWith(".zeefit.in")) return ".zeefit.in";
  return null;
}

export function hostsShareAuthFamily(hostA, hostB) {
  const a = String(hostA || "").toLowerCase();
  const b = String(hostB || "").toLowerCase();
  const inLocalhost = (h) => h === "localhost" || h.endsWith(".localhost");
  const inZeefit = (h) => h === "zeefit.in" || h.endsWith(".zeefit.in");
  if (inLocalhost(a) && inLocalhost(b)) return true;
  if (inZeefit(a) && inZeefit(b)) return true;
  return a === b && a.length > 0;
}

function readCookie(name) {
  if (!isBrowser()) return null;
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split(";")) {
    const chunk = part.trim();
    if (chunk.startsWith(prefix)) {
      try {
        return decodeURIComponent(chunk.slice(prefix.length));
      } catch {
        return chunk.slice(prefix.length);
      }
    }
  }
  return null;
}

function writeCookie(name, value, { maxAge = AUTH_MAX_AGE_SEC } = {}) {
  if (!isBrowser()) return;
  const encoded = encodeURIComponent(value);
  const domain = getSharedCookieDomain();
  let cookie = `${encodeURIComponent(name)}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (domain) cookie += `; domain=${domain}`;
  if (window.location.protocol === "https:") cookie += "; Secure";
  document.cookie = cookie;
}

function deleteCookie(name) {
  if (!isBrowser()) return;
  const domain = getSharedCookieDomain();
  let cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
  if (domain) cookie += `; domain=${domain}`;
  document.cookie = cookie;
  // Host-only clear (bare localhost)
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}

export function getClientAuthToken() {
  if (!isBrowser()) return null;
  const fromCookie = readCookie(CLIENT_TOKEN_KEY);
  if (fromCookie) return fromCookie;
  const fromLs = localStorage.getItem(CLIENT_TOKEN_KEY);
  if (fromLs) {
    writeCookie(CLIENT_TOKEN_KEY, fromLs);
    return fromLs;
  }
  return null;
}

export function getClientAuthUser() {
  if (!isBrowser()) return null;
  const fromCookie = readCookie(CLIENT_DATA_KEY);
  if (fromCookie) {
    try {
      const parsed = JSON.parse(fromCookie);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      /* fall through */
    }
  }
  const fromLs = localStorage.getItem(CLIENT_DATA_KEY);
  if (!fromLs) return null;
  try {
    const parsed = JSON.parse(fromLs);
    if (parsed && typeof parsed === "object") {
      writeCookie(CLIENT_DATA_KEY, fromLs);
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function setClientAuthToken(token) {
  if (!isBrowser() || !token) return;
  localStorage.setItem(CLIENT_TOKEN_KEY, token);
  writeCookie(CLIENT_TOKEN_KEY, token);
}

export function setClientAuthUser(user) {
  if (!isBrowser() || !user) return;
  const raw = JSON.stringify(user);
  localStorage.setItem(CLIENT_DATA_KEY, raw);
  writeCookie(CLIENT_DATA_KEY, raw);
}

export function setClientAuth(token, user) {
  if (!isBrowser()) return;
  if (token) setClientAuthToken(token);
  if (user) setClientAuthUser(user);
}

export function clearClientAuth() {
  if (!isBrowser()) return;
  localStorage.removeItem(CLIENT_TOKEN_KEY);
  localStorage.removeItem(CLIENT_DATA_KEY);
  deleteCookie(CLIENT_TOKEN_KEY);
  deleteCookie(CLIENT_DATA_KEY);
}

/**
 * When navigating to another host in the same family (e.g. shop.localhost → localhost),
 * pass the token in the URL hash once; the destination consumes it and clears the hash.
 */
export function appendAuthSyncHash(urlString) {
  if (!isBrowser()) return urlString;
  const token = getClientAuthToken();
  if (!token) return urlString;

  let dest;
  try {
    dest = new URL(urlString, window.location.href);
  } catch {
    return urlString;
  }

  if (!hostsShareAuthFamily(window.location.hostname, dest.hostname)) {
    return urlString;
  }
  if (window.location.hostname === dest.hostname) {
    return urlString;
  }

  const params = new URLSearchParams();
  params.set(AUTH_HASH_TOKEN, token);
  const user = getClientAuthUser();
  if (user) {
    try {
      params.set(AUTH_HASH_USER, JSON.stringify(user));
    } catch {
      /* skip oversized user payload */
    }
  }
  dest.hash = params.toString();
  return dest.toString();
}

/**
 * @returns {{ token: string, user: object | null } | null}
 */
export function consumeAuthSyncFromHash() {
  if (!isBrowser() || !window.location.hash) return null;

  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const token = params.get(AUTH_HASH_TOKEN);
  if (!token) return null;

  let user = null;
  const userRaw = params.get(AUTH_HASH_USER);
  if (userRaw) {
    try {
      const parsed = JSON.parse(userRaw);
      if (parsed && typeof parsed === "object") user = parsed;
    } catch {
      /* ignore */
    }
  }

  setClientAuth(token, user);

  const cleanUrl =
    window.location.pathname + window.location.search || "/";
  window.history.replaceState(null, "", cleanUrl);

  return { token, user };
}
