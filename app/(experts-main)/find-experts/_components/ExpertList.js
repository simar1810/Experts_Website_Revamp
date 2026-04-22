import { resolveListingId } from "@/lib/curatedShowcaseFromListing";
import ExpertCard from "./ExpertCard";
import { useRouter } from "next/navigation";
import { generateNavigationLink } from "@/lib/helpers"

export default function ExpertList({ experts, profilePaths }) {
  const router = useRouter()
  if (!Array.isArray(experts)) return null;
  return (
    <>
      {experts.map((expert, i) => {
        const lid = resolveListingId(expert);
        return (
          <div
            onClick={() => router.push(generateNavigationLink({
              coachName: expert?.coach?.name?.split("_")?.join("-"),
              category: expert?.specializations?.at(0),
              location: expert?.coach?.city
            }))}
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
