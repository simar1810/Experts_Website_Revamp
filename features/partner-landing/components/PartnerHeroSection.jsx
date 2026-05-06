import { PartnerLandingTheme } from "../domain/PartnerLandingTheme";

/**
 * Main hero block designed to mirror the reference visual.
 */
export default function PartnerHeroSection() {
  return (
    <section className="bg-white">
      <div className="overflow-hidden">
        <div className="relative h-[260px] overflow-hidden sm:h-[360px] md:h-[500px]">
          <img
            src="/images/b2b/hero-banner.png"
            alt="Hero interior background"
            className="absolute inset-0 h-full w-full scale-150 object-cover object-center sm:scale-125"
          />
          <div className="absolute inset-0 hidden sm:block">
            <div className="relative mx-auto h-full w-full max-w-6xl px-4 sm:px-6">
              <div
                className="absolute right-4 top-1/2 w-[280px] -translate-y-1/2 rounded-md p-8 shadow-md sm:right-6 sm:w-[360px]"
                style={{
                  background: "color-mix(in srgb, var(--brand-primary) 22%, white)",
                }}
              >
                <p className="text-[11px] font-semibold text-(--brand-primary)">
                  New Arrival
                </p>
                <h1 className="mt-1 text-3xl font-black leading-tight text-(--brand-primary)">
                  {PartnerLandingTheme.HERO_TITLE}
                </h1>
                <p className="mt-3 text-xs leading-relaxed text-gray-700">
                  {PartnerLandingTheme.HERO_DESCRIPTION}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded bg-(--brand-primary) px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
                    Explore Products
                  </button>
                  <button className="rounded border border-(--brand-primary) bg-white/70 px-3 py-1.5 text-xs font-semibold text-(--brand-primary) transition hover:bg-white">
                    Explore Experts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mx-4 mt-4 rounded-md p-6 shadow-md sm:hidden"
          style={{
            background: "color-mix(in srgb, var(--brand-primary) 22%, white)",
          }}
        >
          <p className="text-[11px] font-semibold text-(--brand-primary)">
            New Arrival
          </p>
          <h1 className="mt-1 text-3xl font-black leading-tight text-(--brand-primary)">
            {PartnerLandingTheme.HERO_TITLE}
          </h1>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            {PartnerLandingTheme.HERO_DESCRIPTION}
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded bg-(--brand-primary) px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
              Explore Products
            </button>
            <button className="rounded border border-(--brand-primary) bg-white/70 px-3 py-1.5 text-xs font-semibold text-(--brand-primary) transition hover:bg-white">
              Explore Experts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
