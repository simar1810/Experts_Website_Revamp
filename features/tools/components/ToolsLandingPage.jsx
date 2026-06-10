import Link from "next/link";
import { Activity, CalendarDays, ClipboardList, ArrowRight } from "lucide-react";
import { tools } from "@/features/tools/data";

const icons = {
  "bmr-calculator": Activity,
  "periods-calculator": CalendarDays,
  "pcod-quiz": ClipboardList,
};

export default function ToolsLandingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbf1_0%,#ffffff_45%,#f7fbf1_100%)] font-lato text-neutral-900">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#67BC2A]">
            Health Tools
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#163d18] sm:text-6xl">
            Simple wellness calculators for everyday decisions
          </h1>
          <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">
            Use Zeefit tools to estimate your daily energy needs, understand
            cycle patterns, and take a quick PCOD awareness quiz.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = icons[tool.slug];
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group flex min-h-72 flex-col rounded-[2rem] border border-[#dfeecb] bg-white p-6 shadow-[0_24px_60px_rgba(22,61,24,0.08)] transition hover:-translate-y-1 hover:border-[#67BC2A] hover:shadow-[0_28px_70px_rgba(22,61,24,0.14)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#67BC2A]/10 text-[#4f9722]">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="mt-7 text-2xl font-black text-[#163d18]">
                  {tool.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                  {tool.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#4f9722]">
                  {tool.cta}
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
