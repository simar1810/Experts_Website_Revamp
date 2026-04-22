import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getCookieSettingsShortFooterText } from "@/lib/legal/getLegalContent";

const linkClassName =
  "font-medium text-lime-800 underline decoration-lime-700/40 underline-offset-2 transition-colors hover:text-lime-900";

/**
 * Renders the short footer with Markdown (e.g. **Cookie Policy**) turned into
 * in-app links where appropriate.
 */
export default function CookieSettingsFooterNote() {
  const raw = getCookieSettingsShortFooterText();
  if (!raw?.trim()) {
    return null;
  }

  return (
    <div className="text-sm leading-relaxed text-neutral-600">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="m-0">{children}</p>,
          strong: ({ children }) => {
            const text = String(children).replace(/\s+/g, " ").trim();
            if (text === "Cookie Settings") {
              return (
                <Link href="/legal/cookie-settings" className={linkClassName}>
                  Cookie Settings
                </Link>
              );
            }
            if (text === "Cookie Policy") {
              return (
                <Link href="/legal/cookie-policy" className={linkClassName}>
                  Cookie Policy
                </Link>
              );
            }
            if (text === "Privacy Policy") {
              return (
                <Link href="/legal/privacy-policy" className={linkClassName}>
                  Privacy Policy
                </Link>
              );
            }
            return <strong className="font-semibold text-neutral-800">{children}</strong>;
          },
        }}
      >
        {raw.trim()}
      </ReactMarkdown>
    </div>
  );
}
