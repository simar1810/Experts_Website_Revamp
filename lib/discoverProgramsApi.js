const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80";

/**
 * Fetches public ExpertProgram records from `wellnessz_backend`.
 * @param {{ search?: string; programId?: string; specialty?: string; duration?: string; price?: string; page?: number; limit?: number; whitelabel?: string }} [params]
 * @param {RequestInit} [init] e.g. `{ next: { revalidate: 600 } }` from Server Components
 * @returns {Promise<{ data: object[]; count: number; status_code?: number }>}
 */
export async function fetchDiscoverProgramsList(params = {}, init = {}) {
  const {
    search = "",
    programId = "",
    specialty = "",
    duration = "",
    price = "",
    page = 1,
    limit = 24,
    whitelabel = "wellnessz",
  } = params;

  const u = new URL(
    "experts/listing/public/all-programs",
    `${API_BASE.replace(/\/?$/, "/")}`,
  );

  u.searchParams.set("page", String(page));
  u.searchParams.set("limit", String(limit));
  if (whitelabel) u.searchParams.set("whitelabel", whitelabel);
  const q = String(search).trim();
  if (q) u.searchParams.set("search", q);
  const selectedProgramId = String(programId).trim();
  if (selectedProgramId) u.searchParams.set("programId", selectedProgramId);
  const specialtyFilter = String(specialty).trim();
  if (specialtyFilter) u.searchParams.set("specialty", specialtyFilter);
  const durationFilter = String(duration).trim();
  if (durationFilter) u.searchParams.set("duration", durationFilter);
  const priceFilter = String(price).trim();
  if (priceFilter) u.searchParams.set("price", priceFilter);

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

  const programs = Array.isArray(body?.programs)
    ? body.programs
    : Array.isArray(body?.data)
      ? body.data
      : [];
  return {
    ...body,
    data: programs,
    count: body?.count ?? programs.length,
    status_code: body?.status_code ?? 200,
  };
}

/**
 * Server Components / RSC: load ExpertProgram records and map to `TopProgramCard` props.
 * Returns `null` on failure so callers can fall back to static `landingContent`.
 * @param {{ limit?: number; whitelabel?: string; revalidate?: number | false; timeoutMs?: number }} [options]
 * @returns {Promise<object[] | null>}
 */
export async function getDiscoverProgramsForTopCards(options = {}) {
  const {
    limit = 6,
    whitelabel = "wellnessz",
    revalidate = 600,
    /** Avoid hanging SSG/ISR when the backend is down (Next static export timeout ~60s). */
    timeoutMs = 10_000,
  } = options;
  const fetchInit =
    revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate } };

  const signal =
    typeof timeoutMs === "number" &&
    timeoutMs > 0 &&
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  try {
    const res = await fetchDiscoverProgramsList(
      { search: "", page: 1, limit, whitelabel },
      signal ? { ...fetchInit, signal } : fetchInit,
    );
    const raw = Array.isArray(res.data) ? res.data : [];
    if (raw.length === 0) return null;
    return raw.map(programDocumentToTopCard);
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

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function pluralizeUnit(value, unit) {
  const normalizedUnit = cleanString(unit).toLowerCase() || "days";
  const amount = Number(value);
  const singular = normalizedUnit.endsWith("s")
    ? normalizedUnit.slice(0, -1)
    : normalizedUnit;
  return amount === 1 ? singular : `${singular}s`;
}

function formatProgramDuration(p) {
  const label = cleanString(p.durationLabel);
  if (label) return label;

  const duration = Number(p.duration);
  if (Number.isFinite(duration) && duration > 0) {
    return `${duration} ${pluralizeUnit(duration, p.durationUnit)}`;
  }

  const durationDays = Number(p.durationDays);
  if (Number.isFinite(durationDays) && durationDays > 0) {
    return `${durationDays} ${pluralizeUnit(durationDays, "days")}`;
  }

  return "Duration details unavailable";
}

function getCoachName(p) {
  if (p.coach && typeof p.coach === "object") {
    const coachName = cleanString(p.coach.name);
    if (coachName) return coachName;
  }
  return "WellnessZ Expert";
}

function getCoachAvatarSrc(p) {
  const coachPhoto =
    p.coach && typeof p.coach === "object"
      ? cleanString(p.coach.profilePhoto)
      : "";
  if (coachPhoto) return coachPhoto;

  const listing = p.expertListing;
  if (listing && typeof listing === "object") {
    return (
      cleanString(listing.profilePhoto) || cleanString(listing.portraitImage)
    );
  }

  return "";
}

function splitSpecialtyText(value) {
  return cleanString(value)
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProgramSpecialtyValues(p) {
  const values = [];
  const add = (value) => {
    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }
    splitSpecialtyText(value).forEach((item) => values.push(item));
  };

  if (p.coach && typeof p.coach === "object") {
    add(p.coach.specialization);
  }
  if (p.expertListing && typeof p.expertListing === "object") {
    add(p.expertListing.specializations);
    add(p.expertListing.profession);
  }
  add(p.specialty);
  add(p.speciality);
  add(p.primarySpecialty);
  add(p.primarySpeciality);
  add(p.secondarySpecialty);
  add(p.secondarySpeciality);

  return Array.from(
    new Map(values.map((value) => [value.toLowerCase(), value])).values(),
  );
}

/**
 * Map raw ExpertProgram document fields to `TopProgramCard` props.
 * @param {object} p
 */
export function programDocumentToTopCard(p) {
  const id = p._id != null ? String(p._id) : "program";
  const name = p.title || "Program";
  const description = p.shortDescription || p.about || "";
  let features = Array.isArray(p.tags)
    ? p.tags
        .map((tag) => String(tag).trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 3)
    : [];
  if (features.length < 1 && Array.isArray(p.faqs)) {
    features = p.faqs
      .map((faq) => faq?.question)
      .filter(Boolean)
      .map((question) => String(question).trim())
      .filter((question) => question.length > 0)
      .slice(0, 3);
  }
  if (features.length < 1) {
    const desc = String(description).trim();
    features = desc
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);
  }
  if (features.length < 1) {
    features = ["feature - 1", "feature - 2", "feature - 3"];
  }

  const image =
    typeof p.coverImage === "string" && p.coverImage.trim()
      ? p.coverImage.trim()
      : "";
  const isFree = p.programType === "free";
  const amount = p.amount;

  return {
    id,
    programId: id,
    paymentSource: "expert-program",
    programType: p.programType || "paid",
    amount,
    badgeLabel: "TOP RATED",
    name,
    features,
    price: isFree ? "Free" : formatProgramPriceInr(amount),
    enrollLabel: isFree ? "JOIN FREE" : "ENROLL NOW",
    enrollHref: "/experts",
    deliveryTags: ["ONLINE"],
    authorName: getCoachName(p),
    enrollmentLine: formatProgramDuration(p),
    authorAvatarSrc: getCoachAvatarSrc(p),
    specialtyValues: getProgramSpecialtyValues(p),
    imageSrc: image || PLACEHOLDER_IMAGE,
    imageAlt: name,
  };
}

export { PLACEHOLDER_IMAGE };
