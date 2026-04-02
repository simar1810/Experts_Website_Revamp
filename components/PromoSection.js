import Link from "next/link";

export default function PromoSection() {
  return (
    <section className="relative py-30 px-6 overflow-hidden bg-white">
      {/* Background Mesh/Distorted Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.12]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="mesh-grid"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 60 Q 30 0 60 60 T 120 60"
                fill="none"
                stroke="#2D5A11"
                strokeWidth="0.8"
              />
              <path
                d="M 60 0 Q 0 30 60 60 T 60 120"
                fill="none"
                stroke="#2D5A11"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#mesh-grid)"
            className="transform scale-[2.5] rotate-[15deg] origin-center"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#5BA829] to-[#2D5A11] rounded-[32px] md:rounded-[40px] overflow-hidden relative z-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] border border-white/5">
        <div className="grid lg:grid-cols-2 p-8 md:p-14 md:items-center">
          {/* Left Content */}
          <div className="max-w-2xl mb-12 lg:mb-0 text-center lg:text-left">
            <div>
              <span className="bg-[#030712] text-white text-[9px] sm:text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-[0.2em] inline-block mb-6 shadow-2xl">
                Join the Movement
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[900] text-white leading-[1.1] tracking-[-0.03em]">
                Join the <br />
                <span className="text-[#152e06]">Movement</span> and <br />
                grow your <br />
                practice
              </h2>
            </div>

            <p className="text-white/90 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-lg mb-8 tracking-tight mx-auto lg:mx-0 mt-6">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua."
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/pricing"
                className="bg-[#84CC16] hover:bg-[#a3e635] text-white px-6 py-3 rounded-[15px] sm:rounded-[20px] font-black text-base sm:text-lg transition-all inline-flex items-center justify-center gap-3 shadow-2xl shadow-black/30 hover:-translate-y-1 active:scale-95"
              >
                Become a Expert <span className="text-xl sm:text-2xl">→</span>
              </Link>
            </div>
          </div>

          {/* Right Content - Staggered Cards (Exact Layout) */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start lg:translate-x-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Card 1: Top Left */}
              <div className="bg-white/20 backdrop-blur-2xl p-5 rounded-2xl border border-white/30 shadow-2xl transform lg:hover:rotate-2 transition-all duration-700">
                <div className="w-10 h-10 bg-white rounded-lg mb-3 shadow-xl"></div>
                <h4 className="text-white font-black text-lg mb-2 leading-tight">
                  Expert Networking
                </h4>
                <p className="text-white/80 text-[10px] leading-relaxed font-bold tracking-wide uppercase opacity-90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {/* Card 2: Bottom Left */}
              <div className="bg-black/30 backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-2xl transform lg:hover:-rotate-2 transition-all duration-700">
                <div className="w-10 h-10 bg-gray-700 rounded-lg mb-3"></div>
                <h4 className="text-white font-black text-lg mb-2 leading-tight">
                  Growth Tools
                </h4>
                <p className="text-white/80 text-[10px] leading-relaxed font-bold tracking-wide uppercase opacity-90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 sm:mt-12">
              {/* Card 3: Middle Right */}
              <div className="bg-green backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-2xl transform lg:hover:rotate-3 transition-all duration-700">
                <div className="w-10 h-10 bg-[#365314] rounded-lg mb-3"></div>
                <h4 className="text-white font-black text-lg mb-2 leading-tight">
                  Global Reach
                </h4>
                <p className="text-white/80 text-[10px] leading-relaxed font-bold tracking-wide uppercase opacity-90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {/* Card 4: Bottom Right */}
              <div className="bg-white p-5 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transform lg:hover:-rotate-3 transition-all duration-700">
                <div className="w-10 h-10 bg-[#f7fee7] rounded-lg mb-3"></div>
                <h4 className="text-[#1a340a] font-black text-lg mb-2 leading-tight">
                  Seamless Payments
                </h4>
                <p className="text-[#1a340a]/70 text-[10px] leading-relaxed font-bold tracking-wide uppercase opacity-90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
