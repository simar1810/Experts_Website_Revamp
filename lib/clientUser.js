/**
 * Reads the first non-empty trimmed string from candidates.
 * @param {...unknown} candidates
 * @returns {string}
 */
function firstString(...candidates) {
  for (const v of candidates) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/**
 * First defined, non-nullish value that becomes a non-empty string when stringified.
 * @param {...unknown} candidates
 * @returns {string}
 */
function firstPhoneLike(...candidates) {
  for (const v of candidates) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return "";
}

/**
 * Normalizes stored client profile (OTP verify / registration) for enquiry and contact forms.
 * Handles alternate field names from `client_snapshot` or API variants.
 *
 * @param {Record<string, unknown> | null | undefined} user
 * @returns {{ name: string; email: string; contact: string }}
 */
export function getEnquiryDefaultsFromClientUser(user) {
  if (!user || typeof user !== "object") {
    return { name: "", email: "", contact: "" };
  }

  const nested =
    user.client != null && typeof user.client === "object"
      ? user.client
      : user.profile != null && typeof user.profile === "object"
        ? user.profile
        : null;

  return {
    name: firstString(
      user.name,
      user.fullName,
      user.displayName,
      nested?.name,
      nested?.fullName,
    ),
    email: firstString(
      user.email,
      user.userEmail,
      user.emailAddress,
      nested?.email,
      nested?.userEmail,
    ),
    contact: firstPhoneLike(
      user.mobileNumber,
      user.phoneNumber,
      user.contact,
      user.phone,
      nested?.mobileNumber,
      nested?.phoneNumber,
      nested?.contact,
      nested?.phone,
    ),
  };
}
