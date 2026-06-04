import PCODQuiz from "@/features/tools/components/PCODQuiz";
import ToolsPageShell from "@/features/tools/components/ToolsPageShell";

export const metadata = {
  title: "PCOD Quiz | Zeefit",
  description:
    "Take a quick guided quiz to review common PCOD and PCOS lifestyle signals.",
  alternates: {
    canonical: "/tools/pcod-quiz",
  },
};

export default function PCODQuizPage() {
  return (
    <ToolsPageShell
      title="PCOD Quiz"
      description="Answer a quick guided quiz to understand common PCOD and PCOS lifestyle signals."
    >
      <PCODQuiz />
    </ToolsPageShell>
  );
}
