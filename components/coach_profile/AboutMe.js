export default function AboutMe({ coachData }) {
    const name = coachData?.coach?.name || 'Dr. Shantanu Jambhekar';
    const bio1 =
        coachData?.expertDetails?.bio ||
        'Medicine is not merely the absence of disease; it is the presence of peak vitality. At Vitalis Glass, we treat the human frame as a premium portfolio—one that requires precision maintenance and editorial care.';
    const bio2 =
        'Our approach bridges the gap between high-performance sports medicine and long-term joint health, ensuring every patient moves with the grace and power of their prime years.';

    return (
        <section className="w-full bg-[#F0F5EE] px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                {/* ── LEFT: Image card ── */}
                <div className="flex-shrink-0 w-full max-w-[340px] lg:w-[380px] h-[340px] lg:h-[400px] rounded-[1.8rem] overflow-hidden shadow-xl">
                    <img
                        src="/images/about-me-visual.png"
                        alt="About visual"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback: render a teal gradient placeholder
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background =
                                'linear-gradient(145deg, #0e6655 0%, #1abc9c 50%, #0d5e50 100%)';
                        }}
                    />
                </div>

                {/* ── RIGHT: Text ── */}
                <div className="flex-1 space-y-5 text-center lg:text-left">

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0D3B1E] tracking-tight">
                        About Me
                    </h2>

                    {/* Bio paragraphs */}
                    <p className="text-gray-500 text-sm leading-[1.7] font-medium max-w-xl mx-auto lg:mx-0">
                        {bio1}
                    </p>
                    <p className="text-gray-500 text-sm leading-[1.7] font-medium max-w-xl mx-auto lg:mx-0">
                        {bio2}
                    </p>

                    {/* Author attribution */}
                    <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
                        <span className="w-8 h-[2px] bg-gray-700 inline-block" />
                        <span className="text-[#0D3B1E] text-sm font-bold tracking-wide">
                            {name}
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}