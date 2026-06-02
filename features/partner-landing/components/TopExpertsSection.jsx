"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { ExpertsListingService } from "../services/ExpertsListingService";
import { ExpertCardPresenter } from "../presenters/ExpertCardPresenter";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { messageExpertListingClick } from "@/lib/expertListingChat";

function ExpertCard({ item, rawExpert }) {
  const { isAuthenticated, openRegisterModal } = useAuth();
  const router = useRouter();

  const handleMessageExpert = (event) =>
    messageExpertListingClick({
      event,
      expert: rawExpert || item,
      isAuthenticated,
      openRegisterModal,
      fetchAPI,
      router,
    });

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="h-60 w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = "/not-found.png";
          }}
        />
        {Array.isArray(item.tags) && item.tags.length > 0 ? (
          <div className="absolute left-3 top-3 flex items-center gap-2">
            {item.tags.map((tag) => (
              <span
                key={`${item.id}-${tag.label}`}
                className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${
                  tag.tone === "success"
                    ? "bg-[#0f6a2f] text-white"
                    : "bg-white/90 text-[var(--brand-primary)]"
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm font-semibold text-(--brand-primary)">
          {item.specialty}
        </p>
        <p className="text-xs text-[#DE3837]">
          {item.experience} Years of Overall Experience
        </p>
        <p className="pt-4 text-sm font-bold text-gray-700">
          {item.location}
        </p>
        <p className="text-xs text-[#414146]">{item.centerName}</p>
      </div>
      <div className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
        <Button
          type="button"
          onClick={handleMessageExpert}
          className="bg-(--brand-primary) text-sm font-semibold text-white p-5 transition hover:opacity-90"
        >
          Message Expert
        </Button>
      </div>
    </article>
  );
}

/**
 * Partner experts section.
 */
export default function TopExpertsSection({ partner }) {
  const service = new ExpertsListingService({ partner });
  const { data, isLoading, mutate } = useSWR(
    ["partner-experts", partner],
    async () => service.fetchTopExperts(),
  );

  useEffect(() => {
    const handlePageShow = () => {
      mutate();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [mutate]);

  const rawExperts = Array.isArray(data?.experts) ? data.experts : [];
  const experts = rawExperts.map((item) => ExpertCardPresenter.toCard(item));

  if (isLoading) {
    return (
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-4xl font-black">
            <span className="text-red-700">Our Top Curated</span> Experts
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (experts.length === 0) return null;

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center text-4xl font-black">
          <span className="text-red-700">Our Top Curated</span> Experts
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {experts.map((expert, index) => (
            <ExpertCard
              key={expert.id}
              item={expert}
              rawExpert={rawExperts[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
