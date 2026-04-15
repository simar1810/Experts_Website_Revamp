import Image from "next/image";
import { discoverHeroContent } from "@/lib/data/discoverProgramsContent";

export function DiscoverHero() {
  const c = discoverHeroContent;

  return (
    <section className="relative isolate mb-8 overflow-x-clip bg-white py-6 sm:mb-12 sm:py-14 lg:flex lg:min-h-[min(40rem,82vh)] lg:items-stretch lg:py-16">
      {/* Image: wide banner on mobile; flush right on lg */}
      <div className="relative order-1 aspect-video w-full sm:aspect-3/4 sm:min-h-88 lg:absolute lg:inset-y-0 lg:left-1/2 lg:right-0 lg:order-0 lg:aspect-auto lg:min-h-0 lg:h-full lg:w-auto">
        <div className="relative h-full w-full overflow-hidden rounded-bl-[2.5rem] rounded-br-none rounded-tr-none sm:rounded-bl-[4.5rem] lg:rounded-bl-[5rem]">
          <Image
            src={c.imageSrc}
            alt={c.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Text: stays on the normal content grid; lg width reserves the left half */}
      <div className="order-2 px-4 pt-6 sm:px-6 sm:pt-14 lg:relative lg:z-10 lg:flex lg:w-1/2 lg:shrink-0 lg:items-center lg:px-0 lg:py-0 lg:pl-[max(1rem,calc((100vw-80rem)/2+2rem))] lg:pr-10 xl:pr-14">
        <div className="max-w-xl">
          <span className="mb-3 inline-flex w-fit rounded-full bg-[#ACF847] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#457000] sm:mb-4 sm:px-4 sm:py-2 sm:text-[0.6875rem]">
            {c.badge}
          </span>
          <h1 className="font-lexend text-5xl font-bold max-md:leading-12 leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl xl:text-7xl">
            {c.titleBefore}
            <br />
            <span className="text-[#67BC2A]">{c.titleHighlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {c.description}
          </p>
        </div>
      </div>
    </section>
  );
}
