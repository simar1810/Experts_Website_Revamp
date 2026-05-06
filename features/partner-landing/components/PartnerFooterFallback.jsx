/**
 * Local fallback footer shown when backend footer HTML is absent.
 */
export default function PartnerFooterFallback({ brand }) {
  return (
    <footer className="bg-[#4c1d95] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-2xl font-black">Superfoods Valley</p>
          <p className="mt-3 text-xs leading-relaxed text-purple-100">
            We curate wellness products and expert experiences for modern health journeys.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold">Our Company</p>
          <ul className="mt-3 space-y-1 text-xs text-purple-100">
            <li>Home</li>
            <li>Services</li>
            <li>News</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold">Services</p>
          <ul className="mt-3 space-y-1 text-xs text-purple-100">
            <li>Mindful Retreats</li>
            <li>Smart Yoga</li>
            <li>Stress Detox</li>
            <li>Sleep Coaching</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold">Subscribe</p>
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="h-9 rounded border border-purple-300 bg-white px-3 text-xs text-gray-700 outline-none"
            />
            <button className="h-9 rounded bg-white text-xs font-semibold text-purple-800 transition hover:bg-purple-100">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-purple-700 px-4 py-3 text-center text-[11px] text-purple-100">
        Right Reserved to {brand?.displayName || brand?.name || "Zee Fit"}
      </div>
    </footer>
  );
}
