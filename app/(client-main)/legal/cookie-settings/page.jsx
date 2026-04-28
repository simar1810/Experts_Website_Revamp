import CookieSettingsClient from "@/app/(client-main)/_components/legal/CookieSettingsClient";
import LegalMarkdownBody from "@/app/(client-main)/_components/legal/LegalMarkdownBody";
import LegalSubnav from "@/app/(client-main)/_components/legal/LegalSubnav";
import {
  getCookieSettingsCategoriesText,
  getCookieSettingsHeaderText,
} from "@/lib/legal/getLegalContent";
import { splitLeadingH1 } from "@/lib/legal/parseLegalMarkdown";
import Link from "next/link";
import CookieSettingsFooterNote from "./CookieSettingsFooterNote";

export const metadata = {
  title: "Cookie settings | Zeefit",
  description:
    "Choose which optional cookies to allow on Zeefit. Essential cookies always stay on.",
};

export default function CookieSettingsPage() {
  const header = getCookieSettingsHeaderText();
  const categories = getCookieSettingsCategoriesText();
  const { title: pageTitle, rest: introMd } = splitLeadingH1(header);

  return (
    <div className="min-h-full bg-stone-50/80 font-lato text-neutral-900">
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href="/"
            className="text-sm font-medium text-lime-700/90 transition-colors hover:text-lime-800"
          >
            ← Back to home
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {pageTitle || "Cookie settings"}
          </h1>
          <LegalSubnav activeHref="/legal/cookie-settings" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        {introMd ? (
          <div className="text-sm sm:text-base">
            <LegalMarkdownBody
              markdown={introMd}
              showToc={false}
              constrain={false}
            />
          </div>
        ) : null}

        <section
          className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm sm:p-7"
          aria-labelledby="cookie-prefs-heading"
        >
          <h2
            id="cookie-prefs-heading"
            className="text-lg font-bold text-neutral-900"
          >
            Your choices
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Use the controls below, then save. You can return here from the
            footer anytime.
          </p>
          <div className="mt-6">
            <CookieSettingsClient />
          </div>
        </section>

        <section
          className="rounded-2xl border border-stone-200/60 bg-white/90 p-5 shadow-sm sm:p-8 lg:p-10"
          aria-labelledby="category-details-heading"
        >
          <h2
            id="category-details-heading"
            className="text-base font-bold text-neutral-900 sm:text-lg"
          >
            Full details by category
          </h2>
          <p className="mb-6 mt-1 text-sm text-neutral-600">
            Reference text from your legal copy, formatted for reading.
          </p>
          {categories ? (
            <LegalMarkdownBody
              markdown={categories}
              showToc={false}
              tocMode="h2"
              constrain={false}
            />
          ) : null}
        </section>

        <div className="border-t border-stone-200/80 pt-6">
          <CookieSettingsFooterNote />
        </div>
      </div>
    </div>
  );
}
