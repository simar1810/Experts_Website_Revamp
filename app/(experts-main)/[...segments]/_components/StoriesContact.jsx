"use client";

import { useMemo } from "react";
import { MapPin, Clock3 } from "lucide-react";

const WELLNESSZ_DEFAULT = {
  appName: "Zeefit",
  androidUrl:
    "https://play.google.com/store/apps/details?id=com.wellnessz.zeefit&hl=en_IN",
};

function normalizeAppBaseUrl(url) {
  if (typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

export default function StoriesContact({
  details,
  reviews = [],
  coachRefDoc,
  expertName,
}) {
  const { useWhitelabelApp, whitelabelBaseUrl, appDisplayName, whitelabelCtaLabel } =
    useMemo(() => {
      const base = normalizeAppBaseUrl(coachRefDoc?.base_link);
      if (!base) {
        return {
          useWhitelabelApp: false,
          whitelabelBaseUrl: "",
          appDisplayName: WELLNESSZ_DEFAULT.appName,
          whitelabelCtaLabel: "",
        };
      }
      const rawName = (coachRefDoc?.coach_ref || "").trim();
      const titleName = rawName || WELLNESSZ_DEFAULT.appName;
      const cta = rawName ? `Continue to ${rawName}` : "Open app";
      return {
        useWhitelabelApp: true,
        whitelabelBaseUrl: base,
        appDisplayName: titleName,
        whitelabelCtaLabel: cta,
      };
    }, [coachRefDoc]);

  const expertDisplayName = (expertName || "").trim() || "Expert";

  const appPromoDescription = useMemo(() => {
    const who = expertDisplayName;
    return `Get expert guidance, explore ${who}'s top programs, and stay connected to your fitness journey anytime from your phone.`;
  }, [expertDisplayName]);

  const locationLine = useMemo(() => {
    const addr = (details?.address || "").trim();
    if (addr) return addr;
    return [details?.city, details?.state, details?.country]
      .filter(Boolean)
      .join(", ");
  }, [details]);

  const mapQuery = encodeURIComponent(locationLine || "Mumbai, India");
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-y-20">
        {reviews.length > 0 && (
          <div className="flex flex-col gap-y-5 py-7 sm:py-9 lg:py-10">
            <h2 className="text-center text-3xl font-extrabold text-[#0d3b1f]">
              Patient Stories
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review, index) => (
                <article
                  key={`${review.clientName}-${index}`}
                  className="rounded-2xl border border-[#e8ece9] bg-white p-4"
                >
                  <p className="text-xs leading-5 text-[#5c6d64]">
                    <span className="text-[#5c6d64]">&ldquo;</span>
                    {review.text}
                    <span className="text-[#5c6d64]">&rdquo;</span>
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#0d3b1f]">
                    {review.clientName || "Patient"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        <aside className="relative flex w-full min-h-[380px] flex-col justify-between overflow-hidden rounded-[1.8rem] bg-[#004F11] p-8 text-white sm:min-h-[420px] sm:p-10">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#8fd97a]/30 blur-3xl sm:h-72 sm:w-72"
            aria-hidden
          />
          <div className="relative z-10 flex w-full flex-col gap-6 sm:gap-7">
            <span className="inline-flex w-fit rounded-full bg-[#c3eebb] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#002204] sm:px-4 sm:py-2">
            Top Coaches, One App
            </span>
            <h3 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3rem] lg:leading-[1.08]">
              Download {appDisplayName} App to Connect with {expertDisplayName}
            </h3>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg lg:max-w-3xl">
              {appPromoDescription}
            </p>
            {useWhitelabelApp ? (
              <a
                href={whitelabelBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-full max-w-sm items-center justify-center rounded-lg bg-white px-6 py-4 text-base font-semibold text-[#002204] transition-colors hover:bg-white/90 sm:w-auto"
              >
                {whitelabelCtaLabel}
              </a>
            ) : (
              <div className="flex flex-col gap-4 pt-1">
                <p className="text-sm font-medium text-white/85">
                  Available on Google Play · App Store coming soon
                </p>
                <div className="flex flex-wrap items-center gap-8 sm:gap-10">
                <div className="flex shrink-0 flex-col items-start gap-1.5">
                  <span
                    className="block opacity-45 grayscale"
                    aria-hidden
                  >
                    <img
                      src="/images/app-store.png"
                      alt=""
                      className="h-10 w-auto sm:h-11"
                    />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">
                    App Store — coming soon
                  </span>
                </div>
                <a
                  href={WELLNESSZ_DEFAULT.androidUrl}
                  className="block shrink-0 transition-opacity hover:opacity-90"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/google-play.png"
                    alt="Get it on Google Play"
                    className="h-10 w-auto sm:h-11"
                  />
                </a>
                </div>
              </div>
            )}
          </div>
        </aside>

        <article
          id="expert-visit"
          className="mb-6 scroll-mt-24 grid grid-cols-1 items-center gap-5 rounded-[1.8rem] bg-[#f2f4f3] p-8 sm:p-10 lg:grid-cols-2"
        >
          <div>
            <h3 className="text-4xl font-extrabold text-[#0d3b1f]">
              On-site location       
            </h3>
            <div className="mt-4 space-y-5 text-sm text-[#1d3327]">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#03632C]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#03632C]">
                    Office Location
                  </h4>
                  <p className=" text-xs leading-6 text-[#65746c] whitespace-pre-line">
                    {(
                      details?.address ||
                      locationLine ||
                      "Address available on request"
                    ).trim()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#03632C]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#03632C]">
                    Operating Hours
                  </h4>
                  <p className="text-xs leading-6 text-[#65746c] whitespace-pre-line">
                    {details?.availabilityHours || "Hours available on request"}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={mapOpenUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#065a23] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#04481c] sm:w-auto"
            >
              Get Directions
            </a>
          </div>
          <div className="min-h-[180px] overflow-hidden rounded-2xl border border-[#d7e8dc] bg-[#b8d9c0]">
            <iframe
              title="Location map"
              src={mapEmbedUrl}
              className="min-h-[180px] h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="bg-white/90 px-3 py-2 text-[11px] text-[#1d3327]">
              <a
                href={mapOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                Open full map
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
