"use client";

import { ArrowRight, CheckCircle2, CircleStar } from "lucide-react";
import { useRouter } from "next/navigation";

function scrollToQuickEnquiry() {
  document.getElementById("quick-enquiry")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

const DUMMY_BIO =
  "A pioneer in neuro-muscular integration and complex joint restoration, blending clinical precision with an editorial eye for patient longevity.";

function formatRecommendedPercent(scoreFinal) {
  if (scoreFinal == null || scoreFinal === "") return null;
  const n = typeof scoreFinal === "number" ? scoreFinal : Number(scoreFinal);
  if (!Number.isFinite(n)) return null;
  const pct = n >= 0 && n <= 1 ? n * 100 : n;
  if (!Number.isFinite(pct) || pct < 0) return null;
  return Math.round(pct);
}

export default function Hero({ coachInfo, details, recommendedScoreFinal }) {
  const router = useRouter();
  const recommendedPct = formatRecommendedPercent(
    recommendedScoreFinal ??
      details?.recommendedScoreFinal ??
      coachInfo?.recommendedScoreFinal,
  );

  const metrics = [
    {
      label: "Years Experience",
      value: details?.yearsExperience ? `${details.yearsExperience}+` : "10+",
    },
    {
      label: "Patients Served",
      value: details?.clientsTrained ? `${details.clientsTrained}+` : "10k+",
    },
    {
      label: "Procedures Done",
      value: details?.proceduresDone ? `${details.proceduresDone}+` : "1.2k+",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 mx-auto max-w-6xl">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center rounded-full bg-[#A3F69C] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#002204]">
            {details?.specializations?.[0] || "-"}
          </span>
          <h1 className="mt-4 text-[42px] font-lato font-extrabold leading-[0.95] text-[#0f4f2b] sm:text-[96px] tracking-tighter">
            {coachInfo?.name || "Expert"}
          </h1>
          <p className="mt-4 max-w-[430px] text-md leading-6 text-[#64756b]">
            {details?.bio || DUMMY_BIO}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={scrollToQuickEnquiry}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#0b5c2a] px-8 py-2.5 text-left  font-semibold text-white transition-colors hover:bg-[#084a22] cursor-pointer"
            >
              <span className="leading-tight text-sm flex flex-col justify-center items-center gap-y-[2px]">
                Send Enquiry
              </span>
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/discover-programs")}
              className="text-sm font-semibold text-[#0f5e2b] transition-colors hover:text-[#0b5c2a] cursor-pointer hover:underline decoration-2 underline-offset-2"
            >
              View Programs
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-semibold ">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C3EEBB] text-[#486D45] px-2.5 py-1">
              <CheckCircle2 className="h-3 w-3" /> Wellness Verified Expert
            </span>
            {recommendedPct != null && (
              <span className="inline-flex items-center gap-1 rounded-full text-[#002204] px-2.5 py-1 text-[12px]">
                <CircleStar className="h-4 w-4" /> {recommendedPct}% Recommended
              </span>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[390px]">
          <div className="overflow-hidden rounded-[14px] bg-[#d8dfd4]">
            <img
              src={
                details?.profilePhoto || coachInfo?.profilePhoto || "/file.svg"
              }
              alt={coachInfo?.name || "Expert profile"}
              className="h-[395px] w-full object-cover object-top"
              onError={(e) => {
                e.target.src = "/file.svg";
              }}
            />
          </div>

          <div className="absolute -right-1 top-20 rounded-[10px] bg-[#f6f7f6] px-3 py-2 shadow-[0_8px_18px_rgba(19,34,26,0.15)] sm:-right-6">
            <p className="text-[28px] font-extrabold leading-none text-[#1c4d30]">
              {metrics[0].value}
            </p>
            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#728279]">
              {metrics[0].label}
            </p>
          </div>

          <div className="absolute bottom-[66px] -left-1 rounded-[10px] bg-[#f6f7f6] px-3 py-2 shadow-[0_8px_18px_rgba(19,34,26,0.15)] sm:-left-8">
            <p className="text-[28px] font-extrabold leading-none text-[#1c4d30]">
              {metrics[1].value}
            </p>
            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#728279]">
              {metrics[1].label}
            </p>
          </div>

          <div className="absolute bottom-[-12px] right-3 rounded-[10px] bg-[#f6f7f6] px-3 py-2 shadow-[0_8px_18px_rgba(19,34,26,0.15)] sm:right-6">
            <p className="text-[28px] font-extrabold leading-none text-[#1c4d30]">
              {metrics[2].value}
            </p>
            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#728279]">
              {metrics[2].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
