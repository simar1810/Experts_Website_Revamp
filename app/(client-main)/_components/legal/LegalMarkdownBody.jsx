import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { getMarkdownH2TocEntries } from "@/lib/legal/parseLegalMarkdown";
import TocList from "./LegalTocList";

const mdComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={`text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl ${className || ""}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={`scroll-mt-24 border-b border-stone-200/90 pb-2 pt-8 text-xl font-bold tracking-tight text-neutral-900 sm:pt-10 sm:text-2xl ${className || ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`mb-1 mt-6 scroll-mt-24 text-base font-semibold text-neutral-900 first:mt-0 sm:text-lg ${className || ""}`}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={`mt-4 text-sm font-semibold text-neutral-800 ${className || ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={`mb-4 text-[15px] leading-[1.7] text-neutral-700 sm:text-base sm:leading-relaxed ${className || ""}`}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={`mb-5 list-outside list-disc space-y-1.5 pl-5 text-[15px] text-neutral-700 sm:text-base ${className || ""}`}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={`mb-5 list-outside list-decimal space-y-1.5 pl-5 text-[15px] text-neutral-700 sm:text-base ${className || ""}`}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      className={`leading-[1.65] [padding-inline-start:0.2em] ${className || ""}`}
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-stone-200/80" {...props} />,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`mb-4 border-l-2 border-lime-200/80 pl-4 text-neutral-700 ${className || ""}`}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={`font-semibold text-neutral-900 ${className || ""}`} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={`font-medium text-lime-800 underline decoration-lime-700/30 underline-offset-2 hover:text-lime-950 ${className || ""}`}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={`rounded bg-stone-100 px-1.5 py-0.5 text-sm text-neutral-800 ${className || ""}`}
      {...props}
    />
  ),
};

/**
 * Renders full markdown with GFM, heading ids (for in-page links), and optional ToC.
 */
export default function LegalMarkdownBody({
  markdown,
  showToc = true,
  tocMode = "h2",
  /** when false, content spans full width of the parent (e.g. cookie details block) */
  constrain = true,
}) {
  if (!markdown?.trim()) {
    return null;
  }

  const toc = showToc
    ? getMarkdownH2TocEntries(markdown, { includeH3: tocMode === "full" })
    : [];

  const hasToc = showToc && toc.length > 0;
  const noTocNarrow = !hasToc && constrain ? "max-w-3xl" : "";
  return (
    <div
      className={
        hasToc
          ? "font-lato lg:grid lg:grid-cols-[1fr,13.5rem] lg:items-start lg:gap-10 xl:grid-cols-[1fr,15rem] xl:gap-12"
          : `font-lato ${noTocNarrow}`.trim()
      }
    >
      {hasToc ? (
        <TocList
          entries={toc.map((e) => ({ level: e.level, text: e.text, id: e.id }))}
          className="mb-2 lg:order-2 lg:mb-0"
        />
      ) : null}
      <div
        className={hasToc ? "min-w-0 scroll-smooth lg:order-1" : "min-w-0 scroll-smooth"}
        data-legal-md
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={mdComponents}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
