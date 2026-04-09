/** URL segment: lowercase, hyphenated, ASCII-ish. */
export function slugifySegment(value) {
  if (value == null) return "expert";
  const s = String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  if (!s) return "expert";
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "expert"
  );
}
