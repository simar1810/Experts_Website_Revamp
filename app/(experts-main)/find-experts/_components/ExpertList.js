import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertCard from "./ExpertCard";

export default function ExpertList({ experts, profilePaths }) {
  if (!Array.isArray(experts)) return null;
  return (
    <>
      {experts.map((expert, i) => {
        const lid = resolveListingId(expert);
        return (
          <div
            key={String(
              expert._id ?? expert.coach?._id ?? expert.id ?? `ex-${i}`,
            )}
          >
            <ExpertCard
              expert={expert}
              profileHref={
                lid && profilePaths?.[lid] ? profilePaths[lid] : undefined
              }
            />
          </div>
        );
      })}
    </>
  );
}
