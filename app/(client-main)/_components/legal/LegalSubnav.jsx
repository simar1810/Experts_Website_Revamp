import Link from "next/link";

const LINKS = [
  { href: "/legal/user-terms", label: "User terms" },
  { href: "/legal/business-terms", label: "Business terms" },
  { href: "/legal/privacy-policy", label: "Privacy" },
  { href: "/legal/cookie-policy", label: "Cookies" },
  { href: "/legal/cookie-settings", label: "Cookie settings" },
];

export default function LegalSubnav({ activeHref }) {
  return (
    <nav
      className="mt-8 flex max-w-full flex-wrap gap-2 font-lato sm:gap-3"
      aria-label="Legal information"
    >
      {LINKS.map(({ href, label }) => {
        const isActive = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
              isActive
                ? "border-lime-700/30 bg-lime-50/90 text-lime-900"
                : "border-stone-200/90 bg-stone-50/80 text-neutral-600 hover:border-stone-300 hover:bg-white hover:text-neutral-900",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
