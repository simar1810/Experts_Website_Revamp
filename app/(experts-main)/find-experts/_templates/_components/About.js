"use client";

export default function About({ details, coachInfo }) {
  const name = coachInfo?.name || "This expert";
  const bio =
    details?.bio ||
    "Learn more about their background, approach, and how they support clients.";

  return (
    <section className="w-full bg-[#F0F5EE] px-4 sm:px-8 lg:px-10 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="rounded-[1.8rem] overflow-hidden bg-[#d8dfd4] min-h-[280px]">
          <img
            src="/images/about-me-visual.png"
            alt=""
            className="w-full h-full object-cover min-h-[280px]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="space-y-5 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f4f2b] tracking-tight">
            About {name}
          </h2>
          <p className="text-[#64756b] text-sm leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
            {bio}
          </p>
          {Array.isArray(details?.specializations) &&
            details.specializations.length > 1 && (
              <ul className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {details.specializations.slice(1).map((s) => (
                  <li
                    key={s}
                    className="text-[10px] font-bold uppercase tracking-wider bg-white/80 text-[#0f5e2b] px-3 py-1 rounded-full border border-[#0f5e2c]/10"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </section>
  );
}
