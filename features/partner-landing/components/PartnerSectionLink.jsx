"use client";

import { PartnerLandingTheme } from "../domain/PartnerLandingTheme";

function sectionId(section) {
  return section === "products"
    ? PartnerLandingTheme.SECTION_PRODUCTS_ID
    : PartnerLandingTheme.SECTION_EXPERTS_ID;
}

/**
 * In-page anchor that smooth-scrolls to #experts or #products on the partner landing page.
 */
export default function PartnerSectionLink({
  section,
  className = "",
  children,
}) {
  const target = sectionId(section);

  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        document.getElementById(target)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {children}
    </a>
  );
}
