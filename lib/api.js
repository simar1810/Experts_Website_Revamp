const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

function resolveTenantFromHostname(hostname) {
  const rawHost = String(hostname || "").trim().toLowerCase();
  if (!rawHost) return null;

  const host = rawHost.split(":")[0];
  if (!host || host === "localhost") return null;
  if (host === "shop.localhost" || host === "shop.zeefit.in") return null;

  const parts = host.split(".").filter(Boolean);
  if (parts.length === 0) return null;

  // Local dev: raghav.localhost -> raghav
  if (host.endsWith(".localhost") && parts.length >= 2) {
    return parts[0] || null;
  }

  // Production tenant host: tenant.zeefit.in
  if (host.endsWith(".zeefit.in") && parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && subdomain !== "www") {
      return subdomain;
    }
  }

  return null;
}

function resolveTenantFromPathname(pathname) {
  const path = String(pathname || "").trim();
  if (!path || path === "/") return null;

  const [firstSegment] = path.replace(/^\/+/, "").split("/");
  const tenant = String(firstSegment || "").trim().toLowerCase();

  if (!tenant || tenant === "collections") return null;
  return tenant;
}

function attachTenantHeader(headers) {
  if (typeof window === "undefined") return;
  const hostname = window.location?.hostname || "";
  let tenant = resolveTenantFromHostname(hostname);
  if (!tenant && (hostname === "shop.localhost" || hostname === "shop.zeefit.in")) {
    tenant = resolveTenantFromPathname(window.location?.pathname);
  }
  if (tenant) {
    headers["x-tenant"] = tenant;
  }
}

function httpErrorMessage(errorData, response) {
  const m = errorData?.message;
  if (typeof m === "string" && m.trim()) return m.trim();
  const status = response.status;
  const statusText = (response.statusText || "").trim() || "Error";
  return `Request failed (${status} ${statusText})`;
}

export function clientProfileFromVerifyResponse(response, fallback = {}) {
  if (!response || typeof response !== "object") return null;
  if (
    response.client_snapshot != null &&
    typeof response.client_snapshot === "object"
  ) {
    return response.client_snapshot;
  }
  const fromApi = {};
  if (response.name != null && String(response.name).trim() !== "") {
    fromApi.name = response.name;
  }
  const merged = { ...fallback, ...fromApi };
  return Object.keys(merged).length > 0 ? merged : null;
}

/** POST multipart/form-data (e.g. file upload). Do not set Content-Type — browser sets boundary. */
export const fetchMultipart = async (endpoint, formData) => {
  const options = {
    method: "POST",
    headers: {},
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  attachTenantHeader(options.headers);

  options.body = formData;

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

    return response.json();
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

export const fetchAPI = async (endpoint, body, method = "POST") => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  attachTenantHeader(options.headers);

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
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  attachTenantHeader(headers);

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

export const postData = async function (endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: (() => {
        const h = { "Content-Type": "application/json" };
        attachTenantHeader(h);
        return h;
      })(),
      body: JSON.stringify(data),
    }
    );
    return response.json();
  } catch (error) {
    return { success: false, message: error.message || "Internal Server Error!" }
  }
}
