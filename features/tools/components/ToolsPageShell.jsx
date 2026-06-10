import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ToolsPageShell({
  eyebrow = "Zeefit Tools",
  title,
  description,
  children,
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbf1_0%,#ffffff_38%,#f7fbf1_100%)] font-lato text-neutral-900">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#4f9722] transition hover:text-[#2f6b28]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to tools
        </Link>
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#67BC2A]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#163d18] sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </section>
    </main>
  );
}
