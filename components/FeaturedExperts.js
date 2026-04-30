"use client";

import { useState, useEffect, useMemo } from "react";
import { User2 } from "lucide-react";
// import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { prettyExpertProfileUrlFromListingLike } from "@/lib/prettyExpertProfileUrl";
import { FEATURED_EXPERTS_STATIC, getFeaturedExpertsBlurb } from "@/lib/data/featuredExpertsStatic";

/**
 * Manual featured experts — data lives in `@/lib/data/featuredExpertsStatic` (shared with client landing).
 * Optional `websiteLink`: opens in a new tab (http/https) or via router (paths starting with `/`).
 * If `websiteLink` is missing/empty, logged-in users go to the slug profile URL (login modal if guest).
 */
function ExpertPhoto({ src, name }) {
  const [failed, setFailed] = useState(false);
  const trimmed =
    typeof src === "string" && src.trim().length > 0 ? src.trim() : "";

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  if (!trimmed || failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-linear-to-b from-gray-200/90 to-gray-300/80 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors"
        aria-hidden
      >
        <User2
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 shrink-0 text-gray-500"
          strokeWidth={1.35}
        />
      </div>
    );
  }

  return (
    <img
      src={trimmed}
      alt={name}
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

function formatRating(expert) {
  const bayes = expert?.ratingAgg?.overall?.bayes;
  const avg = expert?.ratingAgg?.overall?.avg;
  const n = typeof bayes === "number" && !Number.isNaN(bayes) ? bayes : avg;
  if (typeof n !== "number" || Number.isNaN(n)) return null;
  return n.toFixed(1);
}

function trimmedWebsiteLink(expert) {
  const raw = expert?.websiteLink;
  return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : "";
}

export default function FeaturedExperts() {
  const experts = FEATURED_EXPERTS_STATIC;
  const { isAuthenticated, openLoginModal } = useAuth();
  const router = useRouter();

  const sectionBlurb = useMemo(() => getFeaturedExpertsBlurb(experts), [experts]);

  const handleExpertClick = (expert) => {
    const site = trimmedWebsiteLink(expert);
    if (site) {
      if (site.startsWith("/")) {
        router.push(site);
        return;
      }
      const url = /^https?:\/\//i.test(site) ? site : `https://${site}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    const id = expert._id;
    if (!id) return;

    if (!isAuthenticated) {
      openLoginModal();
    } else {
      router.push(prettyExpertProfileUrlFromListingLike(expert));
    }
  };

  // API (restore when moving off mock data):
  // useEffect(() => {
  //   async function fetchTopRatedExperts() {
  //     try {
  //       const data = await fetchAPI("/experts/listing/home/top-rated", {
  //         limit: 12,
  //       });
  //       setExperts(Array.isArray(data?.items) ? data.items.slice(0, 5) : []);
  //     } catch {
  //       setExperts([]);
  //     }
  //   }
  //   fetchTopRatedExperts();
  // }, []);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Experts
          </h2>
          <p className="max-w-full wrap-break-word text-gray-500 text-sm leading-relaxed sm:text-base">
            {sectionBlurb}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10">
          {experts?.map((expert) => {
            const listingId = expert._id;
            const name =
              (typeof expert?.coach?.name === "string" &&
                expert.coach.name.trim()) ||
              "Expert";
            const photo =
              (typeof expert?.profilePhoto === "string" &&
                expert.profilePhoto.trim()) ||
              (typeof expert?.coach?.profilePhoto === "string" &&
                expert.coach.profilePhoto.trim()) ||
              "";
            const subtitle =
              (Array.isArray(expert.specializations) &&
                expert.specializations[0]) ||
              [expert.city, expert.state].filter(Boolean).join(", ") ||
              "Wellness coach";
            const ratingLabel = formatRating(expert);
            const reviews = Number(expert?.reviewAgg?.totalReviews) || 0;

            return (
              <div
                key={listingId ? String(listingId) : name}
                onClick={() => handleExpertClick(expert)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="w-full aspect-[1/1.1] rounded-lg mb-4 overflow-hidden bg-gray-100">
                  <ExpertPhoto src={photo} name={name} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {name}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium capitalize line-clamp-2">
                    {subtitle}
                  </p>
                  {(ratingLabel != null || reviews > 0) && (
                    <p className="text-gray-400 text-xs font-medium">
                      {ratingLabel != null && <span>{ratingLabel}★</span>}
                      {ratingLabel != null && reviews > 0 && <span> · </span>}
                      {reviews > 0 && (
                        <span>{reviews.toLocaleString()} reviews</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={() => router.push("/find-experts")}
            className="w-full sm:w-auto min-w-[300px] bg-[#f0f0f0] hover:bg-[#e8e8e8] text-[#84cc16] px-12 py-4 rounded-lg font-bold text-base transition-colors"
          >
            View all Experts
          </button>
        </div>
      </div>
    </section>
  );
}
