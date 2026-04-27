import { normalizeThreadId } from "@/lib/utils";

/** Prefills the chat composer for “Submit enquiry” on the public coach profile (not auto-sent). */
export const SUBMIT_ENQUIRY_COMPOSER_PREFILL =
  "Hi, I'm interested in your services. Can you help me get started?";

/** @deprecated Use {@link SUBMIT_ENQUIRY_COMPOSER_PREFILL} */
export const DEFAULT_PROFILE_ENQUIRY_MESSAGE = SUBMIT_ENQUIRY_COMPOSER_PREFILL;

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
