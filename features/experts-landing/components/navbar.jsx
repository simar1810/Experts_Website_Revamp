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
        <div className="flex items-center gap-1">
          <div className="leading-none select-none">
            <span className="text-3xl font-black tracking-tighter text-[#1a1a1a]">
              {brand?.branding?.displayName || brand?.name || "Zee Fit"}
            </span>
            {/* <br />
            <span className="text-3xl font-black tracking-tighter text-[#1a1a1a]">MONK</span> */}
          </div>
        </div>

        {/* <div className="hidden md:flex items-center gap-8">
          <div className="relative group cursor-pointer">
            <span className="text-sm font-bold text-gray-900">Nav 1</span>
            <div className="absolute -bottom-[25px] left-0 w-full h-1 bg-[var(--brand-primary)] rounded-t-md"></div>
          </div>

          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-sm font-bold text-[var(--brand-primary)] opacity-60">Nav 2</span>
            <ChevronUp className="w-4 h-4 text-[var(--brand-primary)] opacity-60" />
          </div>

          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-sm font-bold text-gray-900">Nav 3</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div> */}

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