import {
  discoverHeroContent,
  discoverHeroSlides,
} from "@/lib/data/discoverProgramsContent";
import { pageHeroTypography as t } from "@/lib/pageHeroTypography";
import { DiscoverHeroSlideshow } from "./DiscoverHeroSlideshow";

export function DiscoverHero() {
  const c = discoverHeroContent;

  return (
    <section className="relative isolate mb-8 overflow-x-clip bg-white py-6 sm:mb-12 sm:py-14 lg:flex lg:min-h-[min(34rem,72vh)] lg:items-stretch lg:py-14">
      {/* Image: wide banner on mobile; flush right on lg */}
      <div className="relative order-1 aspect-video w-full sm:aspect-3/4 sm:min-h-72 lg:absolute lg:inset-y-0 lg:top-0 lg:right-0 lg:left-[58%] lg:order-0 lg:aspect-auto lg:min-h-0 lg:h-full lg:w-auto">
        <div className="relative h-full w-full overflow-hidden rounded-bl-[2.5rem] rounded-br-none rounded-tr-none sm:rounded-bl-[4.5rem] lg:rounded-bl-[5rem]">
          <DiscoverHeroSlideshow
            slides={discoverHeroSlides}
            intervalMs={c.heroSlideIntervalMs}
          />
        </div>
      </div>

      <div className="order-2 px-4 pt-6 sm:px-6 sm:pt-14 lg:relative lg:z-10 lg:flex lg:w-[58%] lg:shrink-0 lg:items-center lg:px-0 lg:py-0 lg:pl-[max(1rem,calc((100vw-80rem)/2+2rem))] lg:pr-8 xl:pr-10">
        <div className="w-full max-w-xl lg:max-w-none">
          <span className="mb-3 inline-flex w-fit rounded-full bg-[#ACF847] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#457000] sm:mb-4 sm:px-4 sm:py-2 sm:text-[0.6875rem]">
            {c.badge}
          </span>
          <h1 className={t.h1}>
            <span className={t.lineBlack}>{c.titleBefore}</span>
            <br />
            <span className={`${t.lineGreen} lg:whitespace-nowrap`}>
              {c.titleHighlight}
            </span>
          </h1>
          <p className={`${t.descriptionSpacing} ${t.description}`}>
            {c.description}
          </p>
        </div>
      </div>
    </section>
  );
}
