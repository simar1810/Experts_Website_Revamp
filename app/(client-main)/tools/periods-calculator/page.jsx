import PeriodsCalculator from "@/features/tools/components/PeriodsCalculator";
import ToolsPageShell from "@/features/tools/components/ToolsPageShell";

export const metadata = {
  title: "Periods Calculator | Zeefit",
  description:
    "Estimate upcoming period dates and probable ovulation windows.",
  alternates: {
    canonical: "/tools/periods-calculator",
  },
};

export default function PeriodsCalculatorPage() {
  return (
    <ToolsPageShell
      title="Periods Calculator"
      description="Project upcoming period dates and probable ovulation windows for the next six cycles."
    >
      <PeriodsCalculator />
    </ToolsPageShell>
  );
}
