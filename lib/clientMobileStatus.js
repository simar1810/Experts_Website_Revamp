/**
 * Branching UX without a dedicated “mobile status” endpoint.
 *
 * Backend: POST …/experts/client/send-otp (same path the app uses; base may be `/api/experts` behind a gateway).
 * Both “known mobile” and “unknown mobile” return HTTP 200 — branch on JSON body only.
 *
 * Known mobile → OTP SMS sent → body includes status_code 200 (+ success wording).
 * Unknown mobile → no SMS → body omits status_code and message explains account does not exist.
 */

/** @typedef {'login' | 'signup' | 'ambiguous'} SendOtpBranch */

/**
 * Parses send-otp 200 JSON. Does not read HTTP status (caller already has success JSON).
 *
 * @param {unknown} data
 * @returns {SendOtpBranch}
 */
export function interpretSendOtpResponseBody(data) {
  if (!data || typeof data !== "object") return "ambiguous";

  /** @type {Record<string, unknown>} */
  const o = /** @type {Record<string, unknown>} */ (data);
  const sc = o.status_code ?? o.statusCode;

  /** Login path: OTP stored + SMS sent (backend sends status_code === 200) */
  if (sc === 200 || sc === "200") {
    return "login";
  }

  const raw = typeof o.message === "string" ? o.message.trim() : "";
  const msg = raw.toLowerCase();

  if (!raw) return "ambiguous";

  /** Signup path: wording like “do not exist” — no OTP sent */
  if (
    /\b(do not exist|don't exist|does not exist)\b/u.test(raw) ||
    msg.includes("do not exist") ||
    msg.includes("don't exist") ||
    msg.includes("does not exist")
  ) {
    return "signup";
  }

  /** Optional: vague “not registered” phrasing */
  if (
    msg.includes("no account") ||
    msg.includes("not registered") ||
    msg.includes("not found")
  ) {
    return "signup";
  }

  /** If backend sends explicit flags */
  if (typeof o.mustRegister === "boolean" && o.mustRegister) return "signup";
  if (typeof o.isNew === "boolean" && o.isNew) return "signup";

  return "ambiguous";
}

/**
 * Single send-otp call → branch decision. Callers branch UI; do not send-otp twice.
 *
 * @param {typeof import("./api").fetchAPI} fetchAPIFn
 * @param {{ mobileNumber: string; countryCode?: string }} payload
 * @returns {Promise<{ branch: SendOtpBranch; data: unknown }>}
 */
export async function probeClientSendOtp(fetchAPIFn, payload) {
  const mobileNumber = String(payload.mobileNumber ?? "").trim();
  const countryCode = payload.countryCode?.trim() || "IN";

  const data = await fetchAPIFn(
    "/experts/client/send-otp",
    { mobileNumber, countryCode },
    "POST",
  );

  return {
    branch: interpretSendOtpResponseBody(data),
    data,
  };
}
