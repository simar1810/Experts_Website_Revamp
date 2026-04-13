import Link from "next/link";
import { finalCtaContent } from "@/lib/data/landingContent";

export function FinalCtaSection() {
  const c = finalCtaContent;

  return (
    <section className="bg-[#F9FBE7] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-8 inline-block rounded-full bg-[#3572001A] px-5 py-2.5 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.22em] text-[#67BC2A]">
          {c.badge}
        </span>

        <h2 className="font-montserrat font-extrabold uppercase leading-[1.08] tracking-tight text-[#064E3B]">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem]">
            {c.line1}
          </span>
          <span className="relative mx-auto mt-1 font-black block w-fit pb-1 text-4xl sm:text-5xl md:text-6xl lg:text-[4.1rem]">
            <span className="bg-linear-to-r from-[#03632C] to-[#67BC2A] bg-clip-text text-transparent">
              {c.line2}
            </span>
          </span>
          <span className="mx-auto mt-4 block w-fit pb-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {c.line3}
          </span>
        </h2>

        <div className="mt-12 flex flex-row items-center justify-center gap-8 sm:flex-row sm:gap-10">
          <Link
            href="/find-experts"
            className="inline-flex min-w-[200px] items-center justify-center rounded-lg bg-gradient-to-r from-[#357200] to-[#03632C] sm:px-10 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-xl shadow-black/20 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03632C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9FBE7] sm:text-base"
          >
            {c.primaryCta}
          </Link>

          <a
            href="#top-programs"
            className="relative inline-block pt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9FBE7]"
          >
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#064E3B] sm:text-base">
              {c.secondaryCta}
            </span>
            <span
              className="absolute left-1/2 top-full mt-2 h-0.5 w-[calc(100%+1.25rem)] -translate-x-1/2 bg-[#4CAF50]"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </section>
  );
}
