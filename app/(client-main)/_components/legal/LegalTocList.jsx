import Link from "next/link";

/**
 * Sticky "On this page" navigation (h2 + h3) — mobile collapsible, desktop aside.
 */
export default function LegalTocList({ entries, className = "" }) {
  if (!entries.length) return null;

  return (
    <>
      <details
        className={`font-lato rounded-xl border border-stone-200/90 bg-white p-4 shadow-sm lg:hidden ${className}`}
      >
        <summary className="cursor-pointer text-sm font-semibold text-neutral-900">
          On this page
        </summary>
        <ol className="mt-3 max-h-[min(50vh,20rem)] list-none space-y-1.5 overflow-y-auto text-sm text-neutral-600">
          {entries.map((e, idx) => (
            <li
              key={`${e.id}-${idx}`}
              className={e.level === 2 ? "pl-0" : "border-l border-stone-200 pl-2.5"}
            >
              <Link
                href={`#${e.id}`}
                className="inline-block break-words text-lime-800/90 hover:text-lime-950 hover:underline"
              >
                {e.text}
              </Link>
            </li>
          ))}
        </ol>
      </details>

      <nav
        className={`font-lato hidden lg:block ${className}`}
        aria-label="On this page"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
          On this page
        </p>
        <ol className="sticky top-24 max-h-[min(80vh,40rem)] list-none space-y-2 overflow-y-auto pr-1 text-sm">
          {entries.map((e, idx) => (
            <li
              key={`${e.id}-aside-${idx}`}
              className={e.level === 2 ? "pl-0" : "border-l-2 border-stone-200 pl-2.5 text-neutral-600"}
            >
              <Link
                href={`#${e.id}`}
                className="inline-block break-words text-neutral-600 transition-colors hover:text-lime-900"
              >
                {e.text}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
