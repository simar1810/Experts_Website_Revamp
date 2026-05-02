import Image from "next/image";
import { secondaryHeroContent } from "@/lib/data/landingContent";

const rippleStyle = {
  background: `repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 48px,
    rgba(255, 255, 255, 0.078) 48px,
    rgba(255, 255, 255, 0.078) 50px
  )`,
};

export function SecondaryHeroSection() {
  const c = secondaryHeroContent;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#67BC2A] to-[#03632C] py-24 font-lato">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[50%] h-[min(120vw,880px)] w-[min(120vw,880px)] -translate-x-1/2 -translate-y-1/2 opacity-90"
        style={rippleStyle}
      />

      <div className="relative z-1 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-lexend bg-linear-to-b from-[#FFFFFF] to-[#CCCCCC] bg-clip-text text-[clamp(2rem,6.2vw,3.75rem)] leading-[1.15] tracking-tight text-transparent">
          <span className="block">{c.headlineBefore.trim()}</span>
          <span className="mt-1.5 block sm:mt-2">{c.headlineAfter}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-white/55 sm:text-lg">
          {c.subheadline}
        </p>
      </div>

      {/* <div className="relative z-1 w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: `${c.imageWidth} / ${c.imageHeight * 0.6}`,
          }}
        >
          <Image
            src={c.imageSrc}
            alt={c.imageAlt}
            fill
            loading="lazy"
            fetchPriority="low"
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      </div> */}
    </section>
  );
}
