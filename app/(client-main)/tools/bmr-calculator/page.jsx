import BMRCalculator from "@/features/tools/components/BMRCalculator";
import ToolsPageShell from "@/features/tools/components/ToolsPageShell";

export const metadata = {
  title: "BMR Calculator | Zeefit",
  description:
    "Estimate your basal metabolic rate and daily resting energy needs.",
  alternates: {
    canonical: "/tools/bmr-calculator",
  },
};

export default function BMRCalculatorPage() {
  return (
    <ToolsPageShell
      title="BMR Calculator"
      description="Estimate your basal metabolic rate using standard formulas and metric or US units."
    >
      <BMRCalculator />
    </ToolsPageShell>
  );
}
