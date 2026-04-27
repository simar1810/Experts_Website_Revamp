"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { fetchAPI } from "@/lib/api";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PROFILE_ENQUIRY_MESSAGE,
  ensureClientThreadForListing,
} from "@/lib/expertListingChat";
import { setPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";

export default function ExpertCard({
  expert,
  isTopExpert = false,
  profileHref,
}) {
  const { isAuthenticated, openLoginModal, openRegisterModal } = useAuth();
  const router = useRouter();
  const resolvedName = expert.coach?.name || expert.name || "Expert";
  const resolvedPhoto =
    expert.profilePhoto || expert.coach?.profilePhoto || "/file.svg";
  const resolvedListingId =
    expert.listingId ||
    expert.expertListingId ||
    expert.listing?._id ||
    expert.listing?._id?.toString?.() ||
    expert._id ||
    expert.id ||
    expert.coach?._id;

  const agg =
    expert.ratingAgg?.overall ??
    expert.coach?.ratingAgg?.overall ??
    expert.listing?.ratingAgg?.overall;
  const toRatingNum = (v) => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };
  const bayesNum = toRatingNum(agg?.bayes);
  const avgNum = toRatingNum(agg?.avg);
  const ratingOutOf5 = bayesNum ?? avgNum;
  const scoreFinalRaw =
    expert.recommendedScoreFinal ??
    expert.coach?.recommendedScoreFinal ??
    expert.listing?.recommendedScoreFinal;
  const scoreFinalNum = toRatingNum(scoreFinalRaw);
  let popularPercentLabel = "—";
  if (scoreFinalNum != null) {
    const pct =
      scoreFinalNum >= 0 && scoreFinalNum <= 1
        ? scoreFinalNum * 100
        : scoreFinalNum;
    popularPercentLabel = `${Math.round(pct)}%`;
  }
  const topExpertRatingLabel =
    ratingOutOf5 != null ? `${ratingOutOf5.toFixed(1)}` : "—";
  const totalReviews =
    Number(
      expert.reviewAgg?.totalReviews ??
        expert.coach?.reviewAgg?.totalReviews ??
        expert.listing?.reviewAgg?.totalReviews,
    ) || 0;

  let specializations_string = "";
  const specs = expert.specializations || expert.expertiseTags || [];
  if (specs.length > 2) {
    specializations_string = specs[0] + ", " + specs[1] + " more...";
  } else if (specs.length == 2) {
    specializations_string = specs[0] + ", " + specs[1];
  } else if (specs.length == 1) {
    specializations_string = specs[0];
  }

  const locationLine = [expert.city, expert.state].filter(Boolean).join(", ");

  const offersOnlineRaw =
    expert.offersOnline ??
    expert.expertDetails?.offersOnline ??
    expert.listing?.expertDetails?.offersOnline;
  const consultationModeForPending = offersOnlineRaw
    ? "online"
    : "in_person";

  const handleMessageCoach = async (e) => {
    e.stopPropagation();
    if (!resolvedListingId) {
      toast.error("Could not open chat for this expert.");
      return;
    }
    if (!isAuthenticated) {
      setPendingExpertEnquiry({
        listingId: String(resolvedListingId),
        consultationMode: consultationModeForPending,
      });
      openRegisterModal();
      return;
    }
    const dismiss = toast.loading("Opening chat…");
    try {
      const { threadId } = await ensureClientThreadForListing({
        fetchAPI,
        listingId: String(resolvedListingId),
        offersOnline: Boolean(offersOnlineRaw),
      });
      toast.dismiss(dismiss);
      const draft = encodeURIComponent(DEFAULT_PROFILE_ENQUIRY_MESSAGE);
      router.push(
        `/dashboard/enquiries?thread=${encodeURIComponent(threadId)}&draft=${draft}`,
      );
    } catch (err) {
      toast.dismiss(dismiss);
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not open chat. Please try again.",
      );
    }
  };

  const handleCardClick = () => {
    if (!resolvedListingId) return;

    if (!isAuthenticated) {
      openLoginModal();
    } else {
      if (profileHref) router.push(profileHref);
    }
  };

  const ratingBadge = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-white px-2.5 py-1.5 text-xs font-bold shadow-sm",
        isTopExpert ? "bg-[#7CB342] rounded-lg" : "bg-[#00A500] rounded-md",
      )}
    >
      {isTopExpert ? (
        <>
          <span className="text-white text-sm leading-none">★</span>
          <span>{topExpertRatingLabel}</span>
        </>
      ) : (
        <>
          <ThumbsUp className="w-3.5 h-3.5 shrink-0 fill-current" />
          <span>{popularPercentLabel}</span>
        </>
      )}
    </div>
  );

  const patientStories = (
    <span
      className={cn(
        "text-xs sm:text-sm font-medium",
        isTopExpert ? "text-gray-600" : "text-gray-500",
      )}
    >
      <span className="underline decoration-1 underline-offset-2 text-gray-700">
        {totalReviews}
      </span>{" "}
      Patient Stories
    </span>
  );

  const messageButton = (className) => (
    <button
      type="button"
      onClick={handleMessageCoach}
      className={cn(
        "cursor-pointer text-white font-bold transition-all active:scale-[0.98]",
        "px-5 py-3 text-sm",
        isTopExpert
          ? "bg-[#67BC2A] hover:bg-[#67bc2adf] rounded-xl"
          : "bg-[#67BC2A] hover:bg-[#67bc2adf] rounded-xl w-xs",
        className,
      )}
    >
      Message Coach
    </button>
  );

  return (
    <div
      className={cn(
        "block cursor-pointer h-full",
        isTopExpert && "w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto",
      )}
    >
      <div
        className={cn(
          "rounded-2xl border transition-all duration-300 relative group overflow-hidden h-full",
          isTopExpert &&
            "flex flex-col items-stretch text-left gap-0 md:flex-row md:items-start md:gap-10 p-4 sm:p-5 md:p-6 bg-[#67BC2A1A] border-gray-200/90 shadow-sm hover:shadow-md",
          !isTopExpert &&
            "flex flex-row items-start gap-3 md:gap-10 p-4 sm:p-5 md:p-6 bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 rounded-[14px]",
        )}
      >
        {isTopExpert && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block" />
        )}

        <div
          className={cn(
            "relative shrink-0",
            isTopExpert
              ? "w-[104px] h-[104px] sm:w-[118px] sm:h-[118px] md:w-40 md:h-40 self-start mb-4 md:mb-0"
              : "w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 shrink-0 self-start",
          )}
        >
          <div
            className={cn(
              "w-full h-full rounded-full border-2 overflow-hidden shadow-inner",
              isTopExpert ? "border-[#7CB342]" : "border-[#66BB6A]",
            )}
          >
            <img
              src={resolvedPhoto}
              alt={resolvedName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 p-0.5">
            <BadgeCheck
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 text-white",
                isTopExpert ? "fill-[#7CB342]" : "fill-[#66BB6A]",
              )}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col text-left">
          <h3
            className={cn(
              "text-gray-900 font-bold leading-snug",
              isTopExpert
                ? "text-lg sm:text-xl md:text-2xl"
                : "text-[15px] sm:text-xl md:text-2xl pr-1",
            )}
          >
            {expert.name || expert.coach?.name || "Expert"}
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-1.5">
            {specializations_string}
          </p>
          <p className="text-sm text-gray-500 font-normal mt-1">
            {expert.yearsExperience} years experience overall
          </p>

          {isTopExpert ? (
            <>
              {locationLine ? (
                <p className="text-sm font-bold text-gray-800 mt-3">
                  {locationLine}
                </p>
              ) : null}
              {expert.clinic ? (
                <p className="text-sm font-normal text-gray-600 leading-snug mt-1">
                  {expert.clinic}
                </p>
              ) : null}
            </>
          ) : (
            <>
              {locationLine ? (
                <p className="text-sm font-bold text-gray-900 mt-1.5">
                  {locationLine}
                </p>
              ) : null}
              {expert.clinic ? (
                <p className="text-gray-500 text-xs sm:text-sm font-medium leading-snug mt-1 line-clamp-2">
                  {expert.clinic}
                </p>
              ) : null}
            </>
          )}

          {isTopExpert ? (
            <>
              <div className="w-full border-t border-dashed border-gray-300 mt-4" />
              <div className="flex flex-row items-center gap-3 flex-wrap mt-4">
                {ratingBadge}
                {patientStories}
              </div>
              <div className="flex flex-row items-center gap-3 mt-4 w-full min-w-0">
                <div className="min-w-0 flex-1">{messageButton("w-full")}</div>
                {expert.responseTime ? (
                  <p className="text-[#7CB342] text-xs sm:text-sm font-semibold shrink-0 leading-tight text-right">
                    Responds in {expert.responseTime}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-300 space-y-3">
              <div className="flex flex-row items-center gap-3 flex-wrap">
                {ratingBadge}
                {patientStories}
              </div>
              <div className="flex flex-row items-center justify-end gap-3 w-full min-w-0">
                {expert.responseTime ? (
                  <p className="text-[#66BB6A] text-xs sm:text-sm font-semibold shrink-0 leading-tight text-right">
                    Responds in {expert.responseTime}
                  </p>
                ) : null}
                {messageButton("shrink-0")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
