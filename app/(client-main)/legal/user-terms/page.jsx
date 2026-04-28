import LegalDocumentPage from "@/app/(client-main)/_components/legal/LegalDocumentPage";
import { getUserTermsText } from "@/lib/legal/getLegalContent";

export const metadata = {
  title: "User terms | Zeefit",
  description:
    "User terms and conditions for using the Zeefit platform.",
};

export default function UserTermsPage() {
  return (
    <LegalDocumentPage
      sourceMarkdown={getUserTermsText()}
      activeHref="/legal/user-terms"
    />
  );
}
