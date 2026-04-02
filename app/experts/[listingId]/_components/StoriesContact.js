import { MapPin, Clock3 } from "lucide-react";

export default function StoriesContact({
  details,
  reviews = [],
  formState,
  onFormChange,
  onSubmit,
}) {
  const mapQuery = encodeURIComponent(formState.location || "Mumbai, India");
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section className="w-full sm:px-8 lg:px-10">
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
                    "{review.text}"
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#0d3b1f]">
                    {review.clientName || "Patient"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <form
            onSubmit={onSubmit}
            className="space-y-3 rounded-2xl border border-[#e8ece9] bg-white p-5"
          >
            <h3 className="text-2xl font-extrabold text-[#0d3b1f]">
              Quick Enquiry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="name"
                value={formState.name}
                onChange={onFormChange}
                placeholder="Full name"
                className="h-11 rounded-lg border border-[#e7ece8] px-3 text-sm outline-none"
              />
              <input
                name="email"
                value={formState.email}
                onChange={onFormChange}
                placeholder="email@example.com"
                className="h-11 rounded-lg border border-[#e7ece8] px-3 text-sm outline-none"
              />
            </div>
            <input
              name="contact"
              value={formState.contact}
              onChange={onFormChange}
              placeholder="Phone"
              className="h-11 w-full rounded-lg border border-[#e7ece8] px-3 text-sm outline-none"
            />
            <textarea
              name="message"
              value={formState.message}
              onChange={onFormChange}
              placeholder="Briefly describe your condition"
              className="h-24 w-full resize-none rounded-lg border border-[#e7ece8] px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-[#065a23] text-sm font-semibold text-white transition-colors hover:bg-[#04481c]"
            >
              Submit Secure Enquiry
            </button>
          </form>

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
                  href="#"
                  className="block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/images/app-store.png"
                    alt="Download on the App Store"
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="#"
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

        <article className="mb-6 grid grid-cols-1 items-center gap-5 rounded-[1.8rem] bg-[#f2f4f3] p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-4xl font-extrabold text-[#0d3b1f]">
              Visit the Sanctuary
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#1d3327]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {formState.location}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />{" "}
                {details?.availabilityHours || "Hours shared on enquiry"}
              </p>
            </div>
            <button
              type="button"
              className="mt-5 rounded-lg bg-[#065a23] px-4 py-2 text-xs font-semibold text-white"
            >
              Get Directions
            </button>
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
