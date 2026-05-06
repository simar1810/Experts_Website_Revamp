import Image from "next/image";

/**
 * Local fallback header shown when backend header HTML is absent.
 */
export default function PartnerHeaderFallback({ brand }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {brand?.logo ? (
            <Image
              src={brand.logo}
              width={120}
              height={30}
              alt={brand.displayName || "Partner logo"}
              className="h-7 w-auto object-contain"
            />
          ) : (
            <span className="text-sm font-black tracking-wider text-gray-900">
              {brand?.displayName || "GOOD MONK"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-md bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
            Explore Products
          </button>
          <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100">
            Explore Experts
          </button>
        </div>
      </div>
    </header>
  );
}
