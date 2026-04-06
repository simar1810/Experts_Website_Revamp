"use client";
import { useRouter } from "next/navigation";
import { BadgeCheck, ThumbsUp } from "lucide-react";

export default function ExpertCard({ expert }) {
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

  let specializations_string = "";
  const specs = expert.specializations || expert.expertiseTags || [];
  if (specs.length > 2) {
    specializations_string = specs[0] + ", " + specs[1] + " more...";
  } else if (specs.length == 2) {
    specializations_string = specs[0] + ", " + specs[1];
  } else if (specs.length == 1) {
    specializations_string = specs[0];
  }

  const handleCardClick = () => {
    if (!resolvedListingId) return;
    router.push(`/experts/${resolvedListingId}`);
  };

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 sm:gap-10 shadow-sm hover:shadow-md hover:border-lime-100/50 transition-all duration-500 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0 mx-auto md:mx-0">
          <div className="w-full h-full rounded-full border-2 border-[#67BC2A] overflow-hidden shadow-inner transition-colors">
            <img
              src={resolvedPhoto}
              alt={resolvedName}
              className="w-full h-full object-cover transition-all duration-500 "
            />
          </div>
          <div className="absolute right-1 bottom-1 p-1.5 ">
            <BadgeCheck className="w-5 h-5 sm:w-7 sm:h-7  text-white fill-[#67BC2A] " />
          </div>
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-900">
              {expert.name || expert.coach?.name || "Expert"}
            </h3>
          </div>
          <p className="text-sm text-gray-500 font-medium opacity-80">
            {specializations_string}
          </p>
          <p className="text-sm text-gray-500 font-medium opacity-80">
            {expert.yearsExperience} years experience overall
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-900 text-xs sm:text-sm font-bold pt-1">
            <span className="text-gray-700">
              {expert.city} , {expert.state}
            </span>
          </div>
          <p className="text-gray-400 text-[10px] sm:text-xs font-medium leading-relaxed max-w-md mx-auto md:mx-0 italic">
            {expert.clinic}
          </p>
          <div className="mt-9 border-t border-dashed border-gray-300 max-w-[236px]" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-6">
            <div className="flex items-center justify-center md:justify-start gap-x-4">
              <div className="flex items-center gap-2 bg-[#00A500] text-white px-2.5 py-1 rounded-sm text-[10px] sm:text-xs font-black shadow-lg shadow-lime-500/20">
                <ThumbsUp className="w-3 h-3 fill-current" />
                <span>
                  {(expert.recommendedScoreFinal * 100).toPrecision(2)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 group/stories cursor-pointer">
                <span className="text-gray-800 text-sm font-medium opacity-80">
                  <span className="underline decoration-1 underline-offset-2">
                    {expert.reviewAgg.totalReviews}
                  </span>{" "}
                  Patient Stories
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-center gap-1">
              {expert.responseTime && (
                <p className="text-[#67BC2A] text-sm font-bold leading-none">
                  Responds in {expert.responseTime}
                </p>
              )}
              <button
                onClick={handleCardClick}
                className="bg-[#67BC2A]/85 hover:bg-[#67BC2A] cursor-pointer text-white px-8 sm:px-12 py-3 sm:py-3.5 rounded-2xl font-black text-[10px] sm:text-xs transition-all active:scale-95 uppercase tracking-widest mt-2"
              >
                Message Coach
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
