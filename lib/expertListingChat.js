import { normalizeThreadId } from "@/lib/utils";
import { setPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";
import { toast } from "react-hot-toast";

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

/**
 * Resolve ExpertListing id from search/card/profile payloads (same order as find-experts).
 * @param {object} expert
 * @returns {string}
 */
export function resolveListingIdFromExpertLike(expert = {}) {
  const id =
    expert?.listingId ||
    expert?.expertListingId ||
    expert?.listing?._id ||
    expert?.listing?._id?.toString?.() ||
    expert?._id ||
    expert?.id ||
    expert?.coach?._id ||
    "";
  return id != null && String(id).trim() !== "" ? String(id) : "";
}

/**
 * Message Expert / Message Coach — same flow as find-experts ExpertCard.
 * @param {object} p
 * @param {import("react").MouseEvent} [p.event]
 * @param {object} p.expert — raw listing or card view model
 * @param {boolean} p.isAuthenticated
 * @param {() => void} p.openRegisterModal
 * @param {typeof import("@/lib/api").fetchAPI} p.fetchAPI
 * @param {import("next/navigation").AppRouterInstance} p.router
 * @param {boolean} [p.includeComposerDraftInRedirect]
 */
export async function messageExpertListingClick({
  event,
  expert,
  isAuthenticated,
  openRegisterModal,
  fetchAPI,
  router,
  includeComposerDraftInRedirect = false,
}) {
  event?.stopPropagation?.();

  const listingId = resolveListingIdFromExpertLike(expert);
  if (!listingId) {
    toast.error("Could not open chat for this expert.");
    return;
  }

  const offersOnlineRaw =
    expert?.offersOnline ??
    expert?.expertDetails?.offersOnline ??
    expert?.listing?.expertDetails?.offersOnline;
  const consultationMode = offersOnlineRaw ? "online" : "in_person";

  if (!isAuthenticated) {
    setPendingExpertEnquiry({
      listingId,
      consultationMode,
      ...(includeComposerDraftInRedirect
        ? { composerDraft: SUBMIT_ENQUIRY_COMPOSER_PREFILL }
        : {}),
    });
    openRegisterModal();
    return;
  }

  const dismiss = toast.loading("Opening chat…");
  try {
    const { threadId } = await ensureClientThreadForListing({
      fetchAPI,
      listingId,
      offersOnline: Boolean(offersOnlineRaw),
    });
    toast.dismiss(dismiss);
    if (includeComposerDraftInRedirect) {
      const q = new URLSearchParams();
      q.set("thread", String(threadId));
      q.set("draft", SUBMIT_ENQUIRY_COMPOSER_PREFILL);
      router.push(`/dashboard/enquiries?${q.toString()}`);
      return;
    }
    router.push(
      `/dashboard/enquiries?thread=${encodeURIComponent(threadId)}`,
    );
  } catch (err) {
    toast.dismiss(dismiss);
    toast.error(
      err instanceof Error
        ? err.message
        : "Could not open chat. Please try again.",
    );
  }
}
