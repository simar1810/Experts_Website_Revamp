import LegalDocumentPage from "@/app/(client-main)/_components/legal/LegalDocumentPage";
import { getCookiePolicyText } from "@/lib/legal/getLegalContent";

export const metadata = {
  title: "Cookie policy | Zeefit",
  description:
    "How Zeefit uses cookies and similar technologies on the platform.",
};

export default function CookiePolicyPage() {
  return (
    <LegalDocumentPage
      sourceMarkdown={getCookiePolicyText()}
      activeHref="/legal/cookie-policy"
    />
  );
}
