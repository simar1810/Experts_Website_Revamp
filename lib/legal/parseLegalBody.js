/**
 * Turn plain multiline legal text (from LEGAL-CONTENT) into render nodes
 * (headings, paragraphs, lists) for readable HTML layout.
 */

function slugifyId(text, used) {
  const base = text
    .toLowerCase()
    .replace(/^\d+(\.\d+)*\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  let id = base || "section";
  if (used.has(id)) {
    used.set(id, used.get(id) + 1);
    id = `${id}-${used.get(id)}`;
  } else {
    used.set(id, 0);
  }
  return id;
}

function isH2(t) {
  if (!/^\d+\.\s+/.test(t)) return false;
  return !/^\d+\.\d+/.test(t);
}

function isH3(t) {
  return /^\d+\.\d+(\.\d+)*\s+/.test(t);
}

/**
 * Heuristic: lines that are typically stacked list rows in the source file
 * (not full numbered clauses, which are h3).
 */
function isProbableListItem(t) {
  const s = t.trim();
  if (!s) return false;
  if (isH2(s) || isH3(s)) return false;

  if (s.length > 300) return false;
  if (s.endsWith(":") && s.length < 200) return false;
  if (
    /^(This|These|We |When |The |In |By |It |By continuing|If you|You agree|We may|WellnessZ |MOHI |Email:|Registered|Grievance|Brand:)/i.test(
      s,
    ) &&
    s.length > 80
  ) {
    return false;
  }
  if (s.length > 200) {
    if (/\b(shall|will|must|may not|agree|represents|constitute)\b/i.test(s) && s.includes(".")) {
      return false;
    }
  }
  if (s.length > 180) {
    if (s.includes(". ") && s.length > 120) return false;
    return true;
  }
  if (s.length < 200) {
    if (!s.includes(". ")) {
      if (s.endsWith(".") && s.length > 100 && /^(This|That|It |They )/i.test(s)) {
        return false;
      }
      return true;
    }
  }
  return s.length < 100;
}

export function parseLegalBody(body) {
  const lines = body.split("\n");
  const nodes = [];
  const pBuf = [];
  const liBuf = [];
  const idUsed = new Map();

  const flushP = () => {
    if (pBuf.length) {
      const text = pBuf.map((l) => l.trim()).join(" ");
      if (text) {
        nodes.push({ type: "p", text });
      }
      pBuf.length = 0;
    }
  };

  const flushUl = () => {
    if (liBuf.length) {
      const items = liBuf.map((l) => l.trim()).filter(Boolean);
      if (items.length) nodes.push({ type: "ul", items });
      liBuf.length = 0;
    }
  };

  const flush = () => {
    flushP();
    flushUl();
  };

  for (const raw of lines) {
    const t = raw.trim();

    if (!t) {
      flushP();
      continue;
    }

    if (isH2(t)) {
      flush();
      const id = slugifyId(t, idUsed);
      nodes.push({ type: "h2", text: t, id });
      continue;
    }
    if (isH3(t)) {
      flush();
      const id = slugifyId(t, idUsed);
      // Full-line clauses (e.g. "1.2 Unless, …" on one long line) read better as
      // a numbered paragraph; short H3s like "2.1 Identity and Contact Data" keep as headings.
      if (t.length > 200) {
        const m = t.match(/^(\d+\.\d+(\.\d+)*)\s+([\s\S]+)$/);
        if (m && m[3]) {
          nodes.push({
            type: "clause",
            id,
            number: m[1],
            body: m[3].trim(),
            text: t,
          });
        } else {
          nodes.push({ type: "p", text: t });
        }
      } else {
        nodes.push({ type: "h3", text: t, id });
      }
      continue;
    }

    if (isProbableListItem(t)) {
      flushP();
      liBuf.push(t);
    } else {
      flushUl();
      pBuf.push(t);
    }
  }

  flush();
  return nodes;
}

/**
 * @param {{ includeH3?: boolean, includeClauses?: boolean }} [opts] — By default
 *   only H2 (major section titles) is listed; enable H3 for sub-clauses, or
 *   clauses for long paragraph-style numbered items.
 */
export function getTocEntries(nodes, opts = {}) {
  const { includeH3 = false, includeClauses = false } = opts;
  const out = [];
  for (const n of nodes) {
    if (n.type === "h2") out.push({ level: 2, text: n.text, id: n.id });
    if (includeH3 && n.type === "h3")
      out.push({ level: 3, text: n.text, id: n.id });
    if (includeClauses && n.type === "clause") {
      const short =
        n.body.length > 52 ? `${n.body.slice(0, 52).trimEnd()}…` : n.body;
      out.push({ level: 3, text: `${n.number} ${short}`, id: n.id });
    }
  }
  return out;
}
