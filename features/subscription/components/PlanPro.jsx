import PlanBasic from "./PlanBasic";

/** Pro tier uses the same card layout as Basic; copy and features come from `plan` in config. */
export default function PlanPro(props) {
  return <PlanBasic {...props} />;
}
