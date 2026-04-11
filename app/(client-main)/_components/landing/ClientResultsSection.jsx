export function ClientResultsSection() {
  const columns = 4;

  return (
    <section className="relative py-24 overflow-hidden bg-white text-neutral-900">

      {/* WRAPPER */}
      <div className="relative px-6 sm:px-12">

        {/* ===== HEADING ===== */}
        <div className="relative z-30">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase leading-none">
            CLIENT
            <br />
            <span className="text-[#9AF45D]">TRANSFORMATIONS</span>
          </h2>
        </div>

        {/* ===== BACKGROUND LAYER (TRUE CURATED STYLE) ===== */}
        <div className="absolute left-0 right-0 top-full mt-10 z-0 pointer-events-none overflow-hidden">

          <div className="flex justify-center gap-6">

            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`
                  flex flex-col gap-6
                  ${colIndex % 2 === 0 ? "animate-marquee-up" : "animate-marquee-down"}
                `}
              >
                {/* items */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-64 h-80 rounded-[32px] border border-neutral-300 bg-neutral-200/70 shrink-0"
                  />
                ))}

                {[...Array(10)].map((_, i) => (
                  <div
                    key={`dup-${i}`}
                    className="w-64 h-80 rounded-[32px] border border-neutral-300 bg-neutral-200/70 shrink-0"
                  />
                ))}
              </div>
            ))}

          </div>

          {/* 🔥 TOP MASK ONLY (THIS IS WHAT FIXES OVERLAP VISUALLY) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />

        </div>
      </div>

      {/* ===== FOREGROUND ===== */}
      <div className="relative z-20 flex justify-center gap-6 px-6 mt-10">

        <div className="-translate-y-6">
          <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10" />
        </div>

        <div className="translate-y-6">
          <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10" />
        </div>

        <div className="-translate-y-6">
          <div className="h-80 w-64 rounded-3xl bg-white shadow-xl border border-black/10" />
        </div>

      </div>
    </section>
  );
}