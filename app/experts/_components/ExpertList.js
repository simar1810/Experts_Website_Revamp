import ExpertCard from "./ExpertCard";

export default function ExpertList({ experts }) {
  if (!Array.isArray(experts)) return null;
  return (
    <>
      {experts.map((expert, i) => (
        <ExpertCard key={i} expert={expert} />
      ))}
    </>
  );
}
