import { normalizeThreadId } from "@/lib/utils";

/** Quoted line at the end of the submit-enquiry composer prefill. */
const SUBMIT_ENQUIRY_ASK_LINE =
  "Hi, I'm interested in your services. Can you help me get started?";

/**
 * @deprecated Use {@link buildSubmitEnquiryComposerPrefill} for the full template.
 */
export const SUBMIT_ENQUIRY_COMPOSER_PREFILL = SUBMIT_ENQUIRY_ASK_LINE;

/** @deprecated */
export const DEFAULT_PROFILE_ENQUIRY_MESSAGE = SUBMIT_ENQUIRY_COMPOSER_PREFILL;

/**
 * Builds the “Submit enquiry” chat composer prefill: name, phone, email, then a quoted ask line.
 * Omits contact lines when data is missing.
 * @param {Record<string, unknown> | null | undefined} client
 */
export function buildSubmitEnquiryComposerPrefill(client) {
  const c = client && typeof client === "object" ? client : {};
  const name = String(
    c.name ?? c.fullName ?? c.displayName ?? "",
  ).trim();
  const email = String(c.email ?? "").trim();
  const phone = String(
    c.mobileNumber ?? c.phone ?? c.mobile ?? "",
  ).trim();

  const quoted = `"${SUBMIT_ENQUIRY_ASK_LINE}"`;

  const head = [];
  if (name) head.push(name);
  if (phone) head.push(` 📞 ${phone}`);
  if (email) head.push(` 📧 ${email}`);

  if (head.length === 0) return quoted;
  return `${head.join("\n")}\n${quoted}`;
}

/**
 * Draft text for redirect after OTP when a pending expert enquiry exists.
 * @param {{ skip?: boolean; composerDraft?: string; submitEnquiryComposer?: boolean }} pending
 * @param {Record<string, unknown> | null | undefined} profile from verify / login
 * @param {string} [phoneFallback] login-only: number used for OTP if profile lacks mobile
 */
export function resolvePostAuthEnquiryDraftText(
  pending,
  profile,
  phoneFallback = "",
) {
  if (!pending || pending.skip || !("threadId" in pending)) return "";
  if (pending.submitEnquiryComposer) {
    const p = profile && typeof profile === "object" ? profile : {};
    const phone =
      String(p.mobileNumber ?? p.phone ?? p.mobile ?? "").trim() ||
      String(phoneFallback ?? "").trim();
    return buildSubmitEnquiryComposerPrefill({ ...p, mobileNumber: phone });
  }
  if (
    typeof pending.composerDraft === "string" &&
    pending.composerDraft.trim() !== ""
  ) {
    return pending.composerDraft;
  }
  return "";
}

/**
 * Returns an existing client thread for this listing, or creates inquiry + thread.
 * @param {object} p
 * @param {typeof import("@/lib/api").fetchAPI} p.fetchAPI
 * @param {string} p.listingId
 * @param {boolean} [p.offersOnline]
 * @returns {Promise<{ threadId: string }>}
 */
export async function ensureClientThreadForListing({
  fetchAPI,
  listingId,
  offersOnline = true,
}) {
  const listData = await fetchAPI(
    "/experts/chat/threads-client",
    undefined,
    "GET",
  );
  const threads = Array.isArray(listData?.threads) ? listData.threads : [];
  const lid = String(listingId);

  const existing = threads.find((t) => {
    const el = t?.expertListing;
    if (el == null) return false;
    if (typeof el === "object" && el !== null && "_id" in el) {
      return String(el._id) === lid;
    }
    return String(el) === lid;
  });

  if (existing) {
    const threadId = normalizeThreadId(existing._id ?? existing.id);
    if (threadId) return { threadId };
  }

  const consultationMode = offersOnline ? "online" : "in_person";
  const created = await fetchAPI("/experts/inquiry/create", {
    listingId: String(listingId),
    message: "",
    consultationMode,
  });
  const inquiryId = created?.inquiry?._id;
  if (!inquiryId) {
    const msg =
      typeof created?.message === "string" && created.message.trim()
        ? created.message.trim()
        : "Could not start chat. Please try again.";
    throw new Error(msg);
  }

  const threadData = await fetchAPI("/experts/chat/thread-client", {
    inquiryId: String(inquiryId),
  });
  const threadId = normalizeThreadId(
    threadData?.thread?._id ?? threadData?.thread?.id,
  );
  if (!threadId) {
    throw new Error("Chat could not be opened.");
  }
  return { threadId };
}
