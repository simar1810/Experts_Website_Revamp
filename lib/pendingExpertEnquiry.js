/**
 * After "Send enquiry" on a public expert profile, unauthenticated users
 * complete Get Started; we store payload here and process it post-auth
 * (see GetStartedModal / LoginModal).
 */
import { ensureClientThreadForListing } from "@/lib/expertListingChat";

export const PENDING_EXPERT_ENQUIRY_KEY = "wz_pending_expert_enquiry_v1";

/**
 * @param {object} data
 * @param {string} data.listingId
 * @param {string} [data.message] ignored for thread open; composer draft is passed via URL (`draft` query)
 * @param {string} [data.consultationMode]
 */
export function setPendingExpertEnquiry(data) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_EXPERT_ENQUIRY_KEY, JSON.stringify(data));
}

export function clearPendingExpertEnquiry() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_EXPERT_ENQUIRY_KEY);
}

/**
 * @param {typeof import("@/lib/api").fetchAPI} fetchAPI
 * @returns {Promise<{ skip: true } | { threadId: string } | { error: string }>}
 */
export async function submitPendingExpertEnquiry(fetchAPI) {
  const raw =
    typeof window !== "undefined"
      ? sessionStorage.getItem(PENDING_EXPERT_ENQUIRY_KEY)
      : null;
  if (!raw) {
    return { skip: true };
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    clearPendingExpertEnquiry();
    return { error: "Could not restore your enquiry. Please try again." };
  }

  const { listingId, consultationMode } = payload;
  if (!listingId) {
    clearPendingExpertEnquiry();
    return { skip: true };
  }

  const offersOnline = consultationMode === "in_person" ? false : true;

  try {
    const { threadId } = await ensureClientThreadForListing({
      fetchAPI,
      listingId: String(listingId),
      offersOnline,
    });
    clearPendingExpertEnquiry();
    return { threadId: String(threadId) };
  } catch (e) {
    clearPendingExpertEnquiry();
    return {
      error:
        (e && typeof e.message === "string" && e.message) ||
        "Could not open chat. Please try again.",
    };
  }
}
