import { Button } from "@/components/ui/button";

export default function Navbar({ brand }) {
  return (
    <header className="w-full flex flex-col font-sans">
      <div className="bg-[var(--brand-secondary)] py-2 px-4 overflow-hidden whitespace-nowrap">
        <div className="flex justify-between items-center text-white text-sm font-semibold uppercase tracking-wider">
          <span>!!! Sale going on !!!</span>
          <span className="hidden md:inline">!!! Sale going on !!!</span>
          <span className="hidden lg:inline">!!! Sale going on !!!</span>
        </div>
      </div>

      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">


          {(brand?.branding?.favicon || brand?.branding?.logo) && (
            <img
              src={brand.branding.favicon || brand?.branding?.logo}
              alt="logo"
              className="w-8 md:w-20 h-8 md:h-20 rounded-sm object-contain"
              // onError={(e) => e.target.src = '/not-found.png'}
            />
          )}

          <div className="leading-none select-none">
            <span className="text-3xl font-black tracking-tighter text-[#1a1a1a]">
              {brand?.branding?.displayName || brand?.name || "Zee Fit"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full px-8 py-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white font-bold transition-colors shadow-none"
          >
            CTA 1
          </Button>

          <Button
            className="rounded-full px-8 py-2 bg-[var(--brand-primary)] text-white hover:opacity-90 font-bold shadow-none border-none"
          >
            CTA 2
          </Button>
        </div>
      </nav>
    </header>
  );
};