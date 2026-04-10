export function ClientResultsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white text-neutral-900">

      {/* Heading */}
      <div className="relative z-20 px-6 sm:px-12 mb-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase leading-none">
          CLIENT
          <br />
          <span className="text-[#9AF45D]">TRANSFORMATIONS</span>
        </h2>
      </div>

      {/* ===== BACKGROUND MARQUEE (STRAIGHT LINE) ===== */}
      <div className="absolute inset-x-0 top-60 z-0 overflow-hidden py-6">

        <div className="flex gap-6 w-max animate-marquee-left">

          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className={`
                w-64 h-80 rounded-[32px] border border-neutral-300 bg-neutral-200/70 shrink-0 
                ${i % 2 === 0 ? "-translate-y-6" : "translate-y-6"}
              `}
            />
          ))}

        </div>

      </div>

      {/* ===== FOREGROUND CARDS ===== */}
      <div className="relative z-20 flex justify-center gap-6 px-6">

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