const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80";

/**
 * Fetches programs from `wellnessz_backend` — `GET /app/getall-programs` (search, whitelabel, paging).
 * @param {{ search?: string; page?: number; limit?: number; whitelabel?: string }} [params]
 * @param {RequestInit} [init] e.g. `{ next: { revalidate: 600 } }` from Server Components
 * @returns {Promise<{ data: object[]; count: number; status_code?: number }>}
 */
export async function fetchDiscoverProgramsList(params = {}, init = {}) {
  const {
    search = "",
    page = 1,
    limit = 24,
    whitelabel = "wellnessz",
  } = params;

  const u = new URL("app/getall-programs", `${API_BASE.replace(/\/?$/, "/")}`);

  u.searchParams.set("page", String(page));
  u.searchParams.set("limit", String(limit));
  if (whitelabel) u.searchParams.set("whitelabel", whitelabel);
  const q = String(search).trim();
  if (q) u.searchParams.set("search", q);

  const headers = { ...init.headers };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(u.toString(), {
    method: "GET",
    ...init,
    headers,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("client_token");
    window.dispatchEvent(new Event("auth_unauthorized"));
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof body?.message === "string" && body.message.trim()
        ? body.message
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (body?.status_code != null && body.status_code !== 200) {
    const msg =
      typeof body?.message === "string" && body.message.trim()
        ? body.message
        : "Could not load programs";
    throw new Error(msg);
  }
  return body;
}

/**
 * Server Components / RSC: load programs and map to `TopProgramCard` props. Same
 * filtering as discover-programs (prefer `person: "client"`, else all results).
 * Returns `null` on failure so callers can fall back to static `landingContent`.
 * @param {{ limit?: number; whitelabel?: string; revalidate?: number | false }} [options]
 * @returns {Promise<object[] | null>}
 */
export async function getDiscoverProgramsForTopCards(options = {}) {
  const {
    limit = 6,
    whitelabel = "wellnessz",
    revalidate = 600,
  } = options;
  const fetchInit =
    revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate } };

  try {
    const res = await fetchDiscoverProgramsList(
      { search: "", page: 1, limit, whitelabel },
      fetchInit,
    );
    const raw = Array.isArray(res.data) ? res.data : [];
    const forClients = raw.filter(
      (p) => p.person === "client" || p.person == null,
    );
    const useList = forClients.length ? forClients : raw;
    if (useList.length === 0) return null;
    return useList.map(programDocumentToTopCard);
  } catch {
    return null;
  }
}

/**
 * @param {unknown} valueInr Whole INR from API (e.g. 2999), or null/undefined
 * @returns {string} e.g. "₹2,999" or "₹—" if missing/invalid
 */
export function formatProgramPriceInr(valueInr) {
  if (valueInr === undefined || valueInr === null || valueInr === "") {
    return "\u20B9—";
  }
  const n = Number(valueInr);
  if (!Number.isFinite(n) || n < 0) {
    return "\u20B9—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * Map raw Program document fields to `TopProgramCard` props.
 * Uses `price` (INR, number) from Program when set.
 * @param {object} p
 */
export function programDocumentToTopCard(p) {
  const id = p._id != null ? String(p._id) : "program";
  const name = p.name || "Program";
  const desc = String(p.description || "").trim();
  let features = desc
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3);
  if (features.length < 1 && p.subTitle) {
    features = [String(p.subTitle).trim()];
  }
  if (features.length < 1) {
    features = ["feature - 1", "feature - 2", "feature - 3"];
  }

  const rawAvail = Array.isArray(p.availability) ? p.availability : [];
  const deliveryTags = rawAvail.length
    ? rawAvail.map((a) => String(a).toUpperCase().replace(/[-_]+/g, " "))
    : ["ONLINE"];

  const image =
    typeof p.image === "string" && p.image.trim() ? p.image.trim() : "";
  const link = typeof p.link === "string" && p.link.trim() ? p.link.trim() : "";

  return {
    id,
    badgeLabel: "TOP RATED",
    name,
    features,
    price: formatProgramPriceInr(p.price),
    enrollLabel: "ENROLL NOW",
    enrollHref: link || "/experts",
    deliveryTags,
    authorName: "WellnessZ Expert",
    enrollmentLine: "Open enrollment — see program details",
    authorAvatarSrc: "",
    imageSrc: image || PLACEHOLDER_IMAGE,
    imageAlt: name,
  };
}

export { PLACEHOLDER_IMAGE };
