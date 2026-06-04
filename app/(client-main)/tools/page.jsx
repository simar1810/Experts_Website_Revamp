import ToolsLandingPage from "@/features/tools/components/ToolsLandingPage";

export const metadata = {
  title: "Health Tools | Zeefit",
  description:
    "Use Zeefit's BMR calculator, periods calculator, and PCOD quiz.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsLandingPage />;
}
