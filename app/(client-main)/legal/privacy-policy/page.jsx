import LegalDocumentPage from "@/app/(client-main)/_components/legal/LegalDocumentPage";
import { getPrivacyPolicyText } from "@/lib/legal/getLegalContent";

export const metadata = {
  title: "Privacy policy | WellnessZ Experts",
  description:
    "How WellnessZ Experts collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      sourceMarkdown={getPrivacyPolicyText()}
      activeHref="/legal/privacy-policy"
    />
  );
}
