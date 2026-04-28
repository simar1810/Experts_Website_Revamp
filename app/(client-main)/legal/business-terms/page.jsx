import LegalDocumentPage from "@/app/(client-main)/_components/legal/LegalDocumentPage";
import { getBusinessTermsText } from "@/lib/legal/getLegalContent";

export const metadata = {
  title: "Business terms | Zeefit
  description:
    "Business terms and conditions for experts and partners on Zeefit.",
};

export default function BusinessTermsPage() {
  return (
    <LegalDocumentPage
      sourceMarkdown={getBusinessTermsText()}
      activeHref="/legal/business-terms"
    />
  );
}
