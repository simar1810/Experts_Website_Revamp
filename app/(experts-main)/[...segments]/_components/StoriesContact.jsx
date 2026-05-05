"use client";

import { useMemo } from "react";
import { MapPin, Clock3 } from "lucide-react";

export default function StoriesContact({ details, reviews = [] }) {
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

        <div className="mx-auto w-full max-w-2xl">
          <aside className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#004F11] p-7 text-white sm:p-8">
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#8fd97a]/30 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-5">
              <span className="inline-flex w-fit rounded-full bg-[#c3eebb] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#002204]">
                Now available
              </span>
              <h3 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2rem]">
                Download WellnessZ App
                <br />
                Today!
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Manage your recovery, schedule appointments, and access
                exclusive patient resources directly from your device.
              </p>
              <div className="flex flex-wrap items-center gap-10 pt-1">
                <a
                  href="https://apps.apple.com/in/app/wellnessz/id6478812964"
                  className="block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/images/app-store.png"
                    alt="Download on the App Store"
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.updevelop.wellness_z_mvvm&hl=en_IN"
                  className="block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/images/google-play.png"
                    alt="Get it on Google Play"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </aside>
        </div>

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
