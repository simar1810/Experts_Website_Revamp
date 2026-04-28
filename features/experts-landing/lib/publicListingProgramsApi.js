/**
 * Experts API — public program routes (no JWT).
 * GET /api/experts/listing/programs/:listingId
 * GET /api/experts/listing/program/get/:programId
 *
 * When the UI runs on *.localhost / subdomain but fetch hits api.example.com,
 * send X-Tenant so backend resolvePartner sees the partner slug.
 */

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8080/api";

function tenantHeaders(tenantSubdomain) {
  const h = {};
  if (tenantSubdomain && String(tenantSubdomain).trim()) {
    h["X-Tenant"] = String(tenantSubdomain).trim();
  }
  return h;
}

/** Normalize ExpertListing id from API (string or { $oid }). */
export function normalizeListingId(raw) {
  if (raw == null) return "";
  if (typeof raw === "object" && raw.$oid != null) {
    return String(raw.$oid).trim();
  }
  return String(raw).trim();
}

/** Normalize Mongo/string ids for React keys */
export function programStableId(program) {
  if (!program || typeof program !== "object") return "";
  const raw = program._id ?? program.id;
  if (raw == null) return "";
  if (typeof raw === "object" && raw.$oid) return String(raw.$oid);
  return String(raw);
}

/** UI-friendly fields; handles API normalization (clientsCount false, linked* booleans). */
export function normalizePublicProgram(p) {
  if (!p || typeof p !== "object") return p;
  const durationLabel =
    (typeof p.durationLabel === "string" && p.durationLabel.trim()) ||
    [p.duration, p.durationUnit].filter(Boolean).join(" ").trim() ||
    "";

  const clientsVisible = p.clientsVisible !== false;
  const rawCount = p.clientsCount;
  const enrolledDisplay =
    clientsVisible && rawCount !== false && rawCount != null;

  return {
    ...p,
    durationLabel,
    clientsVisible,
    clientsCount: enrolledDisplay ? rawCount : null,
  };
}

/**
 * @param {string} listingId - ExpertListing Mongo id
 * @param {string} [tenantSubdomain] - partner slug e.g. goodmonk (for X-Tenant)
 */
export async function fetchPublicListingPrograms(listingIdRaw, tenantSubdomain) {
  const id = normalizeListingId(listingIdRaw);
  if (!id) {
    return { programs: [], error: new Error("Missing listing id") };
  }

  const url = `${API_BASE.replace(/\/$/, "")}/experts/listing/programs/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...tenantHeaders(tenantSubdomain),
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (typeof body.message === "string" && body.message) ||
      `Request failed (${res.status})`;
    return { programs: [], error: new Error(msg), status: res.status };
  }

  const raw = Array.isArray(body.programs) ? body.programs : [];
  const programs = raw.map(normalizePublicProgram);
  return { programs, error: null, status: res.status };
}

/**
 * @param {string} programId - ExpertProgram _id
 * @param {string} [tenantSubdomain]
 */
export async function fetchPublicProgramById(programId, tenantSubdomain) {
  const id = String(programId || "").trim();
  if (!id) {
    return { program: null, error: new Error("Missing program id") };
  }

  const url = `${API_BASE.replace(/\/$/, "")}/experts/listing/program/get/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...tenantHeaders(tenantSubdomain),
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (typeof body.message === "string" && body.message) ||
      `Request failed (${res.status})`;
    return { program: null, error: new Error(msg), status: res.status };
  }

  const program = body.program ? normalizePublicProgram(body.program) : null;
  return { program, error: null, status: res.status };
}
