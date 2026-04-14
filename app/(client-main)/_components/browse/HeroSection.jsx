"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

          {/* LEFT CONTENT */}
          <div className="flex-1">

            {/* CHIP */}
            <div className="inline-flex items-center rounded-full bg-[#ACF847] px-4 py-1 text-xs font-semibold text-black">
              CURATED WELLNESS
            </div>

            {/* HEADING */}
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-black">
              Discover Our <br />
              <span className="text-[#67BC2A]">Programs</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
              Elevate your vitality through expert led wellness pathways <br />
              and evidence based nutrition. Your journey to peak performance <br />
              starts here.
            </p>

          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              
              {/* soft glow background */}
              <div className="absolute -inset-6 rounded-3xl bg-[#67BC2A]/10 blur-2xl" />

              <img
                src="/your-image.jpg"
                alt="Wellness Program"
                className="relative w-[280px] h-[280px] sm:w-[560px] sm:h-[460px] object-cover rounded-3xl border-[6px] border-[#E6F7D9] shadow-xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}