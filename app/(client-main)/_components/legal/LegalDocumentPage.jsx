import Link from "next/link";
import LegalMarkdownBody from "./LegalMarkdownBody";
import LegalSubnav from "./LegalSubnav";
import { parseLegalDocumentMarkdown } from "@/lib/legal/parseLegalMarkdown";

/**
 * Renders a legal document from full markdown (lib/constants/legal/*.md):
 * `#` brand, `##` title, `**Version:**`, then body with GFM (lists, bold, `---`).
 */
export default function LegalDocumentPage({
  sourceMarkdown,
  backLabel = "Back to home",
  activeHref,
  tocMode = "h2",
}) {
  const { brand, title, version, body } =
    parseLegalDocumentMarkdown(sourceMarkdown);

  return (
    <div className="min-h-full bg-stone-50/80 font-lato text-neutral-900">
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href="/"
            className="text-sm font-medium text-lime-700/90 transition-colors hover:text-lime-800"
          >
            ← {backLabel}
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            {brand || "WELLNESSZ EXPERTS"}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {title || "Legal"}
          </h1>
          {version ? (
            <p className="mt-3 text-sm text-neutral-600">
              <span className="rounded-md bg-stone-100 px-2.5 py-1 font-medium text-neutral-700">
                Version {version}
              </span>
            </p>
          ) : null}
          {activeHref ? <LegalSubnav activeHref={activeHref} /> : null}
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-stone-200/60 bg-white/90 p-5 shadow-sm sm:p-8 lg:p-10">
          <LegalMarkdownBody
            markdown={body}
            showToc
            tocMode={tocMode}
          />
        </div>
      </article>
    </div>
  );
}
