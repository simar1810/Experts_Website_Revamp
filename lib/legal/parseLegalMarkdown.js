import GithubSlugger from "github-slugger";

/**
 * Splits a full legal .md file into hero fields + the article body.
 * Expects, in order: `# Brand`, `## Document title`, `**Version:** x.x`, then the rest
 * of the file (headings, lists, **bold** — rendered as-is by ReactMarkdown).
 */
export function parseLegalDocumentMarkdown(source) {
  const normalized = source.replace(/^\uFEFF/, "");
  const m = normalized.match(
    /^(#.+?\n)(?:[ \t]*\n)?(##.+?\n)(?:[ \t]*\n)?(\*\*Version:\*\*.+?\n)(?:[ \t]*\n)*/s,
  );
  if (m) {
    const after = normalized.slice(m[0].length);
    return {
      brand: stripLineMd(m[1].replace(/^#\s*/, "")),
      title: stripLineMd(m[2].replace(/^##\s*/, "")),
      version: (m[3].match(/\*\*Version:\*\*\s*([\d.]+)/) || m[3].match(/([\d.]+)/))?.[1] ?? "",
      body: after.trim(),
    };
  }
  return {
    brand: "",
    title: "Legal",
    version: "",
    body: normalized.trim(),
  };
}

function stripLineMd(s) {
  return s
    .replace(/\\/g, "")
    .replace(/\*\*/g, "")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

/**
 * Build ToC from `##` lines in the markdown body (main sections), using the same
 * slug algorithm as rehype-slug / GitHub.
 */
/** For cookie settings: page title from first `#` line, body without that line. */
export function splitLeadingH1(md) {
  if (!md) return { title: "", rest: "" };
  const t = md.match(/^#\s+([^\n]+)\n*/);
  if (!t) return { title: "", rest: md.trim() };
  return { title: stripLineMd(t[1]), rest: md.slice(t[0].length).trim() };
}

export function getMarkdownH2TocEntries(body, opts = {}) {
  const { includeH3 = false } = opts;
  const slugger = new GithubSlugger();
  const out = [];
  if (!body) return out;

  const re = /^(##|###)\s+(.+)$/gm;
  let x;
  while ((x = re.exec(body)) !== null) {
    const level = x[1] === "##" ? 2 : 3;
    if (level === 3 && !includeH3) continue;
    const text = stripLineMd(x[2]);
    if (!text) continue;
    const id = slugger.slug(text);
    out.push({ level, text, id });
  }
  return out;
}
