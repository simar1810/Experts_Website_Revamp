const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/** Ngrok free tunnels often block programmatic fetches unless this header is set. */
function ngrokHeaders() {
  if (typeof API_BASE === "string" && /ngrok/i.test(API_BASE)) {
    return { "ngrok-skip-browser-warning": "true" };
  }
  return {};
}

function httpErrorMessage(errorData, response) {
  const m = errorData?.message;
  if (typeof m === "string" && m.trim()) return m.trim();
  const status = response.status;
  const statusText = (response.statusText || "").trim() || "Error";
  return `Request failed (${status} ${statusText})`;
}

/**
 * Builds the client object to store after OTP verify.
 * Merges: registration/OTP `fallback` + `client_snapshot` + top-level fields.
 * Important: when `client_snapshot` exists we must still apply `fallback` so
 * email / phone typed during registration are not dropped.
 */
export function clientProfileFromVerifyResponse(response, fallback = {}) {
  if (!response || typeof response !== "object") return null;

  const snapshot =
    response.client_snapshot != null &&
    typeof response.client_snapshot === "object"
      ? response.client_snapshot
      : {};

  const fromRoot = {};
  for (const key of ["email", "mobileNumber", "phoneNumber", "name"]) {
    const v = response[key];
    if (v != null && String(v).trim() !== "") {
      fromRoot[key] = typeof v === "string" ? v.trim() : v;
    }
  }

  let merged = { ...fallback, ...snapshot };

  for (const [k, v] of Object.entries(fromRoot)) {
    if (v == null || (typeof v === "string" && !v.trim())) continue;
    const cur = merged[k];
    if (cur == null || (typeof cur === "string" && !String(cur).trim())) {
      merged[k] = v;
    }
  }

  for (const k of Object.keys(fallback)) {
    const fb = fallback[k];
    if (fb == null || (typeof fb === "string" && !String(fb).trim())) continue;
    const cur = merged[k];
    if (cur == null || (typeof cur === "string" && !String(cur).trim())) {
      merged[k] = fb;
    }
  }

  if (!Object.keys(merged).length) {
    if (response.name != null && String(response.name).trim() !== "") {
      merged.name = String(response.name).trim();
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}

export const fetchAPI = async (endpoint, body, method = "POST") => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...ngrokHeaders(),
    },
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("client_token");
      window.dispatchEvent(new Event("auth_unauthorized"));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(httpErrorMessage(errorData, response));
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API request failed:", err);
    if (err instanceof Error) {
      const msg = typeof err.message === "string" && err.message.trim();
      if (msg) throw err;
      throw new Error("Something went wrong. Please try again.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const sendData = async (endpoint, body) => {
  const headers = {
    "Content-Type": "application/json",
    ...ngrokHeaders(),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // Auto logout on 401 Unauthorized
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("client_token");
    window.dispatchEvent(new Event("auth_unauthorized"));
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const errorMessage =
      data.message || `API request failed: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  const data = await response.json();
  console.log(data);
  return true; // true means data sending successfull
};
